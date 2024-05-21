import { EXP_TABLE, LOG_TABLE } from "./const";

export class QRMath {
    static EXP_TABLE = EXP_TABLE

    static LOG_TABLE = LOG_TABLE

    static glog(n: number): number | null {
        if (n < 1) {
            throw new Error(`glog(${n})`);
        }
        return QRMath.LOG_TABLE[n];
    }

    static gexp(n: number | null): number {
        if (typeof n !== "number") {
            throw new Error(`glog(${n})`);
        }
        while (n < 0) {
            n += 255;
        }
        while (n >= 256) {
            n -= 255;
        }
        return QRMath.EXP_TABLE[n];
    }
}