import { QRMode } from "./constants";
import type { QRBitBuffer } from "./QRBitBuffer";
import { encodeUTF8 } from "./utils";

/**
 * Represents the data structure for 8-bit byte QR code data.
 * Contains the parsed data array that will be encoded into the QR code.
 */
export interface QR8bitByte {
  /** The parsed and encoded data array */
  readonly data: number[];

  /**
   * The length of the data array.
   */
  readonly length: number;

  /**
   * The QR mode used for encoding the data.
   */
  readonly mode: QRMode;
}

/**
 * Creates a new QR8bitByte object from a string input.
 * The input string is encoded into UTF-8 bytes.
 *
 * @param data - The string data to be encoded
 * @returns A QR8bitByte object containing the encoded data
 */
export function createQR8bitByte(data: string): QR8bitByte {
  const encodedData = encodeUTF8(data);

  return {
    data: encodedData,
    length: encodedData.length,
    mode: QRMode.MODE_8BIT_BYTE,
  };
}

/**
 * Calculates the length of the QR8bitByte data in bits based on the QR mode and type number.
 *
 * @param qr8bitByte - The QR8bitByte object containing the data and mode information.
 * @param type - The type number of the QR code.
 * @returns The length of the QR8bitByte data in bits.
 * @throws Error if the type number is invalid or the QR mode is not recognized.
 */
export function getLengthInBits(qr8bitByte: QR8bitByte, type: number): number {
  if (type > 40) {
    throw new Error(`type: ${type}`);
  }

  if (1 <= type && type < 10) {
    switch (qr8bitByte.mode) {
      case QRMode.MODE_NUMBER:
        return 10;
      case QRMode.MODE_ALPHA_NUM:
        return 9;
      case QRMode.MODE_8BIT_BYTE:
        return 8;
      case QRMode.MODE_KANJI:
        return 8;
      default:
        throw new Error(`mode: ${qr8bitByte.mode}`);
    }
  }

  if (type < 27) {
    switch (qr8bitByte.mode) {
      case QRMode.MODE_NUMBER:
        return 12;
      case QRMode.MODE_ALPHA_NUM:
        return 11;
      case QRMode.MODE_8BIT_BYTE:
        return 16;
      case QRMode.MODE_KANJI:
        return 10;
      default:
        throw new Error(`mode: ${qr8bitByte.mode}`);
    }
  }

  switch (qr8bitByte.mode) {
    case QRMode.MODE_NUMBER:
      return 14;
    case QRMode.MODE_ALPHA_NUM:
      return 13;
    case QRMode.MODE_8BIT_BYTE:
      return 16;
    case QRMode.MODE_KANJI:
      return 12;
    default:
      throw new Error(`mode: ${qr8bitByte.mode}`);
  }
}
