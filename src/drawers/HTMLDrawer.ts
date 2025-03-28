import type { QRCodeDrawer, QRCodeDrawerOptions, QRCodeModel } from "../types";

export class HTMLDrawer implements QRCodeDrawer {
  // this Image contains 1px data
  private static IMAGE_B64 =
    "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  private element: HTMLElement;

  private canvasElement: HTMLCanvasElement | null = null;

  private canvasContext: CanvasRenderingContext2D | null = null;

  private imageElement: HTMLImageElement | null = null;

  private isDataURISupported: boolean | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Draw the QR Code
   */
  public draw(model: QRCodeModel, options: QRCodeDrawerOptions): boolean {
    if (!this.isCanvasSupported()) {
      return this.drawWithDOMElements(model, options);
    }

    return this.drawWithCanvas(model, options);
  }

  /**
   * Clear the QRCode
   */
  public clear(): boolean {
    if (!this.isCanvasSupported()) {
      return this.clearDOMElements();
    }

    return this.clearCanvas();
  }

  /**
   * Draw the QR Code using HTML Canvas API
   */
  private drawWithCanvas(model: QRCodeModel, options: QRCodeDrawerOptions): boolean {
    if (!this.canvasElement) {
      this.canvasElement = document.createElement("canvas");
      this.canvasElement.width = options.size ?? 0;
      this.canvasElement.height = options.size ?? 0;

      this.element.appendChild(this.canvasElement);
    }

    if (!this.canvasContext) {
      this.canvasContext = this.canvasElement.getContext("2d")!;
    }

    if (!this.imageElement) {
      this.imageElement = document.createElement("img");
      this.imageElement.alt = "Scan me!"; // TODO: use QRCode content as alt text
      this.imageElement.style.display = "none";
      this.element.appendChild(this.imageElement);
    }

    const _elImage = this.imageElement;
    const _oContext = this.canvasContext;

    const nCount = model.getModuleCount();
    const nWidth = (options.size ?? 0) / nCount;
    const nHeight = (options.size ?? 0) / nCount;
    const nRoundedWidth = Math.round(nWidth);
    const nRoundedHeight = Math.round(nHeight);

    _elImage.style.display = "none";
    this.clearCanvas();

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = model.isDark(row, col);
        const nLeft = col * nWidth;
        const nTop = row * nHeight;
        _oContext.strokeStyle = bIsDark ? options.colorDark : options.colorLight;
        _oContext.lineWidth = 1;
        _oContext.fillStyle = bIsDark ? options.colorDark : options.colorLight;
        _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

        // Anti-aliasing prevention
        _oContext.strokeRect(Math.floor(nLeft) + 0.5, Math.floor(nTop) + 0.5, nRoundedWidth, nRoundedHeight);

        _oContext.strokeRect(Math.ceil(nLeft) - 0.5, Math.ceil(nTop) - 0.5, nRoundedWidth, nRoundedHeight);
      }
    }

    /**
     * Make the Image from Canvas element
     * - It occurs automatically
     * - Android below 3 doesn't support Data-URI spec.
     */
    const [isAndroid, androidVersion] = this.getAndroidPlatformDetails();
    if (!isAndroid || androidVersion >= 3) {
      this._safeSetDataURI(this._onMakeImage.bind(this), () => {});
    }

    return true;
  }

  private getAndroidPlatformDetails(): [boolean, number] {
    const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
      const aMat = userAgent.toString().match(/android ([0-9]\.[0-9])/i);
      if (aMat && aMat[1]) {
        const version = parseFloat(aMat[1]);
        return [!!version, version];
      }

      return [true, 0];
    }

    return [false, -1];
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
  private drawWithDOMElements(model: QRCodeModel, options: QRCodeDrawerOptions): boolean {
    const _el = this.element;

    const nCount = model.getModuleCount();
    const nWidth = Math.floor(options.size / nCount);
    const nHeight = Math.floor(options.size / nCount);

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
            (model.isDark(row, col) ? options.colorDark : options.colorLight) +
            ';"></td>'
        );
      }

      aHTML.push("</tr>");
    }

    aHTML.push("</table>");

    _el.innerHTML = aHTML.join("");

    // Fix the margin values as real size.
    const elTable = _el.childNodes[0] as HTMLElement;
    const nLeftMarginTable = (options.size - elTable.offsetWidth) / 2;
    const nTopMarginTable = (options.size - elTable.offsetHeight) / 2;

    if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
      elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
    }

    return true;
  }

  /**
   * Clear Canvas
   */
  private clearCanvas(): boolean {
    if (!this.canvasElement || !this.canvasContext) {
      console.warn("[HTMLDrawer][clearCanvas] Canvas context has not been initialized properly");

      return false;
    }

    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    return true;
  }

  /**
   * Remove drawn QR Code HTML elements
   */
  private clearDOMElements(): boolean {
    this.element.innerHTML = "";
    return true;
  }

  private isCanvasSupported(): boolean {
    return typeof CanvasRenderingContext2D != "undefined";
  }
}
