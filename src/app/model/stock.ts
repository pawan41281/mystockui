export class stock {
    contractorName?: string;
    designName: string;
    colorName: string;
    quality: number;
    qualityName: string;
    quantity: number

    constructor() {
        this.designName = '';
        this.colorName = '';
        this.quality = 0;
        this.qualityName = '';
        this.quantity = 0
    }
}