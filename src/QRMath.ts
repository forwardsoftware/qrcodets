import { EXP_TABLE, LOG_TABLE } from "./const";

export class QRMath {
    static EXP_TABLE = EXP_TABLE

    static LOG_TABLE = LOG_TABLE

    static glog(n: number): number {
        if (n < 1 || typeof n !== "number") {
            console.warn(`glog(${n})`)
            return 0
        }
        if (QRMath.LOG_TABLE[n] === null || typeof QRMath.LOG_TABLE[n] !== "number") {
            console.warn(`LOG_TABLE(${n}:${QRMath.LOG_TABLE[n]})`)
            return 0
        }
        return QRMath.LOG_TABLE[n] ?? 0;
    }

    static gexp(n: number | null): number {
        if (typeof n !== "number") {
            console.warn(`glog(${n})`)
            return 0
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