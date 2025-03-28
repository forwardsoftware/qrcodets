import type { QRCodeErrorCorrectionLevel, QRCodeModel } from "../types";

import { QRCodeModelImpl } from "./QRCodeModel";

export function generateQRCodeModel(type: number, errorCorrection: QRCodeErrorCorrectionLevel, content: string): QRCodeModel {
  const qrCodeModel = new QRCodeModelImpl(type, getErrorCorrectionLevelNumber(errorCorrection));
  qrCodeModel.addData(content);
  qrCodeModel.make();

  return qrCodeModel;
}

function getErrorCorrectionLevelNumber(errorCorrectionLevel: QRCodeErrorCorrectionLevel): number {
  switch (errorCorrectionLevel) {
    case "L":
      return 1;

    case "M":
      return 0;

    case "Q":
      return 3;

    case "H":
      return 2;

    default:
      return 2;
  }
}
