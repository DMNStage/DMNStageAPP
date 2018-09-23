import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EmailComposer} from "@ionic-native/email-composer";
import {AuthProvider} from "../auth/auth";

@Injectable()
export class ContactUsProvider {

  constructor(public http: HttpClient, private emailComposer: EmailComposer, private authProvider: AuthProvider) {
    console.log('Hello ContactUsProvider Provider');
  }

  getContactEmail() {

    const reqHeader = new HttpHeaders({
      'No-Auth': 'true'
    });
    return this.http.get<{ key: string, value: string }>(this.authProvider.host + '/publicConfig/contactEmail', {headers: reqHeader});
  }

  contact() {
    this.getContactEmail().toPromise().then((config) => {
      let email = {
        to: config.value,
        /*subject: '[Application Extranet]',*/
      };
      this.emailComposer.open(email);
    }, () => {
    })


  }


}
