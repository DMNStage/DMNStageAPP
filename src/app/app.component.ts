import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, LoadingController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {ProductPage} from '../pages/product/product';
import {Product} from "../model/product.model";
import {ListPage} from "../pages/list/list";
import {AuthProvider} from "../providers/auth/auth";
import {LoginPage} from "../pages/login/login";
import {ProductProvider} from "../providers/product/product";
import {ImageLoaderConfig} from "ionic-image-loader";
import {File} from '@ionic-native/file';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, id: number }> = [];

  /*products: Array<Product> = [];*/
  currentUser: string = 'Maroc Météo';

  private isInitialized: boolean = false;

  private loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Veuillez Patienter ...'
  });

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private authProvider: AuthProvider, public menuCtrl: MenuController, private loadingCtrl: LoadingController,
              private productProvider: ProductProvider, public alertCtrl: AlertController,
              private imageLoaderConfig: ImageLoaderConfig, private file: File, public events: Events) {
    this.initializeApp();

    this.pages = [
      {title: 'Home', id: -2}
    ];


  }

  ionViewDidEnter() {
    console.log("aaaaaa");
    console.log(this.isInitialized);
    if (!this.isInitialized)
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.events.subscribe('loggedIn', (tokenData) => {
        this.pages = [
          {title: 'Home', id: -2}
        ];
        this.productProvider.getProductsByClient(tokenData.username).toPromise().then((productData: Array<Product>) => {
          console.log(productData);
          this.productProvider.products = productData;
          productData.forEach(product => {
            this.pages.push({title: product.name, id: product.id});
          });
          this.isInitialized = true;

        }, () => {

          const alert = this.alertCtrl.create({
            title: 'Erreur!',
            subTitle: 'Erreur lors de la récupération de vos produits!',
            buttons: [{
              text: 'Réessayer',
              handler: () => {
                this.myInit();
              }
            }]
          });
          alert.present();

        });
      });

      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.styleBlackOpaque();
      }

      console.log(this.file.dataDirectory);
      this.file.checkDir(this.file.dataDirectory, 'mydir').then(_ => console.log('Directory exists'))
        .catch(err => console.log('Directory doesn\'t exist'));

      // image loader config
      this.imageLoaderConfig.enableSpinner(true);
      // set the maximum concurrent connections to 10
      //this.imageLoaderConfig.setConcurrency(10);
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
        this.rootPage = LoginPage;
        this.splashScreen.hide();
      })


      /*this.splashScreen.hide();*/
    });
  }


  myInit(): Promise<Boolean> {

    return new Promise((resolve, reject) => {

      this.authProvider.getTokenDataFromLocalStorage().then((tokenData) => {
        console.log(tokenData);
        this.authProvider.checkTokenData(tokenData).then(() => {
          console.log('Token Valid');
          this.productProvider.getProductsByClient(tokenData.username).toPromise().then((productData: Array<Product>) => {
            console.log(productData);
            this.productProvider.products = productData;
            productData.forEach(product => {
              this.pages.push({title: product.name, id: product.id});
            });
            this.isInitialized = true;
            resolve();

          }, () => {

            const alert = this.alertCtrl.create({
              title: 'Erreur!',
              subTitle: 'Erreur lors de la récupération de vos produits!',
              buttons: [{
                text: 'Réessayer',
                handler: () => {
                  this.myInit();
                }
              }]
            });
            alert.present();

          });

          /*this.rootPage = HomePage;
          this.splashScreen.hide();*/
          resolve();

        }, () => {
          console.log('Token Invalid');
          this.authProvider.getNewTokenDataFromRefreshToken(tokenData.refresh_token).toPromise().then((newTokenData) => {
            console.log(newTokenData);
            this.authProvider.storeTokenData(newTokenData);
            this.productProvider.getProductsByClient(tokenData.username).toPromise().then((productData: Array<Product>) => {
              console.log(productData);
              this.productProvider.products = productData;
              productData.forEach(product => {
                this.pages.push({title: product.name, id: product.id});
              });
              this.isInitialized = true;
              resolve();

            }, () => {

              const alert = this.alertCtrl.create({
                title: 'Erreur!',
                subTitle: 'Erreur lors de la récupération de vos produits!',
                buttons: [{
                  text: 'Réessayer',
                  handler: () => {
                    this.myInit();
                  }
                }]
              });
              alert.present();

            });

            /*this.rootPage = HomePage;
              this.splashScreen.hide();*/
            resolve();

          }, (err) => {
            console.log(err);
            console.log("Can\' get new token from refresh token");
            /*this.rootPage = LoginPage;
            this.splashScreen.hide();*/
            reject();
          })


        })

      }, (err) => {
        /*console.log('Going to login page');
        this.rootPage = LoginPage;
        this.splashScreen.hide();*/
        reject()
      });


    });


  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.id == -2)
      this.nav.setRoot(HomePage);
    else if (page.id == -1)
      this.nav.setRoot(ListPage);
    else
      this.nav.setRoot(ProductPage, {
        productid: page.id
      });

  }

  logout() {
    this.loading.present();
    this.pages = [];
    this.authProvider.logout();
    setTimeout(() => {
      this.menuCtrl.close();
      this.rootPage = LoginPage;
      this.nav.setRoot(LoginPage);
      try {
        this.loading.dismiss();
      } catch (e) {

      }
    });
  }
}
