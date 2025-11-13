export class AccountStatementModel {

    contractorId: number;
    contractorName: string;
    fromDate: string;
    toDate: string;
    workDoneAmount: number;
    paymentDoneAmount: number;

    constructor() {
        this.contractorId = 0;
        this.contractorName = '';
        this.fromDate = '';
        this.toDate = '';
        this.workDoneAmount = 0;
        this.paymentDoneAmount = 0;
    }

}
