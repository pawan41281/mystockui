export class challanFilter {
    challannumber: string;
    clientid: number;
    clientName: string
    fromchallandate: string;
    tochallandate: string;
    challantype: "";
    orderid?: string;

    constructor() {
        this.challannumber = "";
        this.clientid = 0;
        this.clientName = '';
        this.fromchallandate = '';
        this.tochallandate = '';
        this.challantype = '';
    }
}
