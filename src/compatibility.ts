import { HTMLDrawer, SVGDrawer } from "./drawers";
import { QRErrorCorrectLevel } from "./enums";
import { QRCodeModelImpl } from "./models";
import type { QRCodeCompatOptions, QRCodeDrawer } from "./types";

export class QRCodeCompat {
  private _htOption: QRCodeCompatOptions;
  private _el?: HTMLElement | null;
  private _oDrawing?: QRCodeDrawer;

  constructor(vOption: Partial<QRCodeCompatOptions>) {
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
    // TODO: evaluate moving all logic to a single function call to avoid the `QRCodeModel` class
    const qrCodeModel = new QRCodeModelImpl(this.getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel!);
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

  /**
   * Get the QR Code type by string length
   *
   * @private
   * @param {String} sText
   * @param {Number} nCorrectLevel
   * @return {Number} type
   */
  private getTypeNumber(sText: string, nCorrectLevel: number): number {
    var nType = 1;
    var length = this.getUTF8Length(sText);

    for (var i = 0, len = QR_CODE_LIMIT_LENGTH.length; i <= len; i++) {
      var nLimit = 0;

      switch (nCorrectLevel) {
        case QRErrorCorrectLevel.L:
          nLimit = QR_CODE_LIMIT_LENGTH[i][0];
          break;
        case QRErrorCorrectLevel.M:
          nLimit = QR_CODE_LIMIT_LENGTH[i][1];
          break;
        case QRErrorCorrectLevel.Q:
          nLimit = QR_CODE_LIMIT_LENGTH[i][2];
          break;
        case QRErrorCorrectLevel.H:
          nLimit = QR_CODE_LIMIT_LENGTH[i][3];
          break;
      }

      if (length <= nLimit) {
        break;
      } else {
        nType++;
      }
    }

    if (nType > QR_CODE_LIMIT_LENGTH.length) {
      throw new Error("Too long data");
    }

    return nType;
  }

  private getUTF8Length(sText: string): number {
    let utf8Length = 0;
    for (let i = 0; i < sText.length; i++) {
      const charCode = sText.charCodeAt(i);
      if (charCode < 0x80) {
        utf8Length += 1;
      } else if (charCode < 0x800) {
        utf8Length += 2;
      } else if (charCode < 0x10000) {
        utf8Length += 3;
      } else if (charCode < 0x200000) {
        utf8Length += 4;
      }
    }

    return utf8Length;
  }
}

const DEFAULT_QRCODE_OPTIONS: QRCodeCompatOptions = {
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
};

const QR_CODE_LIMIT_LENGTH = [
  [17, 14, 11, 7],
  [32, 26, 20, 14],
  [53, 42, 32, 24],
  [78, 62, 46, 34],
  [106, 84, 60, 44],
  [134, 106, 74, 58],
  [154, 122, 86, 64],
  [192, 152, 108, 84],
  [230, 180, 130, 98],
  [271, 213, 151, 119],
  [321, 251, 177, 137],
  [367, 287, 203, 155],
  [425, 331, 241, 177],
  [458, 362, 258, 194],
  [520, 412, 292, 220],
  [586, 450, 322, 250],
  [644, 504, 364, 280],
  [718, 560, 394, 310],
  [792, 624, 442, 338],
  [858, 666, 482, 382],
  [929, 711, 509, 403],
  [1003, 779, 565, 439],
  [1091, 857, 611, 461],
  [1171, 911, 661, 511],
  [1273, 997, 715, 535],
  [1367, 1059, 751, 593],
  [1465, 1125, 805, 625],
  [1528, 1190, 868, 658],
  [1628, 1264, 908, 698],
  [1732, 1370, 982, 742],
  [1840, 1452, 1030, 790],
  [1952, 1538, 1112, 842],
  [2068, 1628, 1168, 898],
  [2188, 1722, 1228, 958],
  [2303, 1809, 1283, 983],
  [2431, 1911, 1351, 1051],
  [2563, 1989, 1423, 1093],
  [2699, 2099, 1499, 1139],
  [2809, 2213, 1579, 1219],
  [2953, 2331, 1663, 1273],
];
