import {Component, ViewChild} from '@angular/core';
import {App, Events, IonicPage, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {HomePage} from "../home/home";
import {ProductProvider} from "../../providers/product/product";
import {HttpErrorResponse} from "@angular/common/http";

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
  @ViewChild('email') email: any;

  private username: string;
  private password: string;
  private error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider,
              private app: App, private menu: MenuController, private loadingCtrl: LoadingController,
              private productProvider: ProductProvider, public events: Events) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    setTimeout(() => {
      this.email.setFocus();
    }, 500);
  }


  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  onLogin() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Veuillez Patienter ...'
    });
    loading.present();
    this.authProvider.authenticateUser(this.username, this.password).subscribe(tokenData => {
        this.loginResult = tokenData;
        this.authProvider.storeTokenData(tokenData);

        this.events.publish('loggedIn', tokenData);


        this.app.getActiveNav().setRoot(HomePage);
        try {
          loading.dismiss();
        } catch (e) {

        }
      },
      (err: HttpErrorResponse) => {

        console.log(err);
        if (err.status === 400) {
          console.log(err.error.error_description);
          if (err.error.error_description.toLowerCase().search('bad credentials') !== -1) {
            this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
          } else if (err.error.error_description.toLowerCase().search('user is disabled') !== -1) {
            this.error = 'Votre compte est désactivé';
          }
        } else {
          this.error = 'Erreur Système'
        }

        try {
          loading.dismiss();
        } catch (e) {

        }
      });
  }

}
