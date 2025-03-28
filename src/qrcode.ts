import { QRCodeModelImpl } from "./models";
import type { QRCodeDrawer, QRCodeOptions } from "./types";
import { getQRErrorCorrectLevel, getTypeNumber } from "./utils";

const DEFAULT_QRCODE_OPTIONS: QRCodeOptions = {
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctionLevel: "H",
};

export class QRCode {
  private content: string;

  private options: QRCodeOptions;

  private renderer?: QRCodeDrawer;

  constructor(content: string, options?: Partial<QRCodeOptions>) {
    this.content = content;
    this.options = {
      ...DEFAULT_QRCODE_OPTIONS,
      ...(options || {}),
    };
  }

  /**
   * Assigns a QRCodeDrawer to the QRCode instance and returns the instance itself.
   *
   * @param {QRCodeDrawer} renderer - The QRCodeDrawer to use.
   * @returns {QRCode} The QRCode instance.
   */
  renderTo(renderer: QRCodeDrawer): QRCode {
    this.renderer = renderer;
    return this;
  }

  /**
   * Draw the QR Code using the provided renderer
   */
  draw(): boolean {
    if (!this.renderer) {
      console.error("Failed to draw QRCode: renderer not set for QRCode instance. Did you forget to call 'renderTo' method?");
      return false;
    }

    const typeNumber = this.options.type || getTypeNumber(this.content, this.options.correctionLevel);

    const errorCorrectLevel = getQRErrorCorrectLevel(this.options.correctionLevel);

    // TODO: evaluate moving all logic to a single function call to avoid the `QRCodeModel` class
    const qrCodeModel = new QRCodeModelImpl(typeNumber, errorCorrectLevel);
    qrCodeModel.addData(this.content);
    qrCodeModel.make();

    return this.renderer.draw(qrCodeModel, this.options);
  }

  /**
   * Clear the QRCode
   */
  clear(): boolean {
    if (!this.renderer) {
      console.error("Failed to clear QRCode: renderer not set for QRCode instance. Did you forget to call 'renderTo' method?");
      return false;
    }

    return this.renderer.clear();
  }
}
