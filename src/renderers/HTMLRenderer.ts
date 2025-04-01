import type { QRCodeModel, QRCodeRenderer, QRCodeRendererOptions } from "../types";

export function HTMLRenderer(element: HTMLElement): QRCodeRenderer<boolean> {
  return isCanvasSupported() ? CanvasRenderer(element) : DOMRenderer(element);
}

function CanvasRenderer(element: HTMLElement): QRCodeRenderer<boolean> {
  const IMAGE_B64 =
    "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  let canvasElement: HTMLCanvasElement | null = null;

  let canvasContext: CanvasRenderingContext2D | null = null;

  let imageElement: HTMLImageElement | null = null;

  let isDataURISupported: boolean | null = null;

  function _safeSetDataURI(successCallback: () => void, errorCallback: () => void): void {
    // Check it just once
    if (isDataURISupported === null) {
      const el = document.createElement("img");

      const fOnError = () => {
        isDataURISupported = false;

        if (errorCallback) {
          errorCallback();
        }
      };

      const fOnSuccess = () => {
        isDataURISupported = true;

        if (successCallback) {
          successCallback();
        }
      };

      el.onabort = fOnError;
      el.onerror = fOnError;
      el.onload = fOnSuccess;
      el.src = IMAGE_B64;
    } else if (isDataURISupported === true && successCallback) {
      successCallback();
    } else if (isDataURISupported === false && errorCallback) {
      errorCallback();
    }
  }

  function _onMakeImage(): void {
    if (!canvasElement || !imageElement) {
      console.warn("[HTMLRenderer][_onMakeImage] Canvas elements have not been initialized properly");
      return;
    }

    imageElement.src = canvasElement.toDataURL("image/png");
    imageElement.style.display = "block";

    canvasElement.style.display = "none";
  }

  /**
   * Clear Canvas
   */
  function clearCanvas(): boolean {
    if (!canvasElement || !canvasContext) {
      console.warn("[HTMLRenderer][clearCanvas] Canvas context has not been initialized properly");
      return false;
    }

    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    return true;
  }

  /**
   * Draw the QR Code using HTML Canvas API
   */
  function drawWithCanvas(model: QRCodeModel, options: QRCodeRendererOptions): boolean {
    if (!canvasElement) {
      canvasElement = document.createElement("canvas");
      canvasElement.width = options.size ?? 0;
      canvasElement.height = options.size ?? 0;

      element.appendChild(canvasElement);
    }

    if (!canvasContext) {
      canvasContext = canvasElement.getContext("2d")!;
    }

    if (!imageElement) {
      imageElement = document.createElement("img");
      imageElement.alt = "Scan me!"; // TODO: use QRCode content as alt text
      imageElement.style.display = "none";

      element.appendChild(imageElement);
    }

    const nCount = model.getModuleCount();
    const nWidth = (options.size ?? 0) / nCount;
    const nHeight = (options.size ?? 0) / nCount;
    const nRoundedWidth = Math.round(nWidth);
    const nRoundedHeight = Math.round(nHeight);

    clearCanvas();

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = model.isDark(row, col);
        const nLeft = col * nWidth;
        const nTop = row * nHeight;

        canvasContext.strokeStyle = bIsDark ? options.colorDark : options.colorLight;
        canvasContext.lineWidth = 1;
        canvasContext.fillStyle = bIsDark ? options.colorDark : options.colorLight;
        canvasContext.fillRect(nLeft, nTop, nWidth, nHeight);

        // Anti-aliasing prevention
        canvasContext.strokeRect(Math.floor(nLeft) + 0.5, Math.floor(nTop) + 0.5, nRoundedWidth, nRoundedHeight);
        canvasContext.strokeRect(Math.ceil(nLeft) - 0.5, Math.ceil(nTop) - 0.5, nRoundedWidth, nRoundedHeight);
      }
    }

    /**
     * Make the Image from Canvas element
     * - It occurs automatically
     * - Android below 3 doesn't support Data-URI spec.
     */
    const [isAndroid, androidVersion] = getAndroidPlatformDetails();
    if (!isAndroid || androidVersion >= 3) {
      _safeSetDataURI(_onMakeImage, () => {});
    }

    return true;
  }

  return {
    draw: (model: QRCodeModel, options: QRCodeRendererOptions): boolean => {
      return drawWithCanvas(model, options);
    },
    clear(): boolean {
      return clearCanvas();
    },
  };
}

function DOMRenderer(element: HTMLElement): QRCodeRenderer<boolean> {
  /**
   * Draw the QR Code using DOM elements
   *
   * @param qrCodeModel
   */
  function drawWithDOMElements(model: QRCodeModel, options: QRCodeRendererOptions): boolean {
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

    element.innerHTML = aHTML.join("");

    // Fix the margin values as real size.
    const elTable = element.childNodes[0] as HTMLElement;
    const nLeftMarginTable = (options.size - elTable.offsetWidth) / 2;
    const nTopMarginTable = (options.size - elTable.offsetHeight) / 2;

    if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
      elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
    }

    return true;
  }

  /**
   * Remove drawn QR Code HTML elements
   */
  function clearDOMElements(): boolean {
    element.innerHTML = "";
    return true;
  }

  return {
    draw: drawWithDOMElements,
    clear: clearDOMElements,
  };
}

//
// INTERNAL UTILS
//

function isCanvasSupported(): boolean {
  return typeof CanvasRenderingContext2D != "undefined";
}

function getAndroidPlatformDetails(): [boolean, number] {
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
