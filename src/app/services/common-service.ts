import { inject, Injectable } from '@angular/core';
import { DataService } from './data-service';
import { ResponseData } from '../model/Response';
import { firstValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  tokenExpired$: Subject<boolean> = new Subject<boolean>();
  tokenRecieved$: Subject<boolean> = new Subject<boolean>();
  private dataService = inject(DataService);
  constructor() { }

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
