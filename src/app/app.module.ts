import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ProductPage} from "../pages/product/product";
import {AuthProvider} from '../providers/auth/auth';
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {LoginPage} from "../pages/login/login";
import {ProductProvider} from '../providers/product/product';
import {SubproductProvider} from '../providers/subproduct/subproduct';
import {SubproductPage} from "../pages/subproduct/subproduct";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProductPage,
    LoginPage,
    SubproductPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ProductPage,
    LoginPage,
    SubproductPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProductProvider,
    SubproductProvider,
    SubproductProvider,



  ]
})
export class AppModule {}
