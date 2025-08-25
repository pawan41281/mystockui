import { color } from "./color";
import { contractor } from "./contractor";
import { design } from "./design";

export class intilaStock {
    contractor: contractor;
    design: design;
    color: color;
    openingBalance: number;
    balance: number;
    updatedOn: string;
    createdOn: string;

    constructor() {
        this.contractor = null
        this.design = null;
        this.color = null;
        this.openingBalance = 0;
        this.balance = 0;
        this.updatedOn = '';
        this.createdOn = '';
    }
}
