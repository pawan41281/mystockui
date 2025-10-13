export class orderFilter {
    ordernumber: string;
    clientid: number;
    fromorderdate: string;
    clientName: string;
    toorderdate: string;

    constructor() {
        this.ordernumber = "";
        this.clientid = 0;
        this.fromorderdate = '';
        this.toorderdate = '';
        this.clientName = '';
    }
}
