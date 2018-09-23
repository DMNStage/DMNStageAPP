import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LoginFlatPage} from './login-flat-page';

import {LoginFlatModule} from '../../components/login/login-flat/login-flat.module';

@NgModule({
  declarations: [
    LoginFlatPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginFlatPage),
    LoginFlatModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginFlatPageModule {
}
