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
  // public buildUrl(params: Record<string, any>): string {
  //   const query = Object.entries(params)
  //     .filter(([_, value]) => value != null && value !== '' && value != 0) // skip null/undefined/empty
  //     .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  //     .join('&');

  //   return query ? `?${query}` : '';
  // }

  public numberOnly(event: any): boolean {
    return /^[0-9]$/.test(event.key);
  }

  public formatDate_dd_MM_YYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  public getStatus(params: any) {

    const isActive = params.node.data.active;
    const statusDotClass = isActive ? 'dot-green' : 'dot-red';
    return `<span class="${statusDotClass}"></span>`;
  }

  public validateGST(gstNo: String) {
    return gstNo && gstNo.length < 15 ? true : false;
  }
}
