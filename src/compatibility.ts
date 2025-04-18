import { QRCode } from "./qrcode";
import { HTMLRenderer } from "./renderers/HTMLRenderer";
import { SVGRenderer } from "./renderers/SVGRenderer";
import type { QRCodeErrorCorrectionLevel, QRCodeOptions, QRCodeRenderer } from "./types";

export enum QRErrorCorrectLevel {
  L = 1,
  M = 0,
  Q = 3,
  H = 2,
}

export interface QRCodeCompatOptions {
  id?: string;

  element?: HTMLElement;

  width: number;

  height: number;

  typeNumber: number;

  colorDark: string;

  colorLight: string;

  correctLevel: QRErrorCorrectLevel;

  text?: string;

  mode?: "svg" | "dom";
}

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

  private renderer: QRCodeRenderer<unknown>;

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
      this.renderer = SVGRenderer(el);
    } else {
      this.renderer = HTMLRenderer(el);
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
      this.qrCode = new QRCode(sText, this._htOption);
    }

    this.qrCode.renderTo(this.renderer);
  }

  /**
   * Clear the QRCode
   */
  clear(): void {
    if (!this.qrCode) {
      console.warn("QRCode not yet drawn");
      return;
    }

    this.qrCode.clearFrom(this.renderer);
  }
}

function getQRCodeErrorCorrectionLevel(errorCorrectLevel: QRErrorCorrectLevel): QRCodeErrorCorrectionLevel {
  switch (errorCorrectLevel) {
    case QRErrorCorrectLevel.L:
      return "L";
    case QRErrorCorrectLevel.M:
      return "M";
    case QRErrorCorrectLevel.Q:
      return "Q";
    case QRErrorCorrectLevel.H:
      return "H";
    default:
      return "H";
  }
}
