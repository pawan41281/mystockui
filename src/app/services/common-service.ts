import { inject, Injectable } from '@angular/core';
import { DataService } from './data-service';
import { ResponseData } from '../model/Response';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private dataService = inject(DataService);
  private colorList: [] = []
  constructor() { }

  // getColorData = () => {
  //   const resObj = new ResponseData()
  //   this.dataService.get('colors')
  //     .subscribe((res: ReqResponseData) => {

  //       resObj.datalist = res.data;
  //       resObj.totalRecord = res.metadata.recordcount
  //     })
  //   return resObj;
  // }

  async getColorData(): Promise<ResponseData> {
    const res: ReqResponseData = await firstValueFrom(this.dataService.get('colors'));
    const resObj = new ResponseData();
    resObj.datalist = res.data;
    resObj.totalRecord = res.metadata.recordcount;
    return resObj;
  }
}

class ReqResponseData {
  status: string;
  mssage: string;
  data: []
  metadata: metadata
}
class metadata {
  recordcount: number
}
