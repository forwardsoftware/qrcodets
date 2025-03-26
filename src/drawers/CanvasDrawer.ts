import type { QRCodeModel } from "../QRCodeModel";
import type { QRCodeOptions } from "../interface";
import { _getAndroid, _getAndroidVersion } from "../utils";

import type { QRCodeDrawer } from "./types";

export class CanvasDrawer implements QRCodeDrawer {
  private _el: HTMLElement;
  private _htOption: QRCodeOptions;
  private _android: boolean;
  private _androidVersion: number;
  private _elCanvas: HTMLCanvasElement;
  private _oContext: CanvasRenderingContext2D;
  private _bIsPainted: boolean;
  private _elImage: HTMLImageElement;
  private _bSupportDataURI: boolean | null;

  constructor(el: HTMLElement, htOption: QRCodeOptions) {
    this._bIsPainted = false;

    this._android = _getAndroid();
    this._androidVersion = _getAndroidVersion();

    this._htOption = htOption;
    this._elCanvas = document.createElement("canvas");
    this._elCanvas.width = htOption.width ?? 0;
    this._elCanvas.height = htOption.height ?? 0;
    el.appendChild(this._elCanvas);
    this._el = el;
    this._oContext = this._elCanvas.getContext("2d")!;
    this._elImage = document.createElement("img");
    this._elImage.alt = "Scan me!";
    this._elImage.style.display = "none";
    this._el.appendChild(this._elImage);
    this._bSupportDataURI = null;
  }

  private _onMakeImage(): void {
    this._elImage.src = this._elCanvas.toDataURL("image/png");
    this._elImage.style.display = "block";
    this._elCanvas.style.display = "none";
  }

  private _safeSetDataURI(fSuccess: () => void, fFail: () => void): void {
    this._fFail = fFail;
    this._fSuccess = fSuccess;

    // Check it just once
    if (this._bSupportDataURI === null) {
      const el = document.createElement("img");
      const fOnError = () => {
        this._bSupportDataURI = false;

        if (this._fFail) {
          this._fFail.call(this);
        }
      };
      const fOnSuccess = () => {
        this._bSupportDataURI = true;

        if (this._fSuccess) {
          this._fSuccess.call(this);
        }
      };

      el.onabort = fOnError;
      el.onerror = fOnError;
      el.onload = fOnSuccess;
      el.src =
        "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
      return;
    } else if (this._bSupportDataURI === true && this._fSuccess) {
      this._fSuccess.call(this);
    } else if (this._bSupportDataURI === false && this._fFail) {
      this._fFail.call(this);
    }
  }

  public draw(oQRCode: QRCodeModel): void {
    const _elImage = this._elImage;
    const _oContext = this._oContext;
    const _htOption = this._htOption;

    const nCount = oQRCode.getModuleCount();
    const nWidth = (_htOption.width ?? 0) / nCount;
    const nHeight = (_htOption.height ?? 0) / nCount;
    const nRoundedWidth = Math.round(nWidth);
    const nRoundedHeight = Math.round(nHeight);

    _elImage.style.display = "none";
    this.clear();
    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = oQRCode.isDark(row, col);
        const nLeft = col * nWidth;
        const nTop = row * nHeight;
        _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
        _oContext.lineWidth = 1;
        _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
        _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

        // Anti-aliasing prevention
        _oContext.strokeRect(Math.floor(nLeft) + 0.5, Math.floor(nTop) + 0.5, nRoundedWidth, nRoundedHeight);

        _oContext.strokeRect(Math.ceil(nLeft) - 0.5, Math.ceil(nTop) - 0.5, nRoundedWidth, nRoundedHeight);
      }
    }

    this._bIsPainted = true;

    if ((!this._android || this._androidVersion >= 3) && this._bIsPainted) {
      this._safeSetDataURI(this._onMakeImage.bind(this), () => {});
    }
  }

  public isPainted(): boolean {
    return this._bIsPainted;
  }

  public clear(): void {
    this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
    this._bIsPainted = false;
  }

  private _fFail: (() => void) | undefined;
  private _fSuccess: (() => void) | undefined;

  private round(nNumber: number): number {
    if (!nNumber) {
      return nNumber;
    }

    return Math.floor(nNumber * 1000) / 1000;
  }
}
