import { color } from "./color";
import { design } from "./design";
import { quality } from "./quality";

export class challanItems {

    id: number;
    design: design;
    color: color;
    quantity: number;
    createdOn: string;
    rate: number;
    quality: quality;


    constructor() {
        this.id = 0;
        this.design = new design();
        this.color = new color();
        this.quantity = 0;
        this.createdOn = "";
        this.rate = 0;
        this.quality = new quality();
    }
}
