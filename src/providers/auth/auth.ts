import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Token} from "../../model/token.model";
import {Storage} from '@ionic/storage';
import {Observable} from "rxjs";

@Injectable()
export class AuthProvider {

  readonly host = 'https://api.dmnstage.com';
  public tokenData: Token;
  private readonly tokenLocalStorageDataKey = 'TokenData';
  private readonly clientId = 'Q2xpZW50QXBw';
  private readonly secret = 'c2VjcmV0';

  constructor(public http: HttpClient, private storage: Storage) {
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

  checkTokenDataClientSide(tokenData: Token): Promise<any> {
    console.log('Checking Token ...');
    const expirationDate = new Date(tokenData.expiration);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2); // now + 2 minutes
    return new Promise((resolve, reject) => {
      if (expirationDate > now) {
        console.log('Token not expired');
        resolve();
      } else {
        console.log('Token expired');
        reject();
      }
    });
  }

  checkTokenDataServerSide(tokenData: Token): Promise<any> {
    console.log('Checking token server side ...');
    const reqHeader = new HttpHeaders({
      'Authorization': 'Bearer ' + tokenData.access_token,
      'No-Auth': 'true'
    });
    return new Promise((resolve, reject) => {
      this.http.head(this.host + '/checktoken', {headers: reqHeader}).toPromise().then(() => {
        // Server send empty response with 200 http status so the token is valid
        console.log('Server side said token valid');
        resolve();
      }, () => {
        console.log('Server side said token invalid or expired');
        reject();
      })

    });
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
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.set(this.tokenLocalStorageDataKey, JSON.stringify(data)).then(() => {
          console.log("stored");
          resolve();
        }, () => {
          reject();
        });
      });
    })

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
    console.log('Removing Token Data from local storage');
    return this.storage.remove(this.tokenLocalStorageDataKey);
  }

  revokeToken(tokenData: Token) {

    let body = new HttpParams();
    body = body.set('access_token', tokenData.access_token);
    return this.http.post(this.host + '/revoke_token', body);
  }

  logout() {
    return this.clearTokenData()

  }
}
