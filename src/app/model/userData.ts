export class userData {

    id: number;
    name: string
    userId: string
    email: string
    mobile: string
    password: string
    locked: boolean
    roles: []

    constructor() {
        this.id = 0;
        this.name = "";
        this.userId = "";
        this.email = "";
        this.mobile = "";
        this.password = "";
        this.locked = false;
    }

}
