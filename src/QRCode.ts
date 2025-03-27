import { HTMLDrawer, SVGDrawer } from "./drawers";
import type { QRCodeDrawer } from "./drawers";
import { QRErrorCorrectLevel } from "./enums";
import type { QRCodeOptions } from "./interface";
import { QRCodeModel } from "./QRCodeModel";
import { _getTypeNumber } from "./utils";

const DEFAULT_QRCODE_OPTIONS: QRCodeOptions = {
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
};

/**
 * @class QRCode
 * @constructor
 * @example
 * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
 *
 * @example
 * var oQRCode = new QRCode("test", {
 *    text : "http://naver.com",
 *    width : 128,
 *    height : 128
 * });
 *
 * oQRCode.clear(); // Clear the QRCode.
 * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
 *
 * @param {Object} vOption
 * @param {String} vOption.text QRCode link data
 * @param {Number} [vOption.width=256]
 * @param {Number} [vOption.height=256]
 * @param {String} [vOption.colorDark="#000000"]
 * @param {String} [vOption.colorLight="#ffffff"]
 * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
 */
export class QRCode {
  private _htOption: QRCodeOptions;
  private _el?: HTMLElement | null;
  private _oDrawing?: QRCodeDrawer;

  constructor(vOption: Partial<QRCodeOptions>) {
    this._htOption = {
      ...DEFAULT_QRCODE_OPTIONS,
      ...vOption,
    };

    let el: HTMLElement | undefined | null;

    if (this._htOption?.id) {
      el = document.getElementById(this._htOption?.id);
    } else {
      el = this._htOption?.element;
    }

    if (!el) {
      console.warn("element dont exist");
    }

    this._el = el;
    if (this._el) {
      if (this._htOption.mode == "svg") {
        this._oDrawing = new SVGDrawer(this._el, this._htOption);
      } else {
        this._oDrawing = new HTMLDrawer(this._el, this._htOption);
      }
    }

    if (this._htOption.text) {
      this.makeCode(this._htOption.text);
    }
  }

  /**
   * Make the QRCode
   *
   * @param {String} sText link data
   */
  makeCode(sText: string): void {
    const qrCodeModel = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel!);
    qrCodeModel.addData(sText);
    qrCodeModel.make();
    if (this._el) {
      this._el.title = sText;
    }

    this._oDrawing?.draw(qrCodeModel);
  }

  /**
   * Clear the QRCode
   */
  clear(): void {
    this._oDrawing?.clear();
  }
}
