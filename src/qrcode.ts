import { generateQRCodeModel } from "./models";
import type { QRCodeOptions, QRCodeRenderer } from "./types";
import { getTypeNumber } from "./utils";

const DEFAULT_QRCODE_OPTIONS: QRCodeOptions = {
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctionLevel: "H",
};

/**
 * A class that represents a QR Code with configurable options and rendering capabilities.
 * This class provides methods to create, configure, and render QR codes using different renderers.
 */
export class QRCode {
  private content: string;
  private options: QRCodeOptions;

  /**
   * Creates a new QRCode instance with the specified content and optional configuration.
   * @param {string} content - The text or data to be encoded in the QR code.
   * @param {Partial<QRCodeOptions>} [options] - Optional configuration options for the QR code.
   */
  constructor(content: string, options?: Partial<QRCodeOptions>) {
    this.content = content;
    this.options = {
      ...DEFAULT_QRCODE_OPTIONS,
      ...(options || {}),
    };
  }

  /**
   * Creates a new QRCode instance from a text string using default options.
   * @param {string} text - The text to be encoded in the QR code.
   * @returns {QRCode} A new QRCode instance.
   */
  static from(text: string): QRCode {
    return new QRCode(text);
  }

  /**
   * Updates the QR code options with new configuration settings.
   * @param {Partial<QRCodeOptions>} options - The new configuration options to apply.
   * @returns {QRCode} The current QRCode instance for method chaining.
   */
  withOptions(options: Partial<QRCodeOptions>): QRCode {
    this.options = {
      ...DEFAULT_QRCODE_OPTIONS,
      ...(options || {}),
    };

    return this;
  }

  /**
   * Renders the QR code using the provided renderer.
   * @param {QRCodeRenderer<T>} renderer - The renderer to use for drawing the QR code.
   * @returns {T} The rendered output.
   */
  renderTo<T>(renderer: QRCodeRenderer<T>): T {
    const typeNumber = this.options.type || getTypeNumber(this.content, this.options.correctionLevel);
    const qrCodeModel = generateQRCodeModel(typeNumber, this.options.correctionLevel, this.content);
    return renderer.draw(qrCodeModel, this.options);
  }

  /**
   * Clears the rendered QR code using the provided renderer.
   * @param {QRCodeRenderer<T>} renderer - The renderer to use for clearing the QR code.
   * @returns {boolean} True if the QR code was successfully cleared.
   */
  clearFrom<T>(renderer: QRCodeRenderer<T>): boolean {
    return renderer.clear();
  }
}
