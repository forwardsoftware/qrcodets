import DomDrawer from "./DomDrawer";
import QRCodeModel from "./QRCodeModel";
import SVGDrawer from "./SVGDrawer";
import { QRErrorCorrectLevel } from "./const"
import { Drawer, QRCodeOptions } from "./interface";
import { _getAndroid, _getTypeNumber } from "./utils";




/**
     * @class QRCode
     * @constructor
     * @example 
     * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
     *
     * @example
     * var oQRCode = new QRCode("test", {
     *    text : "http://naver.com",
     *    width : 128,
     *    height : 128
     * });
     * 
     * oQRCode.clear(); // Clear the QRCode.
     * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
     *
     * @param {HTMLElement|String} el target element or 'id' attribute of element.
     * @param {String} text
     * @param {Object} vOption
     * @param {String} vOption.text QRCode link data
     * @param {Number} [vOption.width=256]
     * @param {Number} [vOption.height=256]
     * @param {String} [vOption.colorDark="#000000"]
     * @param {String} [vOption.colorLight="#ffffff"]
     * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H] 
     */
export default class QRCode {
    private _htOption: QRCodeOptions;
    private _el: HTMLElement;
    private _oQRCode: QRCodeModel | null;
    private _oDrawing: Drawer;

    constructor(el: HTMLElement | string, text?: string, vOption?: QRCodeOptions,) {
        this._htOption = {
            width: 256,
            height: 256,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRErrorCorrectLevel.H
        };

        if (typeof text === 'string') {
            this._htOption.text = text

        }

        // Overwrites options
        if (vOption) {
            this._htOption = { ...this._htOption, ...vOption }
        }

        if (typeof el === "string") {
            el = document.getElementById(el)!;
        }

        this._el = el;
        this._oQRCode = null;
        if (this._htOption.mode == "svg") {
            this._oDrawing = new SVGDrawer(this._el, this._htOption)
        } else {
            this._oDrawing = new DomDrawer(this._el, this._htOption)
        }

        if (this._htOption.text) {
            this.makeCode(this._htOption.text);
        }
    }

    /**
     * Make the QRCode
     * 
     * @param {String} sText link data
     */
    makeCode(sText: string): void {
        if (this._htOption.correctLevel) {
            this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel!);
            this._oQRCode.addData(sText);
            this._oQRCode.make();
            this._el.title = sText;
            this._oDrawing.draw(this._oQRCode);
        }
    }

    /**
     * Clear the QRCode
     */
    clear(): void {
        this._oDrawing.clear();
    }
}
