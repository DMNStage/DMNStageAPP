import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthProvider} from "../auth/auth";

/*
  Generated class for the SubproductProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
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
    return this.http.get(this.authProvider.host + '/image/' + subProductId + '?year=' + year + '&month=' + month + '&day=' + day + '&access_token=' + this.authProvider.tokenData.access_token);
  }

}
