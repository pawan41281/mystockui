import { Injectable } from '@angular/core';
import { commonData } from '../model/commonData';
import { formatDate } from '@angular/common';

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
    return /^-?\d*$/.test(event.key);
  }

  public formatDate_dd_MM_YYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  isValidDateFormat(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateStr);
  }

  dateFromate_dd_MM_YY(date: Date) {
    return date && !this.isValidDateFormat(date.toString()) ? this.formatDate_dd_MM_YYYY(date) : '';
  }


  public getStatus(params) {

    // const isActive = params.node.data.active;
    // const statusDotClass = isActive ? 'dot-green' : 'dot-red';
    // return `<span class="${statusDotClass}"></span>`;

    const isActive = params.node.data.active;
    const statusImage = isActive ? 'assets/images/green.png' : 'assets/images/red.png';
    return `<img src="${statusImage}">`;

  }

  public getUserStatus(params) {

    // const isLocked = params.node.data.locked;
    // const statusDotClass = isLocked ? 'dot-red' : 'dot-green';
    // return `<span class="${statusDotClass}"></span>`;

    const isLocked = params.node.data.locked;
    const statusImage = isLocked ? 'assets/images/red.png' : 'assets/images/green.png';
    return `<img src="${statusImage}">`;
  }

  public validateGST(gstNo: string) {
    return gstNo && gstNo.length < 15 ? true : false;
  }

  public compareObjects(obj1, obj2) {
    for (let key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;

  }

  public getCurrentUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public getMaxDate(date: Date) {

    const [day, month, year] = formatDate(date, 'dd-MM-yyyy', 'en-US').split('-').map(Number);
    return new Date(year, month + 2, day - 1);
  }
}
