/**
 * A class that handles bit-level operations for QR code generation.
 * This buffer allows for reading and writing individual bits and numbers.
 */
export class QRBitBuffer {
  private buffer: number[] = [];
  private length: number = 0;

  /**
   * Gets the total number of bits in the buffer
   * @returns The total number of bits
   */
  public getLengthInBits(): number {
    return this.length;
  }

  /**
   * Retrieves the value of a bit at the specified index.
   * @param {number} index - The zero-based index of the bit to retrieve.
   * @returns {number} - The boolean value of the bit (1 for true, 0 for false).
   * @throws {Error} - If the index is out of bounds.
   */
  public getBit(index: number): number {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of bounds");
    }
    return this.buffer[index];
  }

  /**
   * Writes a number to the buffer using the specified number of bits
   * @param num The number to write
   * @param length The number of bits to use for the number
   * @throws {Error} If the number is too large for the specified bit length
   */
  public put(num: number, length: number): void {
    if (num < 0 || num >= 1 << length) {
      throw new Error(`Number ${num} is too large for ${length} bits`);
    }
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  /**
   * Writes a single bit to the buffer
   * @param bit The boolean value to write (true for 1, false for 0)
   */
  public putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
    }
    this.length++;
  }
}
