import type { QRErrorCorrectLevel } from "./enums";
import type { QRCodeModel } from "./models";

export interface QRCodeOptions {
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

export interface QRCodeDrawer {
  draw: (qrCodeModel: QRCodeModel) => void;

  clear: () => void;
}
