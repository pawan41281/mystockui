import { userData } from "./userData";

export class resetPassword {

    userId: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    createdOn: string;
    user: userData;

    constructor() {
        this.userId = "";
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.createdOn = "";
        this.user = new userData()
    }
}
