# QRCodeTS

> QRCodeTS is a TypeScript re-implementation and packaging of the original [QRCodeJS](https://github.com/davidshimjs/qrcodejs) library.
>
> It allows you to generate QR codes with various customizable options.

## Installation

To install the package:

```bash
npm i @forward-software/qrcodets
```

## Usage

You can import and use QRCodeTS in your project as follows:

```javascript
import QRCode from "@forward-software/qrcodets";

const params = {
  id: "qrcode",
  element: document.getElementById("qrcode"),
  width: 256,
  height: 256,
  typeNumber: 4,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRErrorCorrectLevel.H,
  text: "https://example.com",
  mode: "svg",
};

const qrCode = new QRCode(params);
```

## Initialization Parameters

The QRCode class takes an object with the following properties as initialization parameters:

- id (optional): string
  - The ID of the HTML element where the QR code will be rendered.
- element (optional): HTMLElement
  - The HTML element where the QR code will be rendered. If both id and element are provided, element will be used.
- width (optional): number
  - The width of the QR code.
- height (optional): number
  - The height of the QR code.
- typeNumber (optional): number
  - The QR code version (1-40). Higher values increase the size and data capacity of the QR code.
- colorDark: string
  - The color of the dark modules (QR code pixels).
- colorLight: string
  - The color of the light modules (background).
- correctLevel (optional): QRErrorCorrectLevel
  - The error correction level. Possible values are:
    - QRErrorCorrectLevel.L (Low - ~7% error correction)
    - QRErrorCorrectLevel.M (Medium - ~15% error correction)
    - QRErrorCorrectLevel.Q (Quartile - ~25% error correction)
    - QRErrorCorrectLevel.H (High - ~30% error correction)
- text (optional): string
  - The text or URL to be encoded in the QR code.
- mode (optional): "svg" | "dom"
  - The rendering mode. Either 'svg' for SVG rendering or 'dom' for HTML DOM rendering.

## License

MIT License

## Acknowledgments

This library is based on [QRCodeTS](https://github.com/lilRedaka/qrcodets) by [lilRedaka](https://github.com/lilRedaka) and the original [QRCodeJS](https://github.com/davidshimjs/qrcodejs) by [davidshimjs](https://github.com/davidshimjs).

---

Made with ✨ & ❤️ by [ForWarD Software](https://github.com/forwardsoftware) and [contributors](https://github.com/forwardsoftware/qrcodets/graphs/contributors)
