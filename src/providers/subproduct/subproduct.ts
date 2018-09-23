import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthProvider} from "../auth/auth";

@Injectable()
export class SubproductProvider {

  constructor(public http: HttpClient, private authProvider: AuthProvider) {
    console.log('Hello SubproductProvider Provider');
  }

  getImages(subProductId: number, year: number, month, day) {
    if (month.toString().length == 1)
      month = '0' + month;
    if (day.toString().length == 1)
      day = '0' + day;
    return this.http.get(this.authProvider.host + '/image/' + subProductId + '?year=' + year + '&month=' + month + '&day=' + day);
  }

}
