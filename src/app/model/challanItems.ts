import { color } from "./color";
import { design } from "./design";

export class challanItems {

    id: Number;
    design: design;
    color: color;
    quantity: number;
    createdOn: String;


    constructor() {
        this.id = 0;
        this.design = new design();
        this.color = new color();
        this.quantity = 0;
        this.createdOn = "";
    }
}
