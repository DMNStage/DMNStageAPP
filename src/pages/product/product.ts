import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Product} from "../../model/product.model";
import {ProductProvider} from "../../providers/product/product";
import {Subproduct} from "../../model/subproduct.model";
import {SubproductPage} from "../subproduct/subproduct";

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  selectedProduct: Product;
  subProducts: Array<Subproduct> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private productProvider: ProductProvider) {
    this.selectedProduct = this.productProvider.getProductById(navParams.get('productid'));
    this.initializeSubProducts();
    console.log(this.selectedProduct)
  }

  initializeSubProducts() {
    this.subProducts = this.selectedProduct.subProducts;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');

  }


  onSubproductSelected(subproduct: Subproduct) {
    console.log(subproduct);
    this.navCtrl.push(
      SubproductPage,
      {
        subProduct: subproduct
      })
  }

  searchSubProduct(ev: any) {
    // Reset items back to all of the items
    this.initializeSubProducts();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.subProducts = this.subProducts.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }
}
