import type { QRErrorCorrectLevel } from "./enums";

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
