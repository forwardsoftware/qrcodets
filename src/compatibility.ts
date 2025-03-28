import { HTMLDrawer } from "./drawers/HTMLDrawer";
import { SVGDrawer } from "./drawers/SVGDrawer";
import { QRErrorCorrectLevel } from "./enums";
import { QRCode } from "./qrcode";
import type { QRCodeCompatOptions, QRCodeDrawer, QRCodeOptions } from "./types";
import { getQRCodeErrorCorrectionLevel } from "./utils";

const DEFAULT_QRCODE_OPTIONS: QRCodeCompatOptions = {
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
};

export class QRCodeCompat {
  private _htOption: QRCodeOptions;

  private qrCode: QRCode | null = null;

  private _oDrawing: QRCodeDrawer;

  constructor(vOption: Partial<QRCodeCompatOptions>) {
    let el: HTMLElement | undefined | null;
    if (vOption.id) {
      el = document.getElementById(vOption.id);
    } else {
      el = vOption.element;
    }

    if (!el) {
      throw Error(`QRCodeCompat init failed: element doesn't exist`);
    }

    this._htOption = {
      type: vOption.typeNumber || DEFAULT_QRCODE_OPTIONS.typeNumber,
      correctionLevel: getQRCodeErrorCorrectionLevel(vOption.correctLevel || DEFAULT_QRCODE_OPTIONS.correctLevel),
      size: Math.max(vOption.width || DEFAULT_QRCODE_OPTIONS.width, vOption.height || DEFAULT_QRCODE_OPTIONS.height),
      colorDark: vOption.colorDark || DEFAULT_QRCODE_OPTIONS.colorDark,
      colorLight: vOption.colorLight || DEFAULT_QRCODE_OPTIONS.colorLight,
    };

    if (vOption.mode == "svg") {
      this._oDrawing = new SVGDrawer(el);
    } else {
      this._oDrawing = new HTMLDrawer(el);
    }

    if (vOption.text) {
      this.makeCode(vOption.text);
    }
  }

  /**
   * Make the QRCode
   *
   * @param {String} sText link data
   */
  makeCode(sText: string): void {
    if (!this.qrCode) {
      this.qrCode = new QRCode(sText, this._htOption).renderTo(this._oDrawing);
    }

    this.qrCode.draw();
  }

  /**
   * Clear the QRCode
   */
  clear(): void {
    if (!this.qrCode) {
      console.warn("QRCode not yet drawn");
      return;
    }

    this.qrCode.clear();
  }
}
