
export class graphs {
    dashboardClientGraphVos: graphsData[];
    dashboardContractorGraphVos: graphsData[];


    constructor() {
        this.dashboardClientGraphVos = [];
        this.dashboardContractorGraphVos = [];

    }
}

class graphsData {
    challanDate: string;
    issuedQuantity: number;
    receivedQuantity: number
    constructor() {
        this.challanDate = "";
        this.issuedQuantity = 0;
        this.receivedQuantity = 0;
    }
}
// challanItems: challanItems[];

// "data": {
//     "dashboardClientGraphVos": [
//         {
//             "challanDate": "2025-08-14",
//             "issuedQuantity": 128,
//             "receivedQuantity": 4763
//         },
//         {
//             "challanDate": "2025-08-15",
//             "issuedQuantity": 0,
//             "receivedQuantity": 0
//         },
//         {
//             "challanDate": "2025-08-16",
//             "issuedQuantity": 0,
//             "receivedQuantity": 0
//         },
//         {
//             "challanDate": "2025-08-17",
//             "issuedQuantity": 0,
//             "receivedQuantity": 23
//         },
//         {
//             "challanDate": "2025-08-18",
//             "issuedQuantity": 45,
//             "receivedQuantity": 0
//         },
//         {
//             "challanDate": "2025-08-19",
//             "issuedQuantity": 0,
//             "receivedQuantity": 0
//         },
//         {
//             "challanDate": "2025-08-20",
//             "issuedQuantity": 0,
//             "receivedQuantity": 0
//         }
//     ],
//         "dashboardContractorGraphVos": [
//             {
//                 "challanDate": "2025-08-14",
//                 "issuedQuantity": 125,
//                 "receivedQuantity": 170
//             },
//             {
//                 "challanDate": "2025-08-15",
//                 "issuedQuantity": 0,
//                 "receivedQuantity": 0
//             },
//             {
//                 "challanDate": "2025-08-16",
//                 "issuedQuantity": 0,
//                 "receivedQuantity": 0
//             },
//             {
//                 "challanDate": "2025-08-17",
//                 "issuedQuantity": 12,
//                 "receivedQuantity": 0
//             },
//             {
//                 "challanDate": "2025-08-18",
//                 "issuedQuantity": 45,
//                 "receivedQuantity": 0
//             },
//             {
//                 "challanDate": "2025-08-19",
//                 "issuedQuantity": 0,
//                 "receivedQuantity": 0
//             },
//             {
//                 "challanDate": "2025-08-20",
//                 "issuedQuantity": 0,
//                 "receivedQuantity": 0
//             }
//         ]
// },