import { role } from "./role";

export class user {

    id: number;
    userId: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
    locked: boolean;
    role: string;
    roles: role[];


    constructor() {
        this.id = 0;
        this.userId = "";
        this.email = "";
        this.mobile = "";
        this.password = "";
        this.locked = false;
        this.role = "";
        this.roles = [];
    }
}
