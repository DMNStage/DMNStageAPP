import {Component} from '@angular/core';
import {App, IonicPage, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {HomePage} from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginResult: any;
  private loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Veuillez Patienter ...'
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider,
              private app: App, private menu: MenuController, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  login() {
    this.loading.present();
    this.authProvider.authenticateUser('client1', '654321').subscribe(data => {
        this.loginResult = data;
        this.authProvider.storeTokenData(data);
        this.app.getActiveNav().setRoot(HomePage);
        try {
          this.loading.dismiss();
        } catch (e) {

        }
      },
      err => {
        this.loginResult = err;
        try {
          this.loading.dismiss();
        } catch (e) {

        }
      });
  }

}
