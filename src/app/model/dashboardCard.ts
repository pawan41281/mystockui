export class dashboardCard {
    dashboardCurrentMonthContractorCardVos: cardData;
    dashboardCurrentMonthClientCardVos: cardData;
    dashboardPreviousDayContractorCardVos: cardData;
    dashboardPreviousDayClientCardVos: cardData;

    constructor() {
        this.dashboardCurrentMonthContractorCardVos = null;
        this.dashboardCurrentMonthClientCardVos = null;
        this.dashboardPreviousDayContractorCardVos = null;
        this.dashboardPreviousDayClientCardVos = null;
    }
}

class cardData {

    challanType: string;
    challanCount: number;

    constructor() {
        this.challanType = '';
        this.challanCount = 0;
    }

}