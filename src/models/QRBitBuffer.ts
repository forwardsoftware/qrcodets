import { getLengthInBits, type QR8bitByte } from "./QR8bitByte";

/**
 * Interface representing a QR bit buffer
 */
export interface QRBitBuffer {
  readonly data: number[];

  readonly length: number;
}

/**
 * Creates an empty QR bit buffer with no data
 *
 * @returns An empty QR bit buffer
 */
function createEmptyQRBitBuffer(): QRBitBuffer {
  return {
    data: [],
    length: 0,
  };
}

/**
 * Creates a new QR bit buffer with the provided data
 *
 * @param typeNumber - The QR code type number
 * @param dataList - List of QR8bitByte data to encode
 * @returns A QR bit buffer containing the encoded data
 */
export function createQRBitBuffer(typeNumber: number, dataList: QR8bitByte[]): QRBitBuffer {
  const buffer = createEmptyQRBitBuffer();

  return dataList.reduce((prevBuffer, data) => {
    let newBuffer = putDataInto(prevBuffer, data.mode, 4);
    newBuffer = putDataInto(newBuffer, data.length, getLengthInBits(data, typeNumber));
    return writeQR8bitByteTo(newBuffer, data);
  }, buffer);
}

/**
 * Creates a deep copy of a QR bit buffer
 *
 * @param originalBuffer - The buffer to clone
 * @returns A new QR bit buffer with the same data and length
 */
function cloneQRBitBuffer(originalBuffer: QRBitBuffer): QRBitBuffer {
  return {
    data: [...originalBuffer.data],
    length: originalBuffer.length,
  };
}

/**
 * Writes a number to the buffer using the specified number of bits
 *
 * @param buffer - The current buffer
 * @param num - The number to write
 * @param length - The number of bits to use for the number
 * @returns A new buffer with the number written
 * @throws {Error} If the number is too large for the specified bit length
 */
function putDataInto(buffer: QRBitBuffer, num: number, length: number): QRBitBuffer {
  if (num < 0 || num >= 1 << length) {
    throw new Error(`Number ${num} is too large for ${length} bits`);
  }

  let newBuffer = { ...buffer };
  for (let i = 0; i < length; i++) {
    newBuffer = appendBitTo(newBuffer, ((num >>> (length - i - 1)) & 1) === 1);
  }

  return newBuffer;
}

/**
 * Writes a single bit to the buffer
 *
 * @param buffer - The current buffer
 * @param bit - The boolean value to write (true for 1, false for 0)
 * @returns A new buffer with the bit written
 */
function appendBitTo(buffer: QRBitBuffer, bit: boolean): QRBitBuffer {
  const newBuffer = { ...buffer };
  const bufIndex = Math.floor(newBuffer.length / 8);

  if (newBuffer.data.length <= bufIndex) {
    newBuffer.data = [...newBuffer.data, 0];
  }

  if (bit) {
    newBuffer.data[bufIndex] |= 0x80 >>> newBuffer.length % 8;
  }

  newBuffer.length++;
  return newBuffer;
}

/**
 * Writes the QR8bitByte data to the provided QRBitBuffer.
 * Each byte is written as 8 bits to the buffer.
 *
 * @param buffer - The QRBitBuffer to write the data to
 * @param qr8bitByte - The QR8bitByte data to write
 * @returns A new buffer containing the written data
 */
function writeQR8bitByteTo(buffer: QRBitBuffer, qr8bitByte: QR8bitByte): QRBitBuffer {
  return qr8bitByte.data.reduce((buff, byte) => putDataInto(buff, byte, 8), buffer);
}

/**
 * Retrieves the value of a bit at the specified index
 *
 * @param buffer - The current buffer
 * @param index - The zero-based index of the bit to retrieve
 * @returns The value of the bit at the specified index
 * @throws {Error} If the index is out of bounds
 */
export function getQRBitBufferBit(buffer: QRBitBuffer, index: number): number {
  if (index < 0 || index >= buffer.length) {
    throw new Error("Index out of bounds");
  }

  return buffer.data[index];
}

/** Padding byte value for QR code data */
const PAD0 = 0xec;

/** Padding byte value for QR code data */
const PAD1 = 0x11;

/**
 * Pads the QR bit buffer to the specified total size using alternating padding bytes
 *
 * @param buffer - The current buffer to pad
 * @param totalSize - The desired total size in bytes
 * @returns A new padded buffer
 */
export function padQRBitBuffer(buffer: QRBitBuffer, totalSize: number): QRBitBuffer {
  let newState = cloneQRBitBuffer(buffer);

  if (newState.length + 4 <= totalSize * 8) {
    newState = putDataInto(newState, 0, 4);
  }

  while (newState.length % 8 !== 0) {
    newState = appendBitTo(newState, false);
  }

  while (newState.length < totalSize * 8) {
    newState = putDataInto(newState, PAD0, 8);

    if (newState.length >= totalSize * 8) break;

    newState = putDataInto(newState, PAD1, 8);
  }

  return newState;
}

/**
 * Validates if the buffer size is within the specified total size limit
 *
 * @param buffer - The buffer to validate
 * @param totalSize - The maximum allowed size in bytes
 * @returns True if the buffer size is valid, false otherwise
 */
export function validateQRBitBufferSize(buffer: QRBitBuffer, totalSize: number): boolean {
  return buffer.length <= totalSize * 8;
}
