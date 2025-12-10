export class challanFilter {
    challannumber: string;
    clientid: number;
    clientName: string
    fromDate: string;
    toDate: string;
    challantype: "";
    orderid?: string;
    orderNumber?: string;

    constructor() {
        this.challannumber = "";
        this.clientid = 0;
        this.clientName = '';
        this.fromDate = '';
        this.toDate = '';
        this.challantype = '';
    }
}
