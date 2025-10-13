import { challanItems } from "./challanItems";
import { client } from "./client";

export class order {

  id: number;
  orderDate: string;
  orderNumber?: string;
  client: client;
  orderItems: challanItems[];
  party: number;
  design: number;
  color: number;
  quantity: number;
  createdOn: string;

  constructor() {
    this.id = 0;
    this.client = new client();
    this.orderItems = [];
    this.orderDate = "";
    this.party = 0;
    this.design = 0;
    this.createdOn = "";
    this.color = 0;
    this.quantity = 0;
  }
}
