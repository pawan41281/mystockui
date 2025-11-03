export class orderFilter {
    ordernumber: string;
    clientid: number;
    fromorderdate: string;
    clientName: string;
    toorderdate: string;
    quality: number;
    design: number;
    color: number;

    constructor() {
        this.ordernumber = "";
        this.clientid = 0;
        this.fromorderdate = '';
        this.toorderdate = '';
        this.clientName = '';
        this.quality = 0;
        this.design = 0;
        this.color = 0;
    }
}
