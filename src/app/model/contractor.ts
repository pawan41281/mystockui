
export class contractor {

    id: number;
    contractorName: String;
    address: String;
    city: String;
    state: String;
    country: String;
    email: String;
    mobile: String;
    gstNo: String;
    active: boolean;
    createdOn: String;


    constructor() {
        this.id = 0;
        this.contractorName = "";
        this.address = "";
        this.city = "";
        this.state = "";
        this.country = "";
        this.email = "";
        this.mobile = "";
        this.gstNo = "";
        this.active = true;
        this.createdOn = "";
    }
}
