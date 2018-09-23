import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, MenuController, NavController, ToastController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthProvider} from "../../providers/auth/auth";
import {ContactUsProvider} from "../../providers/contact-us/contact-us";

@IonicPage()
@Component({
  selector: 'login-flat-page',
  templateUrl: 'login-flat-page.html',
  providers: [ContactUsProvider]
})
export class LoginFlatPage {

  /*  Necessary data and events
      ================================*/
  data: {};
  events: {};
  onContactUs = (params): void => {
    this.contactUsProvider.contact();
  };
  /*  Todo override this function with your logic
  =================================================*/
  onLogin = (params): void => {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Veuillez Patienter ...'
    });
    loading.present();
    this.authProvider.authenticateUser(params.username, params.password).subscribe(tokenData => {

        this.authProvider.storeTokenData(tokenData).then(() => {
          this.myEvents.publish('loggedIn', tokenData);

          this.navCtrl.setRoot(HomePage);


          try {
            loading.dismiss();
          } catch (e) {

          }

        }, () => {
          this.presentToast('Erreur Système. Veuillez relancer l\'application.', 3000, '');
        });


      },
      (err: HttpErrorResponse) => {

        console.log(err);
        if (err.status === 400) {
          console.log(err.error.error_description);
          if (err.error.error_description.toLowerCase().search('bad credentials') !== -1) {
            this.presentToast('Nom d\'utilisateur ou mot de passe incorrect', 3000, '');
          } else if (err.error.error_description.toLowerCase().search('user is disabled') !== -1) {
            this.presentToast('Votre compte est désactivé', 3000, '');
          }
        } else {
          this.presentToast('Erreur Système', 3000, '');
        }

        try {
          loading.dismiss();
        } catch (e) {

        }
      });

  };

  constructor(public navCtrl: NavController, private authProvider: AuthProvider,
              private loadingCtrl: LoadingController, public myEvents: Events, private toastCtrl: ToastController,
              private contactUsProvider: ContactUsProvider, private menu: MenuController) {
    this.data = {
      "logo": "assets/imgs/DMNlogo.png",
      "btnLogin": "Se Connecter",
      "txtUsername": "Nom d'utilisateur",
      "txtPassword": "Mot de passe",
      "btnContactUs": "Contactez nous",
      "title": "Bienvenue,",
      "subtitle": "Veuillez se connecter à votre compte",
      "errorUser": "Ce champ ne peut pas être vide.",
      "errorPassword": "Ce champ ne peut pas être vide."
    };
    this.events = {
      "onLogin": this.onLogin,
      "onContactUs": this.onContactUs
    }
  }

  presentToast(message: string, duration: number, position: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      dismissOnPageChange: true
    });
    toast.present();
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }
}
