import type { QRCodeModel } from "../QRCodeModel";

export interface QRCodeDrawer {
  draw: (qrCodeModel: QRCodeModel) => void;

  clear: () => void;
}
