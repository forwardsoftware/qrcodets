/**
 * The error correction level of a QR Code.
 * - L (Low): ~7% error correction
 * - M (Medium): ~15% error correction
 * - Q (Quartile): ~25% error correction
 * - H (High): ~30% error correction
 */
export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeOptions {
  /**
   * The QR Code version/type number (1-40).
   *
   * Higher values increase the size and data capacity of the QR Code.
   *
   * If not set, the library will try to compute it based on content size.
   */
  type?: number;

  /**
   * The error correction level of the QR Code.
   * - L (Low): ~7% error correction
   * - M (Medium): ~15% error correction
   * - Q (Quartile): ~25% error correction
   * - H (High): ~30% error correction
   *
   * @default "H"
   */
  correctionLevel: QRCodeErrorCorrectionLevel;

  /**
   * The physical size of the QR Code in pixels.
   *
   * @default 256
   */
  size: number;

  /**
   * The color of the dark modules (QR Code pixels).
   *
   * Accepts any valid CSS color string.
   *
   * @default "#000000"
   */
  colorDark: string;

  /**
   * The color of the light modules (background).
   *
   * Accepts any valid CSS color string.
   *
   * @default "#ffffff"
   */
  colorLight: string;
}

export interface QRCodeModel {
  getModuleCount(): number;

  isDark(row: number, col: number): boolean;
}

export type QRCodeRendererOptions = Pick<QRCodeOptions, "colorDark" | "colorLight" | "size">;

export interface QRCodeRenderer<T> {
  draw(model: QRCodeModel, options: QRCodeRendererOptions): T;

  clear(): boolean;
}
