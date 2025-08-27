import { Injectable } from '@angular/core';
import { commonData } from '../model/commonData';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  commondata: commonData = new commonData();
  constructor() { }

  public challanTypes = [{ val: "I", name: "Issue" }, { val: "R", name: "Recieve" }]

  public buildUrl(obj: any) {
    let search_url = '';
    Object.entries(obj).forEach(([key, value]) => {
      if (value) {
        if (!search_url) {
          search_url += `?${key}=${value}`
        } else {
          search_url += `&${key}=${value}`
        }
      }
    });
    return search_url;
  }

  public numberOnly(event: KeyboardEvent): boolean {
    return /^[0-9]$/.test(event.key);
  }

  public formatDate_dd_MM_YYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  public getStatus(params) {

    const isActive = params.node.data.active;
    const statusDotClass = isActive ? 'dot-green' : 'dot-red';
    return `<span class="${statusDotClass}"></span>`;
  }

  public validateGST(gstNo: string) {
    return gstNo && gstNo.length < 15 ? true : false;
  }



}
