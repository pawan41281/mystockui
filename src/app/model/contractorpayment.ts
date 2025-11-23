import { contractor } from "./contractor";
import { userData } from "./userData";

export class contractorpayment {

    id: number;
    paymentDate: string;
    contractor: contractor;
    remarks: string;
    createdOn: string;
    paymentAmount: number;
    user: userData;
    contractorName: string;
    constructor() {
        this.id = 0;
        this.contractor = new contractor();
        this.paymentDate = "";
        this.remarks = '';
        this.paymentAmount = null;
        this.user = new userData()
        this.contractorName = ''
    }

}