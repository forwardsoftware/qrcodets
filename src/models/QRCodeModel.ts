import type { QRCodeModel } from "../types";

import { QR8bitByte } from "./QR8bitByte";
import { QRBitBuffer } from "./QRBitBuffer";
import { QRPolynomial } from "./QRPolynomial";
import { getRSBlocks } from "./QRRSBlock";
import type { RSBlock } from "./QRRSBlock";
import {
  getBCHTypeInfo,
  getBCHTypeNumber,
  getErrorCorrectPolynomial,
  getLengthInBits,
  getLostPoint,
  getMask,
  getPatternPosition,
} from "./utils";

export class QRCodeModelImpl implements QRCodeModel {
  private typeNumber: number;
  private errorCorrectLevel: number;

  private modules: (boolean | null)[][];
  private moduleCount: number;

  private dataList: QR8bitByte[];
  private dataCache?: number[];

  private static readonly PAD0 = 0xec;
  private static readonly PAD1 = 0x11;

  constructor(typeNumber: number, errorCorrectLevel: number) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = [];
    this.moduleCount = 0;
    this.dataCache = undefined;
    this.dataList = [];
  }

  static createData(typeNumber: number, errorCorrectLevel: number, dataList: QR8bitByte[]) {
    const rsBlocks = getRSBlocks(typeNumber, errorCorrectLevel);
    const buffer = this.createDataBuffer(typeNumber, dataList);
    const totalDataCount = this.calculateTotalDataCount(rsBlocks);

    this.validateBufferSize(buffer, totalDataCount);
    this.padBuffer(buffer, totalDataCount);

    return this.createBytes(buffer, rsBlocks);
  }

  private static createDataBuffer(typeNumber: number, dataList: QR8bitByte[]): QRBitBuffer {
    const buffer = new QRBitBuffer();
    dataList.forEach((data) => {
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    });
    return buffer;
  }

  private static calculateTotalDataCount(rsBlocks: RSBlock[]): number {
    return rsBlocks.reduce((sum, block) => sum + block.dataCount, 0);
  }

  private static validateBufferSize(buffer: QRBitBuffer, totalDataCount: number): void {
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error(`code length overflow. (${buffer.getLengthInBits()} > ${totalDataCount * 8})`);
    }
  }

  private static padBuffer(buffer: QRBitBuffer, totalDataCount: number): void {
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false);
    }

    while (buffer.getLengthInBits() < totalDataCount * 8) {
      buffer.put(this.PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) break;
      buffer.put(this.PAD1, 8);
    }
  }

  static createBytes(buffer: QRBitBuffer, rsBlocks: RSBlock[]): number[] {
    const { dcdata, ecdata, maxDcCount, maxEcCount } = this.prepareDataBlocks(buffer, rsBlocks);
    return this.interleaveData(dcdata, ecdata, maxDcCount, maxEcCount, rsBlocks);
  }

  private static prepareDataBlocks(buffer: QRBitBuffer, rsBlocks: RSBlock[]) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata: number[][] = new Array(rsBlocks.length);
    const ecdata: number[][] = new Array(rsBlocks.length);

    rsBlocks.forEach((block, r) => {
      const { dcCount, ecCount } = this.processBlock(block, buffer, offset, r, dcdata, ecdata);
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      offset += dcCount;
    });

    return { dcdata, ecdata, maxDcCount, maxEcCount };
  }

  private static processBlock(
    block: RSBlock,
    buffer: QRBitBuffer,
    offset: number,
    r: number,
    dcdata: number[][],
    ecdata: number[][]
  ) {
    const dcCount = block.dataCount;
    const ecCount = block.totalCount - dcCount;

    dcdata[r] = this.extractData(buffer, offset, dcCount);
    ecdata[r] = this.generateErrorCorrection(dcdata[r], ecCount);

    return { dcCount, ecCount };
  }

  private static extractData(buffer: QRBitBuffer, offset: number, count: number): number[] {
    return Array.from({ length: count }, (_, i) => 0xff & buffer.buffer[i + offset]);
  }

  private static generateErrorCorrection(data: number[], ecCount: number): number[] {
    const rsPoly = getErrorCorrectPolynomial(ecCount);
    const rawPoly = new QRPolynomial(data, rsPoly.getLength() - 1);
    const modPoly = rawPoly.mod(rsPoly);

    if (!modPoly) {
      return Array(rsPoly.getLength() - 1).fill(0);
    }

    return Array.from({ length: rsPoly.getLength() - 1 }, (_, i) => {
      const modIndex = i + modPoly.getLength() - (rsPoly.getLength() - 1);
      return modIndex >= 0 ? modPoly.get(modIndex) : 0;
    });
  }

  private static interleaveData(
    dcdata: number[][],
    ecdata: number[][],
    maxDcCount: number,
    maxEcCount: number,
    rsBlocks: RSBlock[]
  ): number[] {
    const totalCodeCount = rsBlocks.reduce((sum, block) => sum + block.totalCount, 0);
    const data = new Array(totalCodeCount);
    let index = 0;

    // Interleave data blocks
    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }

    // Interleave error correction blocks
    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }

    return data;
  }

  addData(data: string): void {
    this.dataList.push(new QR8bitByte(data));
    this.dataCache = undefined;
  }

  isDark(row: number, col: number): boolean {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(`${row},${col}`);
    }
    return this.modules[row][col] || false;
  }

  getModuleCount(): number {
    return this.moduleCount;
  }

  make(): void {
    this.makeImpl(false, this.getBestMaskPattern());
  }

  private makeImpl(test: boolean, maskPattern: number): void {
    this.initializeModules();
    this.setupPatterns(test, maskPattern);
    this.mapData(this.getDataCache(), maskPattern);
  }

  private initializeModules(): void {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array(this.moduleCount)
      .fill(null)
      .map(() => Array(this.moduleCount).fill(null));
  }

  private setupPatterns(test: boolean, maskPattern: number): void {
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test);
    }
  }

  private getDataCache(): number[] {
    if (!this.dataCache) {
      this.dataCache = QRCodeModelImpl.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    }
    return this.dataCache;
  }

  private setupPositionProbePattern(row: number, col: number): void {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;

      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;

        const isPattern =
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4);

        this.modules[row + r][col + c] = isPattern;
      }
    }
  }

  private getBestMaskPattern(): number {
    let minLostPoint = 0;
    let bestPattern = 0;

    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i);
      const lostPoint = getLostPoint(this);

      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        bestPattern = i;
      }
    }

    return bestPattern;
  }

  private setupTimingPattern(): void {
    // Vertical timing pattern
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] != null) continue;
      this.modules[r][6] = r % 2 === 0;
    }

    // Horizontal timing pattern
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] != null) continue;
      this.modules[6][c] = c % 2 === 0;
    }
  }

  private setupPositionAdjustPattern(): void {
    const pos = getPatternPosition(this.typeNumber);

    pos.forEach((row) => {
      pos.forEach((col) => {
        if (this.modules[row][col] != null) return;

        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            this.modules[row + r][col + c] = r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
          }
        }
      });
    });
  }

  private setupTypeNumber(test: boolean): void {
    const bits = getBCHTypeNumber(this.typeNumber);

    // Vertical type number
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod;
    }

    // Horizontal type number
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number): void {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    const bits = getBCHTypeInfo(data);

    // Vertical type info
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
    }

    // Horizontal type info
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }

    this.modules[this.moduleCount - 8][8] = !test;
  }

  private mapData(data: number[], maskPattern: number): void {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;

      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] == null) {
            const dark = this.getNextBit(data, byteIndex, bitIndex);
            const mask = getMask(maskPattern, row, col - c);
            this.modules[row][col - c] = mask ? !dark : dark;

            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }

        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  private getNextBit(data: number[], byteIndex: number, bitIndex: number): boolean {
    return byteIndex < data.length && ((data[byteIndex] >>> bitIndex) & 1) === 1;
  }
}
