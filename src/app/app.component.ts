import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, LoadingController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {ProductPage} from '../pages/product/product';
import {Product} from "../model/product.model";
import {AuthProvider} from "../providers/auth/auth";
import {ProductProvider} from "../providers/product/product";
import {ImageLoader, ImageLoaderConfig} from "ionic-image-loader";
import {ContactUsProvider} from "../providers/contact-us/contact-us";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, id: number }> = [];
  currentUser: string = 'Maroc Météo';

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private authProvider: AuthProvider, public menuCtrl: MenuController, private loadingCtrl: LoadingController,
              private productProvider: ProductProvider, public alertCtrl: AlertController,
              private imageLoaderConfig: ImageLoaderConfig, public events: Events,
              private imageLoader: ImageLoader, private contactUsProvider: ContactUsProvider) {
    this.initializeApp();

    this.pages = [
      {title: 'Home', id: -2}
    ];
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.events.subscribe('loggedIn', (tokenData) => {
        this.prepareSideMenu(tokenData.username).then(() => {
        }, () => this.logout());
      });
      this.events.subscribe('logout', (aa) => {
        const alert = this.alertCtrl.create({
          title: 'Erreur!',
          subTitle: 'Veuillez vous reconnecter',
          buttons: [{
            text: 'OK'
          }]
        });
        alert.present();
        this.logout();
      });

      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.styleBlackOpaque();
      }

      // image loader config
      this.imageLoaderConfig.enableSpinner(true);
      // set the maximum concurrent connections to 15
      // this.imageLoaderConfig.setConcurrency(15);
      // this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.useImageTag(true);
      this.imageLoaderConfig.setFallbackUrl('assets/imgs/fallbackimg.jpg');
      this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000);
      this.imageLoaderConfig.setImageReturnType('base64');

      this.myInit().then(() => {
        this.rootPage = HomePage;
        this.splashScreen.hide();
      }, () => {
        console.log('Going to login page');
        this.rootPage = "LoginFlatPage";
        this.nav.setRoot("LoginFlatPage");
        this.splashScreen.hide();
      })


      /*this.splashScreen.hide();*/
    });
  }

  myInit(): Promise<Boolean> {

    return new Promise((resolve, reject) => {

      this.authProvider.getTokenDataFromLocalStorage().then((tokenData) => {
        this.authProvider.checkTokenDataClientSide(tokenData).then(() => {
          console.log('Token Valid (client Side check)');
          this.authProvider.checkTokenDataServerSide(tokenData).then(() => {
            this.prepareSideMenu(tokenData.username).then(() => {
            }, () => this.logout());

            resolve();
          }, () => {
            this.logout();
          })

        }, () => {
          console.log('Token Invalid');
          this.authProvider.getNewTokenDataFromRefreshToken(tokenData.refresh_token).toPromise().then((newTokenData) => {
            this.authProvider.storeTokenData(newTokenData).then(() => {
              this.prepareSideMenu(tokenData.username).then(() => {
              }, () => this.logout());
            }, () => reject());


            resolve();

          }, (err) => {
            console.log(err);
            console.log("Can\'t get new token from refresh token");

            reject();
          })
        })
      }, () => {

        reject()
      });

    });
  }

  prepareSideMenu(username: string) {
    return new Promise((resolve, reject) => {
      this.pages = [
        {title: 'Home', id: -1}
      ];
      this.currentUser = username;
      this.productProvider.getProductsByClient(username).toPromise().then((productsData: Array<Product>) => {
        this.productProvider.products = productsData;
        productsData.forEach(product => {
          this.pages.push({title: product.name, id: product.id});
        });
        resolve();

      }, () => {
        const alert = this.alertCtrl.create({
          title: 'Erreur!',
          subTitle: 'Erreur lors de la récupération de vos produits!',
          buttons: [{
            text: 'Réessayer',
            handler: () => {
              this.prepareSideMenu(username).then(() => resolve(), () => reject());
            }
          }]
        });
        alert.present();

        alert.onDidDismiss((data, role) => {
          if (role == 'backdrop')
            reject();
        })

      });

    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.id == -1)
      this.nav.setRoot(HomePage);
    else
      this.nav.setRoot(ProductPage, {
        productid: page.id
      });

  }

  logout() {

    const loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Veuillez Patienter ...'
    });
    loading.present();

    console.log("clearing cache");
    this.imageLoader.clearCache();
    this.pages = [];
    this.authProvider.logout().then(() => {


      this.menuCtrl.close();
      this.rootPage = "LoginFlatPage";
      this.nav.setRoot("LoginFlatPage");
      try {
        loading.dismiss();
      } catch (e) {

      }
    }, () => {

      this.menuCtrl.close();
      this.rootPage = "LoginFlatPage";
      this.nav.setRoot("LoginFlatPage");
      try {
        loading.dismiss();
      } catch (e) {

      }
    });
  }
}
