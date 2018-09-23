import {Component, Input} from '@angular/core';
import {IonicPage} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'login-flat',
  templateUrl: 'login-flat.html'
})
export class LoginFlat {
  @Input() data: any;
  @Input() events: any;

  public username: string;
  public password: string;

  public isUsernameValid: boolean;
  public isPasswordValid: boolean;
  onEvent = (event: string): void => {
    if (event == "onLogin") {
      if (this.validate()) {
        if (this.events[event]) {
          this.events[event]({
            'username': this.username,
            'password': this.password
          });
        }
      }
      else
        return;
    }
    if (event == "onContactUs") {
      if (this.events[event]) {
        this.events[event]();
      }
    }

  };

  constructor() {
    this.isUsernameValid = true;
    this.isPasswordValid = true;
  }

  validate(): boolean {
    this.isUsernameValid = true;
    this.isPasswordValid = true;
    if (!this.username || this.username.length == 0) {
      this.isUsernameValid = false;
    }

    if (!this.password || this.password.length == 0) {
      this.isPasswordValid = false;
    }

    return this.isPasswordValid && this.isUsernameValid;
  }

}
