import { QRCode, QRErrorCorrectLevel } from "../../dist";

import "./style.css";

// as SVG by ID
new QRCode({
  id: "qrcode-svg",
  element: document.getElementById("qrcode-svg")!,
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
new QRCode({
  id: "qrcode-dom",
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
new QRCode({
  element: document.getElementById("qrcode-el-svg")!,
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.Q,
  text: "https://example.com",
  mode: "svg",
});

// as DOM by ID
new QRCode({
  element: document.getElementById("qrcode-el-dom")!,
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.L,
  text: "https://example.com",
  mode: "dom",
});
