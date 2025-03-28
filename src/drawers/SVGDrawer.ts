import type { QRCodeDrawer, QRCodeDrawerOptions, QRCodeModel } from "../types";

export class SVGDrawer implements QRCodeDrawer {
  private _el: HTMLElement;

  constructor(el: HTMLElement) {
    this._el = el;
  }

  public draw(model: QRCodeModel, options: QRCodeDrawerOptions): boolean {
    const _el = this._el;

    const nCount = model.getModuleCount();

    this.clear();

    const svg = this.makeSVG("svg", {
      viewBox: "0 0 " + String(nCount) + " " + String(nCount),
      width: `${options.size}px`,
      height: `${options.size}px`,
      fill: options.colorLight,
    });
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    _el.appendChild(svg);

    svg.appendChild(this.makeSVG("rect", { fill: options.colorLight, width: "100%", height: "100%" }));
    svg.appendChild(this.makeSVG("rect", { fill: options.colorDark, width: "1", height: "1", id: "template" }));

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        if (model.isDark(row, col)) {
          const child = this.makeSVG("use", { x: String(col), y: String(row) });
          child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
          svg.appendChild(child);
        }
      }
    }

    return true;
  }

  public clear(): boolean {
    while (this._el.hasChildNodes()) {
      if (this._el.lastChild) {
        this._el.removeChild(this._el.lastChild);
      }
    }

    return true;
  }

  private makeSVG(tag: string, attrs: { [key: string]: string | undefined }): SVGElement {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) {
      const attr = attrs[k];
      if (attrs.hasOwnProperty(k) && attr) {
        el.setAttribute(k, attr);
      }
    }
    return el;
  }
}
