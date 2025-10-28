import { userData } from "./userData";

export class design {

    id: number;
    designName: string;
    description: string;
    active: boolean;
    createdOn: string;
    user: userData;
    quality: number;


    constructor() {
        this.id = 0;
        this.designName = "";
        this.description = "";
        this.active = true;
        this.createdOn = "";
        this.user = new userData()
        this.quality = 0;
    }
}
