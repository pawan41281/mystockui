
import { challanItems } from "./challanItems";
import { client } from "./client";

export class clientChallan {

    id: Number;
    challanNumber: string;
    challanDate: string;
    client: client;
    challanType: string;
    challanItems: challanItems[];
    party: number;
    design: number;
    color: number;
    quantity: number;
    createdOn: string;

    constructor() {
        this.id = 0;
        this.challanNumber = "";
        this.client = new client();
        this.challanItems = [];
        this.challanDate = "";
        this.party = 0;
        this.design = 0;
        this.createdOn = "";
        this.challanType = "I";
        this.color = 0;
        this.quantity = 0;
    }
}
