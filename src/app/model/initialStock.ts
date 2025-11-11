import { color } from "./color";
import { contractor } from "./contractor";
import { design } from "./design";
import { quality } from "./quality";

export class intilaStock {
    contractor: contractor;
    design: design;
    color: color;
    quality: quality;
    openingBalance: number;
    balance: number;
    updatedOn: string;
    createdOn: string;

    constructor() {
        this.contractor = null
        this.design = null;
        this.color = null;
        this.quality = null;
        this.openingBalance = 0;
        this.balance = 0;
        this.updatedOn = '';
        this.createdOn = '';
    }
}
