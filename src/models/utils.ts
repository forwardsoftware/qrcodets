import type { QRCodeModel } from "../types";

import { G15, G15_MASK, G18, PATTERN_POSITION_TABLE, QRMaskPattern, QRMode } from "./constants";
import { galoisFieldExp } from "./QRMath";
import { QRPolynomial } from "./QRPolynomial";

export function getBCHTypeInfo(data: number): number {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15)));
    }
    return ((data << 10) | d) ^ G15_MASK;
}

export function getBCHTypeNumber(data: number): number {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18)));
    }
    return (data << 12) | d;
}

export function getBCHDigit(data: number): number {
    let digit = 0;
    while (data !== 0) {
        digit++;
        data >>>= 1;
    }
    return digit;
}
export function getPatternPosition(typeNumber: number): number[] {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
}

export function getMask(maskPattern: number, i: number, j: number): boolean {
    switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
            return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001:
            return i % 2 === 0;
        case QRMaskPattern.PATTERN010:
            return j % 3 === 0;
        case QRMaskPattern.PATTERN011:
            return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case QRMaskPattern.PATTERN101:
            return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110:
            return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111:
            return ((i * j) % 3 + (i + j) % 2) % 2 === 0;
        default:
            throw new Error(`bad maskPattern: ${maskPattern}`);
    }
}

export function getErrorCorrectPolynomial(errorCorrectLength: number): QRPolynomial {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, galoisFieldExp(i)], 0));
    }
    return a;
}

export function getLostPoint(qrCode: QRCodeModel): number {
    const moduleCount = qrCode.getModuleCount();
    let lostPoint = 0;

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            let sameCount = 0;
            const dark = qrCode.isDark(row, col);
            for (let r = -1; r <= 1; r++) {
                if (row + r < 0 || moduleCount <= row + r) {
                    continue;
                }
                for (let c = -1; c <= 1; c++) {
                    if (col + c < 0 || moduleCount <= col + c) {
                        continue;
                    }
                    if (r === 0 && c === 0) {
                        continue;
                    }
                    if (dark === qrCode.isDark(row + r, col + c)) {
                        sameCount++;
                    }
                }
            }
            if (sameCount > 5) {
                lostPoint += (3 + sameCount - 5);
            }
        }
    }

    for (let row = 0; row < moduleCount - 1; row++) {
        for (let col = 0; col < moduleCount - 1; col++) {
            let count = 0;
            if (qrCode.isDark(row, col)) count++;
            if (qrCode.isDark(row + 1, col)) count++;
            if (qrCode.isDark(row, col + 1)) count++;
            if (qrCode.isDark(row + 1, col + 1)) count++;
            if (count === 0 || count === 4) {
                lostPoint += 3;
            }
        }
    }

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount - 6; col++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
                lostPoint += 40;
            }
        }
    }

    for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount - 6; row++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
                lostPoint += 40;
            }
        }
    }

    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount; row++) {
            if (qrCode.isDark(row, col)) {
                darkCount++;
            }
        }
    }

    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
}

export function encodeUTF8(str: string): number[] {
    const bytes: number[] = [];
    
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        const byteArray = getUTF8Bytes(code);
        bytes.push(...byteArray);
    }

    // Add UTF-8 BOM if the encoded length differs from input length
    if (bytes.length !== str.length) {
        bytes.unshift(0xEF, 0xBB, 0xBF);
    }

    return bytes;
}

function getUTF8Bytes(code: number): number[] {
    if (code > 0x10000) {
        return [
            0xF0 | ((code & 0x1C0000) >>> 18),
            0x80 | ((code & 0x3F000) >>> 12),
            0x80 | ((code & 0xFC0) >>> 6),
            0x80 | (code & 0x3F)
        ];
    }
    
    if (code > 0x800) {
        return [
            0xE0 | ((code & 0xF000) >>> 12),
            0x80 | ((code & 0xFC0) >>> 6),
            0x80 | (code & 0x3F)
        ];
    }
    
    if (code > 0x80) {
        return [
            0xC0 | ((code & 0x7C0) >>> 6),
            0x80 | (code & 0x3F)
        ];
    }
    
    return [code];
}