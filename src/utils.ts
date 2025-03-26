import { QRMath } from "./QRMath";
import QRPolynomial from "./QRPolynomial";
import type { QRCodeModel } from "./QRCodeModel";
import { G15, G15_MASK, G18, PATTERN_POSITION_TABLE, QRCodeLimitLength, QRErrorCorrectLevel, QRMaskPattern, QRMode } from "./const";

// android 2.x doesn't support Data-URI spec
export function _getAndroid() {
    var android = false;
    var sAgent = navigator.userAgent;

    if (/android/i.test(sAgent)) { // android
        android = true;
        var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

        if (aMat && aMat[1]) {
            android = !!parseFloat(aMat[1]);
        }
    }

    return android;
}

export function _getAndroidVersion() {
    var sAgent = navigator.userAgent;
    var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
    let version = 0
    if (aMat && aMat[1]) {
        version = parseFloat(aMat[1]);
    }
    return version
}

/**
    * Get the type by string length
    * 
    * @private
    * @param {String} sText
    * @param {Number} nCorrectLevel
    * @return {Number} type
    */
export function _getTypeNumber(sText: string, nCorrectLevel: number): number {
    var nType = 1;
    var length = _getUTF8Length(sText);

    for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
        var nLimit = 0;

        switch (nCorrectLevel) {
            case QRErrorCorrectLevel.L:
                nLimit = QRCodeLimitLength[i][0];
                break;
            case QRErrorCorrectLevel.M:
                nLimit = QRCodeLimitLength[i][1];
                break;
            case QRErrorCorrectLevel.Q:
                nLimit = QRCodeLimitLength[i][2];
                break;
            case QRErrorCorrectLevel.H:
                nLimit = QRCodeLimitLength[i][3];
                break;
        }

        if (length <= nLimit) {
            break;
        } else {
            nType++;
        }
    }

    if (nType > QRCodeLimitLength.length) {
        throw new Error("Too long data");
    }

    return nType;
}

export function _getUTF8Length(sText: string) {
    let utf8Length = 0;
    for (let i = 0; i < sText.length; i++) {
        const charCode = sText.charCodeAt(i);
        if (charCode < 0x80) {
            utf8Length += 1;
        } else if (charCode < 0x800) {
            utf8Length += 2;
        } else if (charCode < 0x10000) {
            utf8Length += 3;
        } else if (charCode < 0x200000) {
            utf8Length += 4;
        }
    }
    return utf8Length;
}

export function getBCHTypeInfo(data: number): number {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15)));
    }
    return ((data << 10) | d) ^ G15_MASK;
}

export function getBCHTypeNumber(data: number): number {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18)));
    }
    return (data << 12) | d;
}

export function getBCHDigit(data: number): number {
    let digit = 0;
    while (data !== 0) {
        digit++;
        data >>>= 1;
    }
    return digit;
}
export function getPatternPosition(typeNumber: number): number[] {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
}

export function getMask(maskPattern: number, i: number, j: number): boolean {
    switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
            return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001:
            return i % 2 === 0;
        case QRMaskPattern.PATTERN010:
            return j % 3 === 0;
        case QRMaskPattern.PATTERN011:
            return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case QRMaskPattern.PATTERN101:
            return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110:
            return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111:
            return ((i * j) % 3 + (i + j) % 2) % 2 === 0;
        default:
            throw new Error(`bad maskPattern: ${maskPattern}`);
    }
}

export function getErrorCorrectPolynomial(errorCorrectLength: number): QRPolynomial {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
}

export function getLengthInBits(mode: number, type: number): number {
    if (1 <= type && type < 10) {
        switch (mode) {
            case QRMode.MODE_NUMBER:
                return 10;
            case QRMode.MODE_ALPHA_NUM:
                return 9;
            case QRMode.MODE_8BIT_BYTE:
                return 8;
            case QRMode.MODE_KANJI:
                return 8;
            default:
                throw new Error(`mode: ${mode}`);
        }
    } else if (type < 27) {
        switch (mode) {
            case QRMode.MODE_NUMBER:
                return 12;
            case QRMode.MODE_ALPHA_NUM:
                return 11;
            case QRMode.MODE_8BIT_BYTE:
                return 16;
            case QRMode.MODE_KANJI:
                return 10;
            default:
                throw new Error(`mode: ${mode}`);
        }
    } else if (type < 41) {
        switch (mode) {
            case QRMode.MODE_NUMBER:
                return 14;
            case QRMode.MODE_ALPHA_NUM:
                return 13;
            case QRMode.MODE_8BIT_BYTE:
                return 16;
            case QRMode.MODE_KANJI:
                return 12;
            default:
                throw new Error(`mode: ${mode}`);
        }
    } else {
        throw new Error(`type: ${type}`);
    }
}

export function getLostPoint(qrCode: QRCodeModel): number {
    const moduleCount = qrCode.getModuleCount();
    let lostPoint = 0;

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            let sameCount = 0;
            const dark = qrCode.isDark(row, col);
            for (let r = -1; r <= 1; r++) {
                if (row + r < 0 || moduleCount <= row + r) {
                    continue;
                }
                for (let c = -1; c <= 1; c++) {
                    if (col + c < 0 || moduleCount <= col + c) {
                        continue;
                    }
                    if (r === 0 && c === 0) {
                        continue;
                    }
                    if (dark === qrCode.isDark(row + r, col + c)) {
                        sameCount++;
                    }
                }
            }
            if (sameCount > 5) {
                lostPoint += (3 + sameCount - 5);
            }
        }
    }

    for (let row = 0; row < moduleCount - 1; row++) {
        for (let col = 0; col < moduleCount - 1; col++) {
            let count = 0;
            if (qrCode.isDark(row, col)) count++;
            if (qrCode.isDark(row + 1, col)) count++;
            if (qrCode.isDark(row, col + 1)) count++;
            if (qrCode.isDark(row + 1, col + 1)) count++;
            if (count === 0 || count === 4) {
                lostPoint += 3;
            }
        }
    }

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount - 6; col++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
                lostPoint += 40;
            }
        }
    }

    for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount - 6; row++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
                lostPoint += 40;
            }
        }
    }

    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount; row++) {
            if (qrCode.isDark(row, col)) {
                darkCount++;
            }
        }
    }

    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
}

export function _isSupportCanvas() {
    return typeof CanvasRenderingContext2D != "undefined";
}