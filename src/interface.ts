import QRCodeModel from "./QRCodeModel";
import { QRErrorCorrectLevel } from "./const";

export interface QRCodeOptions {
    id?: string,
    element?: HTMLElement,
    width?: number;
    height?: number;
    typeNumber?: number;
    colorDark: string;
    colorLight: string;
    correctLevel?: QRErrorCorrectLevel;
    useSVG?: boolean;
    text?: string;
    mode?: "svg" | "dom"
}

export interface Drawer {
    draw: (oQRCode: QRCodeModel) => void
    clear: () => void
    makeImage?: () => void
}