import type { QRCodeOptions } from "../interface";
import type { QRCodeModel } from "../QRCodeModel";
import { _getAndroid, _getAndroidVersion, _isSupportCanvas } from "../utils";

import type { QRCodeDrawer } from "./types";

export class HTMLDrawer implements QRCodeDrawer {
  // this Image contains 1px data
  private static IMAGE_B64 =
    "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  private element: HTMLElement;

  private canvasElement: HTMLCanvasElement | null = null;

  private canvasContext: CanvasRenderingContext2D | null = null;

  private imageElement: HTMLImageElement | null = null;

  private qrCodeOptions: QRCodeOptions;

  private isDataURISupported: boolean | null = null;

  constructor(element: HTMLElement, qrCodeOptions: QRCodeOptions) {
    this.element = element;
    this.qrCodeOptions = qrCodeOptions;

    if (_isSupportCanvas()) {
      this.canvasElement = document.createElement("canvas");
      this.canvasElement.width = this.qrCodeOptions.width ?? 0;
      this.canvasElement.height = this.qrCodeOptions.height ?? 0;

      this.element.appendChild(this.canvasElement);

      this.canvasContext = this.canvasElement.getContext("2d")!;

      this.imageElement = document.createElement("img");
      this.imageElement.alt = "Scan me!";
      this.imageElement.style.display = "none";
      this.element.appendChild(this.imageElement);
    }
  }

  /**
   * Draw the QR Code
   *
   * @param qrCodeModel
   */
  public draw(qrCodeModel: QRCodeModel): void {
    if (!_isSupportCanvas()) {
      return this.drawWithDOMElements(qrCodeModel);
    }

    return this.drawWithCanvas(qrCodeModel);
  }

  /**
   * Clear the QRCode
   */
  public clear(): void {
    if (!_isSupportCanvas()) {
      return this.clearDOMElements();
    }

    return this.clearCanvas();
  }

  /**
   * Draw the QR Code using HTML Canvas API
   *
   * @param qrCodeModel
   */
  private drawWithCanvas(qrCodeModel: QRCodeModel): void {
    if (!this.imageElement || !this.canvasContext) {
      console.warn("[HTMLDrawer][drawWithCanvas] Canvas context has not been initialized properly");
      return;
    }

    const _htOption = this.qrCodeOptions;

    const _elImage = this.imageElement;
    const _oContext = this.canvasContext;

    const nCount = qrCodeModel.getModuleCount();
    const nWidth = (_htOption.width ?? 0) / nCount;
    const nHeight = (_htOption.height ?? 0) / nCount;
    const nRoundedWidth = Math.round(nWidth);
    const nRoundedHeight = Math.round(nHeight);

    _elImage.style.display = "none";
    this.clearCanvas();

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = qrCodeModel.isDark(row, col);
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

    if (!_getAndroid() || _getAndroidVersion() >= 3) {
      this._safeSetDataURI(this._onMakeImage.bind(this), () => {});
    }
  }

  private _safeSetDataURI(successCallback: () => void, errorCallback: () => void): void {
    // Check it just once
    if (this.isDataURISupported === null) {
      const el = document.createElement("img");

      const fOnError = () => {
        this.isDataURISupported = false;

        if (errorCallback) {
          errorCallback.call(this);
        }
      };

      const fOnSuccess = () => {
        this.isDataURISupported = true;

        if (successCallback) {
          successCallback.call(this);
        }
      };

      el.onabort = fOnError;
      el.onerror = fOnError;
      el.onload = fOnSuccess;
      el.src = HTMLDrawer.IMAGE_B64;
    } else if (this.isDataURISupported === true && successCallback) {
      successCallback.call(this);
    } else if (this.isDataURISupported === false && errorCallback) {
      errorCallback.call(this);
    }
  }

  private _onMakeImage(): void {
    if (!this.canvasElement || !this.imageElement) {
      console.warn("[HTMLDrawer][_onMakeImage] Canvas elements have not been initialized properly");
      return;
    }

    this.imageElement.src = this.canvasElement.toDataURL("image/png");
    this.imageElement.style.display = "block";
    this.canvasElement.style.display = "none";
  }

  /**
   * Draw the QR Code using DOM elements
   *
   * @param qrCodeModel
   */
  private drawWithDOMElements(qrCodeModel: QRCodeModel): void {
    const _htOption = this.qrCodeOptions;
    const _el = this.element;

    const nCount = qrCodeModel.getModuleCount();
    const nWidth = _htOption.width ? Math.floor(_htOption.width / nCount) : 0;
    const nHeight = _htOption.height ? Math.floor(_htOption.height / nCount) : 0;

    const aHTML: string[] = ['<table style="border:0;border-collapse:collapse;">'];

    for (let row = 0; row < nCount; row++) {
      aHTML.push("<tr>");

      for (let col = 0; col < nCount; col++) {
        aHTML.push(
          '<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' +
            nWidth +
            "px;height:" +
            nHeight +
            "px;background-color:" +
            (qrCodeModel.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) +
            ';"></td>'
        );
      }

      aHTML.push("</tr>");
    }

    aHTML.push("</table>");
    _el.innerHTML = aHTML.join("");

    // Fix the margin values as real size.
    const elTable = _el.childNodes[0] as HTMLElement;
    const nLeftMarginTable = _htOption.width ? (_htOption.width - elTable.offsetWidth) / 2 : 0;
    const nTopMarginTable = _htOption.height ? (_htOption.height - elTable.offsetHeight) / 2 : 0;

    if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
      elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
    }
  }

  /**
   * Clear Canvas
   */
  private clearCanvas(): void {
    if (!this.canvasElement || !this.canvasContext) {
      console.warn("[HTMLDrawer][clearCanvas] Canvas context has not been initialized properly");
      return;
    }

    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  /**
   * Remove drawn QR Code HTML elements
   */
  private clearDOMElements(): void {
    this.element.innerHTML = "";
  }
}
