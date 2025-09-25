import { challanItems } from "./challanItems";
import { client } from "./client";

export class order {

  id: number;
  orderDate: string;
  orderNumber?: string;
  client: client;
  challanItems: challanItems[];
  party: number;
  design: number;
  color: number;
  quantity: number;
  createdOn: string;

  constructor() {
    this.id = 0;
    this.client = new client();
    this.challanItems = [];
    this.orderDate = "";
    this.party = 0;
    this.design = 0;
    this.createdOn = "";
    this.color = 0;
    this.quantity = 0;
  }
}
