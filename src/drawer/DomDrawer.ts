import QRCodeModel from "../QRCodeModel";
import { QRCodeOptions } from "../interface";

export default class DomDrawer {
    private _el: HTMLElement;
    private _htOption: QRCodeOptions;

    constructor(el: HTMLElement, htOption: QRCodeOptions) {
        this._el = el;
        this._htOption = htOption;
    }

    /**
     * Draw the QRCode
     * 
     * @param {QRCode} oQRCode
     */
    public draw(oQRCode: QRCodeModel): void {
        const _htOption = this._htOption;
        const _el = this._el;
        const nCount = oQRCode.getModuleCount();
        const nWidth = _htOption.width ? Math.floor(_htOption.width / nCount) : 0;
        const nHeight = _htOption.height ? Math.floor(_htOption.height / nCount) : 0;
        const aHTML: string[] = ['<table style="border:0;border-collapse:collapse;">'];

        for (let row = 0; row < nCount; row++) {
            aHTML.push('<tr>');

            for (let col = 0; col < nCount; col++) {
                aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
            }

            aHTML.push('</tr>');
        }

        aHTML.push('</table>');
        _el.innerHTML = aHTML.join('');

        // Fix the margin values as real size.
        const elTable = _el.childNodes[0] as HTMLElement;
        const nLeftMarginTable = _htOption.width ? (_htOption.width - elTable.offsetWidth) / 2 : 0;
        const nTopMarginTable = _htOption.height ? (_htOption.height - elTable.offsetHeight) / 2 : 0;

        if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
            elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
        }
    }

    /**
     * Clear the QRCode
     */
    public clear(): void {
        this._el.innerHTML = '';
    }
}