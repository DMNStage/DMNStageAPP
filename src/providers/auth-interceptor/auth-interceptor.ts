import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AuthProvider} from "../auth/auth";
import {catchError, mergeMap} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import {Token} from "../../model/token.model";
import {Events} from "ionic-angular";

/*
  Generated class for the AuthInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthInterceptorProvider implements HttpInterceptor {

  constructor(public http: HttpClient, private authProvider: AuthProvider, public events: Events) {
    console.log('Hello AuthInterceptorProvider Provider');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'true') {
      return next.handle(req.clone());
    }
    let is401TokenData;
    /*return next.handle(req.clone());*/

    /*let promise = this.authProvider.getTokenDataFromLocalStorage().then((data)=> {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization1', 'Bearer ' + data.access_token)
      });
      return next.handle(clonedreq.clone());
    }, () => {
      return null;
    });*/

    return Observable.fromPromise(this.tokenWork()).pipe(mergeMap((tokenData: Token) => {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + tokenData.access_token)
      });
      return next.handle(clonedreq).do(succ => {
        console.log("succ");
      }, err => {
        if (err.status === 401) {
          console.log('interceptor said NO');
          console.log('got 401 from server');
          is401TokenData = tokenData;

        }
      });
    }), catchError(err => {

      if (is401TokenData) {
        return this.authProvider.getNewTokenDataFromRefreshToken(is401TokenData.refresh_token).pipe(mergeMap((newTokenData) => {
          this.authProvider.storeTokenData(newTokenData);
          const clonedreq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + newTokenData.access_token)
          });
          return next.handle(clonedreq);
        }))
      }
      else {
        console.log("error");
        console.log(err);
        this.events.publish('logout');
        return of<HttpEvent<any>>()
      }

    }));
  }


  tokenWork() {
    return new Promise((resolve, reject) => {
      this.authProvider.getTokenDataFromLocalStorage().then((tokenData) => {
        //resolve(tokenData);
        this.authProvider.checkTokenDataClientSide(tokenData).then(() => {
          resolve(tokenData);
        }, () => {
          /*reject("checkTokenDataClientSide");*/
          this.authProvider.getNewTokenDataFromRefreshToken(tokenData.refresh_token).toPromise().then(
            (newTokenData) => {
              this.authProvider.storeTokenData(newTokenData);
              resolve(newTokenData);
            }, () => {
              reject("getNewTokenDataFromRefreshToken");
            })
        })
      }, () => {
        reject("getTokenDataFromLocalStorage");
      })
    })
  }

}
