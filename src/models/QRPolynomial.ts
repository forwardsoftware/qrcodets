import { galoisFieldExp, galoisFieldLog } from "./QRMath";


export class QRPolynomial {
    private num: Array<number>;

    constructor(num: Array<number>, shift: number) {
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
                num[i + j] ^= galoisFieldExp(galoisFieldLog(this.get(i)) + galoisFieldLog(e.get(j)));
            }
        }
        return new QRPolynomial(num, 0);
    }

    mod(e: QRPolynomial): QRPolynomial {
        if (this.getLength() - e.getLength() < 0) {
            return this;
        }
        const ratio = galoisFieldLog(this.get(0)) - galoisFieldLog(e.get(0));
        const num = new Array(this.getLength());
        for (let i = 0; i < this.getLength(); i++) {
            num[i] = this.get(i);
        }
        for (let i = 0; i < e.getLength(); i++) {
            num[i] ^= galoisFieldExp(galoisFieldLog(e.get(i)) + ratio);
        }
        return new QRPolynomial(num, 0).mod(e);
    }
}