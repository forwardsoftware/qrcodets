import type { QRErrorCorrectLevel } from "./enums";

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

export interface QRCodeModel {
  getModuleCount(): number;

  isDark(row: number, col: number): boolean;
}

export interface QRCodeDrawer {
  draw(qrCodeModel: QRCodeModel): void;

  clear(): void;
}
