export class orderFilter {
    ordernumber: string;
    clientid: number;
    fromorderdate: string;
    clientName: string;
    toorderdate: string;
    qualityId: number;
    designId: number;
    colorId: number;

    constructor() {
        this.ordernumber = "";
        this.clientid = 0;
        this.fromorderdate = '';
        this.toorderdate = '';
        this.clientName = '';
        this.qualityId = 0;
        this.designId = 0;
        this.colorId = 0;
    }
}
