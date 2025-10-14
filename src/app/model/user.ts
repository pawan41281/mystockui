export class user {

    id: number;
    userId: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
    roles: [];


    constructor() {
        this.id = 0;
        this.userId = "";
        this.email = "";
        this.mobile = "";
        this.password = "";
        this.role = "";
    }
}
