import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ProductPage} from "../pages/product/product";
import {AuthProvider} from '../providers/auth/auth';
import {IonicStorageModule} from "@ionic/storage";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ProductProvider} from '../providers/product/product';
import {SubproductProvider} from '../providers/subproduct/subproduct';
import {SubproductPage} from "../pages/subproduct/subproduct";
import {IonicImageLoader} from "ionic-image-loader";
import {EmailComposer} from "@ionic-native/email-composer";
import {ContactUsProvider} from '../providers/contact-us/contact-us';
import {AuthInterceptorProvider} from '../providers/auth-interceptor/auth-interceptor';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProductPage,
    SubproductPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProductPage,
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
    EmailComposer,
    ContactUsProvider,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorProvider, multi: true},


  ]
})
export class AppModule {
}
