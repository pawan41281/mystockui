import { userData } from "./userData";

export class contractor {

    id: number;
    contractorName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    email: string;
    mobile: string;
    gstNo: string;
    active: boolean;
    createdOn: string;
    user: userData;

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
        this.user = new userData()
        this.createdOn = "";
    }
}
