import { QRErrorCorrectLevel } from "../enums";

import { RS_BLOCK_TABLE } from "./constants";

export class QRRSBlock {
    totalCount: number
    dataCount: number
    constructor(totalCount: number, dataCount: number) {
        this.totalCount = totalCount; this.dataCount = dataCount;
    }

    static RS_BLOCK_TABLE = RS_BLOCK_TABLE
    static getRSBlocks(typeNumber: number, errorCorrectLevel: QRErrorCorrectLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (rsBlock == undefined) { throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel); }
        var length = rsBlock.length / 3;
        var list: QRRSBlock[] = [];
        for (var i = 0; i < length; i++) {
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j++) {
                list.push(new QRRSBlock(totalCount, dataCount));
            }
        }
        return list;
    }
    static getRsBlockTable(typeNumber: number, errorCorrectLevel: QRErrorCorrectLevel) {
        switch (errorCorrectLevel) {
            case QRErrorCorrectLevel.L:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case QRErrorCorrectLevel.M:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case QRErrorCorrectLevel.Q:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case QRErrorCorrectLevel.H:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default:
                return undefined;
        }
    }
}
