import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {Token} from "../../model/token.model";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loginResult: any;
  tokendata: Token;

  constructor(public navCtrl: NavController, private authProvider: AuthProvider) {

  }

  login() {
    this.authProvider.authenticateUser('abdellahaski', '654321').subscribe(data => {
        this.loginResult = data;
        this.authProvider.storeTokenData(data);
      },
      err => this.loginResult = err);
  }

  getTokenFromStorage() {
    this.authProvider.getTokenDataFromLocalStorage().then((data) => {
      console.log(data);
      console.log(this.authProvider.tokenData);
    }, (err) => {
      console.log('none');
    });
  }

  logout() {


  }
}
