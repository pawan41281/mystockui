
import { challanItems } from "./challanItems";
import { client } from "./client";
import { order } from "./order";

export class clientChallan {

    id: number;
    challanNumber: string;
    challanDate: string;
    client: client;
    challanType: string;
    challanItems: challanItems[];
    order: order;
    party: number;
    design: number;
    color: number;
    quantity: number;
    createdOn: string;
    orderNumber?: number;

    constructor() {
        this.id = 0;
        this.challanNumber = "";
        this.client = new client();
        this.order = new order();
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
