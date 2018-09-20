import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthProvider} from "../auth/auth";
import {Product} from "../../model/product.model";

/*
  Generated class for the ProductProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductProvider {

  public products: Array<Product>;

  constructor(public http: HttpClient, private authProvider: AuthProvider) {
    console.log('Hello ProductProvider Provider');
  }

  getProductsByClient(username: String) {
    return this.http.get(this.authProvider.host + '/productsbyclient/' + username + '?access_token=' + this.authProvider.tokenData.access_token);
  }

  getProductById(productId: number) {
    return this.products.find(x => x.id == productId);
  }
}
