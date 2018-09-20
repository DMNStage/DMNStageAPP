import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SubproductPage} from './subproduct';
import {IonicImageLoader} from 'ionic-image-loader';

@NgModule({
  declarations: [
    SubproductPage,
  ],
  imports: [
    IonicPageModule.forChild(SubproductPage),
    IonicImageLoader,
  ],
})
export class SubproductPageModule {
}
