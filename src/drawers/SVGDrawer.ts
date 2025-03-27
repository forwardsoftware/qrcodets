import type { QRCodeModel } from "../models";
import type { QRCodeDrawer, QRCodeOptions } from "../types";

export class SVGDrawer implements QRCodeDrawer {
  private _el: HTMLElement;
  private _htOption: QRCodeOptions;

  constructor(el: HTMLElement, htOption: QRCodeOptions) {
    this._el = el;
    this._htOption = htOption;
  }

  public draw(oQRCode: QRCodeModel): void {
    const _htOption = this._htOption;
    const _el = this._el;
    const nCount = oQRCode.getModuleCount();
    // const nWidth = Math.floor(_htOption.width / nCount);
    // const nHeight = Math.floor(_htOption.height / nCount);

    this.clear();

    function makeSVG(tag: string, attrs: { [key: string]: string | undefined }): SVGElement {
      const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (const k in attrs) {
        const attr = attrs[k];
        if (attrs.hasOwnProperty(k) && attr) {
          el.setAttribute(k, attr);
        }
      }
      return el;
    }

    const svg = makeSVG("svg", {
      viewBox: "0 0 " + String(nCount) + " " + String(nCount),
      width: "100%",
      height: "100%",
      fill: _htOption.colorLight,
    });
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    _el.appendChild(svg);

    svg.appendChild(makeSVG("rect", { fill: _htOption.colorLight, width: "100%", height: "100%" }));
    svg.appendChild(makeSVG("rect", { fill: _htOption.colorDark, width: "1", height: "1", id: "template" }));

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        if (oQRCode.isDark(row, col)) {
          const child = makeSVG("use", { x: String(col), y: String(row) });
          child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
          svg.appendChild(child);
        }
      }
    }
  }

  public clear(): void {
    while (this._el.hasChildNodes()) {
      if (this._el.lastChild) {
        this._el.removeChild(this._el.lastChild);
      }
    }
  }
}
