import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthProvider} from "../auth/auth";
import {Product} from "../../model/product.model";

@Injectable()
export class ProductProvider {

  public products: Array<Product>;

  constructor(public http: HttpClient, private authProvider: AuthProvider) {
    console.log('Hello ProductProvider Provider');
  }

  getProductsByClient(username: String) {
    return this.http.get(this.authProvider.host + '/productsbyclient/' + username);
  }

  getProductById(productId: number) {
    return this.products.find(x => x.id == productId);
  }
}
