import { QRMath } from "./QRMath";

export default class QRPolynomial {
    private num: number[];

    constructor(num: number[], shift: number) {
        if (num.length === undefined) {
            throw new Error(num.length + "/" + shift);
        }
        let offset = 0;
        while (offset < num.length && num[offset] === 0) {
            offset++;
        }
        this.num = new Array(num.length - offset + shift);
        for (let i = 0; i < num.length - offset; i++) {
            this.num[i] = num[i + offset];
        }
    }

    get(index: number): number {
        return this.num[index];
    }

    getLength(): number {
        return this.num.length;
    }

    multiply(e: QRPolynomial): QRPolynomial {
        const num = new Array(this.getLength() + e.getLength() - 1);
        for (let i = 0; i < this.getLength(); i++) {
            for (let j = 0; j < e.getLength(); j++) {
                const glogi = QRMath.glog(this.get(i))
                const glogj = QRMath.glog(e.get(j))
                if (glogi && glogj) {
                    num[i + j] ^= QRMath.gexp(glogi + glogj);
                }
            }
        }
        return new QRPolynomial(num, 0);
    }

    mod(e: QRPolynomial): QRPolynomial | null {
        if (this.getLength() - e.getLength() < 0) {
            return this;
        }

        const glog0 = QRMath.glog(this.get(0))
        const gloge0 = QRMath.glog(e.get(0))

        if (glog0 && gloge0) {
            const ratio = glog0 - gloge0;

            const num = new Array(this.getLength());
            for (let i = 0; i < this.getLength(); i++) {
                num[i] = this.get(i);
            }
            for (let i = 0; i < e.getLength(); i++) {
                const glogei = QRMath.glog(e.get(i))
                if (glogei) {
                    num[i] ^= QRMath.gexp(glogei + ratio);
                }
            }

            return new QRPolynomial(num, 0).mod(e);
        }
        return null
    }
}