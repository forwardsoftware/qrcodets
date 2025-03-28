import { HTMLDrawer, QRCode, QRCodeCompat, QRErrorCorrectLevel, SVGDrawer } from "../../dist";

import "./style.css";

// as SVG
new QRCode("https://example.com", {
  type: 4,
  correctionLevel: "H",
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
})
  .renderTo(new SVGDrawer(document.getElementById("qrcode-svg")!))
  .draw();

// as DOM
new QRCode("https://example.com", {
  type: 4,
  correctionLevel: "H",
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
})
  .renderTo(new HTMLDrawer(document.getElementById("qrcode-dom")!))
  .draw();

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
