import { QRErrorCorrectLevel } from "./enums";
import type { QRCodeErrorCorrectionLevel } from "./types";

export function getQRErrorCorrectLevel(errorCorrectionLevel: QRCodeErrorCorrectionLevel): QRErrorCorrectLevel {
  switch (errorCorrectionLevel) {
    case "L":
      return QRErrorCorrectLevel.L;

    case "M":
      return QRErrorCorrectLevel.M;

    case "Q":
      return QRErrorCorrectLevel.Q;

    case "H":
      return QRErrorCorrectLevel.H;

    default:
      return QRErrorCorrectLevel.H;
  }
}

export function getQRCodeErrorCorrectionLevel(errorCorrectLevel: QRErrorCorrectLevel): QRCodeErrorCorrectionLevel {
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

/**
 * Get the QR Code version/type number (1-40) based on text length
 *
 * @private
 * @param {String} text
 * @param {Number} errorCorrectionLevel
 * @return {Number} version/type number (1-40)
 */
export function getTypeNumber(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel): number {
  const length = getUTF8Length(text);

  let nType = 1;

  for (let i = 0, len = QR_CODE_LIMIT_LENGTH.length; i <= len; i++) {
    let nLimit = 0;

    switch (errorCorrectionLevel) {
      case "L":
        nLimit = QR_CODE_LIMIT_LENGTH[i][0];
        break;
      case "M":
        nLimit = QR_CODE_LIMIT_LENGTH[i][1];
        break;
      case "Q":
        nLimit = QR_CODE_LIMIT_LENGTH[i][2];
        break;
      case "H":
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

export function getUTF8Length(sText: string): number {
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
