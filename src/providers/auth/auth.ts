import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Token} from "../../model/token.model";
import {App, NavController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  readonly host = 'https://api.dmnstage.com';
  // readonly host = 'http://localhost:8088';
  public tokenData: Token;
  private readonly tokenLocalStorageDataKey = 'TokenData';
  private readonly clientId = 'QWRtaW5BcHA=';
  private readonly secret = 'c2VjcmV0';
  private nav: NavController;

  constructor(public http: HttpClient, private storage: Storage, private app: App) {
    this.nav = app.getActiveNav();
    console.log('Hello AuthProvider Provider');
  }

  authenticateUser(username, password) {
    let data = new HttpParams();
    data = data.set('username', username);
    data = data.set('password', password);
    data = data.set('grant_type', 'password');

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(atob(this.clientId) + ':' + atob(this.secret)),
      'No-Auth': 'true'
    });
    return this.http.post<Token>(this.host + '/oauth/token', data, {headers: reqHeader})
  }

  checkTokenData(data: Token): Promise<any> {
    console.log('Checking Token ...');
    const expirationDate = new Date(data.expiration);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 0); // now + 2 minutes
    console.log(expirationDate);
    console.log(now);
    return new Promise((resolve, reject) => {
      if (expirationDate > now) {
        console.log('Token not expired');
        resolve();
      } else {
        console.log('Token expired');
        reject();
      }
    });
    /*if (expirationDate > now) {
      console.log('Token not expired');

      /!*console.log('Checking token server side ...');

      const reqHeader = new HttpHeaders({
        'Authorization': 'Bearer ' + data.access_token,
        'No-Auth': 'true'
      });
      return this.http.head(this.host + '/checktoken', {headers: reqHeader})
        .pipe(map(
          (result) => {
            // Server send empty response with 200 http status so the token is valid
            console.log('Server side said token valid');
            return true;
          }), catchError((err: HttpErrorResponse) => {
            console.log('Server side said token invalid');
            return of(false);
          })
        );*!/
    } else {
      console.log('Token expired');
      return of(false);
    }*/
  }

  getNewTokenDataFromRefreshToken(refreshtoken: string): Observable<Token> {

    console.log('getting new access token from refresh token');
    let data = new HttpParams();
    data = data.set('refresh_token', refreshtoken);
    data = data.set('grant_type', 'refresh_token');

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(atob(this.clientId) + ':' + atob(this.secret)),
      'No-Auth': 'true'
    });
    return this.http.post<Token>(this.host + '/oauth/token', data, {headers: reqHeader})

  }

  storeTokenData(data: Token) {
    console.log('Storing token to local storage');
    this.tokenData = data;
    this.storage.ready().then(() => {
      this.storage.set(this.tokenLocalStorageDataKey, JSON.stringify(data));
    });
  }

  getTokenDataFromLocalStorage(): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.storage.get(this.tokenLocalStorageDataKey).then((data) => {
        if (data != null) {
          this.tokenData = JSON.parse(data);
          resolve(this.tokenData);
        } else {
          console.log('Can\'t get tokenData from localStorage');
          reject();
        }
      }, () => {
        console.log('Can\'t get tokenData from localStorage');
        reject();
      });
    });
  }

  clearTokenData() {
    console.log('Removing old Token Data from local storage');
    //localStorage.removeItem(this.tokenLocalStorageDataKey);
    this.storage.remove(this.tokenLocalStorageDataKey);
  }

  revokeToken(tokenData: Token) {

    let body = new HttpParams();
    body = body.set('access_token', tokenData.access_token);
    return this.http.post(this.host + '/revoke_token', body);
  }

  logout() {
    if (this.tokenData != null) {
      this.storage.remove(this.tokenLocalStorageDataKey);
      this.revokeToken(this.tokenData).subscribe(response => {
          console.log("Token revoked server side");
        },
        err => {
          console.log('Can\'t revoke token server side');
        })
    }
  }
}
