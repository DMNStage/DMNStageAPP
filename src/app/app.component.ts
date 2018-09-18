import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {ProductPage} from '../pages/product/product';
import {Product} from "../model/product.model";
import {ListPage} from "../pages/list/list";
import {AuthProvider} from "../providers/auth/auth";
import {LoginPage} from "../pages/login/login";
import {ProductProvider} from "../providers/product/product";

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
              private productProvider: ProductProvider, public alertCtrl: AlertController) {
    this.initializeApp();

    this.pages = [
      {title: 'Home', id: -2},
      {title: 'List', id: -1}
    ];


    /*this.products.push(new Product(1,'aaaa',''));
    this.products.push(new Product(2,'bbbb',''));
    this.products.push(new Product(3,'cccc',''));*/


    /* this.products.forEach(product => {
       this.pages.push({title:product.name, id: product.id});
     });*/
    // used for an example of ngFor and navigation
    /*this.pages = [
      { title: 'Home', productid: 0 },
      { title: 'List', productid: 0 }
    ];*/

  }

  ionViewWillEnter() {
    if (!this.isInitialized)
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.styleBlackOpaque();
      }

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

          }, () => {

            const alert = this.alertCtrl.create({
              title: 'Erreur!',
              subTitle: 'Erreur lors de la récupération de vos produits!',
              buttons: [{
                text: 'Réessayer',
                handler: () => {
                  this.initializeApp();
                }
              }]
            });
            alert.present();

          });

          this.rootPage = HomePage;
          this.splashScreen.hide();

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

            }, () => {

              const alert = this.alertCtrl.create({
                title: 'Erreur!',
                subTitle: 'Erreur lors de la récupération de vos produits!',
                buttons: [{
                  text: 'Réessayer',
                  handler: () => {
                    this.initializeApp();
                  }
                }]
              });
              alert.present();

            });

            this.rootPage = HomePage;
            this.splashScreen.hide();

          }, (err) => {
            console.log(err);
            console.log("Can\' get new token from refresh token");
            this.rootPage = LoginPage;
            this.splashScreen.hide();
          })


        })

      }, (err) => {
        console.log('Going to login page');
        this.rootPage = LoginPage;
        this.splashScreen.hide();
      });


      /*this.splashScreen.hide();*/
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
