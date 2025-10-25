import { userData } from "./userData";

export class quality {

    id: number;
    qualityName: string;
    active: boolean;
    createdOn: string;
    user: userData;

    constructor() {
        this.id = 0;
        this.qualityName = "";
        this.active = true;
        this.createdOn = "";
        this.user = new userData()
    }
}
