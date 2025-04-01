import type { QRCodeModel, QRCodeRenderer, QRCodeRendererOptions } from "../types";

export function SVGRenderer(element: HTMLElement): QRCodeRenderer<boolean> {
  function clear(): boolean {
    while (element.hasChildNodes()) {
      if (element.lastChild) {
        element.removeChild(element.lastChild);
      }
    }

    return true;
  }

  function makeSVG(tag: string, attrs: Record<string, string | undefined>): SVGElement {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) {
      const attr = attrs[k];
      if (attrs.hasOwnProperty(k) && attr) {
        el.setAttribute(k, attr);
      }
    }
    return el;
  }

  function draw(model: QRCodeModel, options: QRCodeRendererOptions): boolean {
    const nCount = model.getModuleCount();

    clear();

    const svg = makeSVG("svg", {
      viewBox: "0 0 " + String(nCount) + " " + String(nCount),
      width: `${options.size}px`,
      height: `${options.size}px`,
      fill: options.colorLight,
    });
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    svg.appendChild(makeSVG("rect", { fill: options.colorLight, width: "100%", height: "100%" }));
    svg.appendChild(makeSVG("rect", { fill: options.colorDark, width: "1", height: "1", id: "template" }));

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        if (model.isDark(row, col)) {
          const child = makeSVG("use", { x: String(col), y: String(row) });
          child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
          svg.appendChild(child);
        }
      }
    }

    element.appendChild(svg);

    return true;
  }

  return {
    draw,
    clear,
  };
}
