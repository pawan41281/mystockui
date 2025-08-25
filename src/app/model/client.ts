
export class client {

  id: number;
  clientName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  mobile: string;
  gstNo: string;
  active: boolean;
  createdOn: string;
  name: any;


  constructor() {
    this.id = 0;
    this.clientName = "";
    this.address = "";
    this.city = "";
    this.state = "";
    this.country = "";
    this.email = "";
    this.mobile = "";
    this.gstNo = "";
    this.active = true;
    this.createdOn = "";
  }
}
