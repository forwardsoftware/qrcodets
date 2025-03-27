import type { QRCodeModel } from "../models";

export interface QRCodeDrawer {
  draw: (qrCodeModel: QRCodeModel) => void;

  clear: () => void;
}
