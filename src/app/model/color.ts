import { userData } from "./userData";

export class color {

    id: number;
    colorName: string;
    active: boolean;
    createdOn: string;
    user: userData;

    constructor() {
        this.id = 0;
        this.colorName = "";
        this.active = true;
        this.createdOn = "";
        this.user = new userData()
    }
}
