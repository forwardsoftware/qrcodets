import { generateQRCodeModel } from "./models";
import type { QRCodeOptions, QRCodeRenderer } from "./types";
import { getTypeNumber } from "./utils";

const DEFAULT_QRCODE_OPTIONS: QRCodeOptions = {
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctionLevel: "H",
};

export class QRCode {
  private content: string;

  private options: QRCodeOptions;

  constructor(content: string, options?: Partial<QRCodeOptions>) {
    this.content = content;
    this.options = {
      ...DEFAULT_QRCODE_OPTIONS,
      ...(options || {}),
    };
  }

  /**
   * Draw the QR Code using the provided renderer
   *
   * @param {QRCodeRenderer} renderer - The QRCodeRenderer to use.
   */
  renderTo<T>(renderer: QRCodeRenderer<T>): T {
    const typeNumber = this.options.type || getTypeNumber(this.content, this.options.correctionLevel);

    const qrCodeModel = generateQRCodeModel(typeNumber, this.options.correctionLevel, this.content);

    return renderer.draw(qrCodeModel, this.options);
  }

  /**
   * Clear the QRCode
   */
  clearFrom<T>(renderer: QRCodeRenderer<T>): boolean {
    return renderer.clear();
  }
}
