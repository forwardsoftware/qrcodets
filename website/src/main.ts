import { HTMLRenderer as HTML, QRCode, QRCodeCompat, QRErrorCorrectLevel, SVGRenderer as SVG } from "../../dist";

import "./style.css";

// as SVG
new QRCode("https://example.com", {
  type: 4,
  correctionLevel: "H",
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
}).renderTo(SVG(document.getElementById("qrcode-svg")!));

// as DOM
new QRCode("https://example.com", {
  type: 4,
  correctionLevel: "H",
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
}).renderTo(HTML(document.getElementById("qrcode-dom")!));

// as SVG by ID using Compatibility mode
new QRCodeCompat({
  id: "qrcode-compat-svg",
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
  text: "https://example.com",
  mode: "svg",
});

// as DOM by ID
new QRCodeCompat({
  id: "qrcode-compat-dom",
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
  text: "https://example.com",
  mode: "dom",
});

// as SVG by Element
new QRCodeCompat({
  element: document.getElementById("qrcode-compat-el-svg")!,
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
  text: "https://example.com",
  mode: "svg",
});

// as DOM by ID
new QRCodeCompat({
  element: document.getElementById("qrcode-compat-el-dom")!,
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
  text: "https://example.com",
  mode: "dom",
});
