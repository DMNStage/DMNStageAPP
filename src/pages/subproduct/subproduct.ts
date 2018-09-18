import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Subproduct} from "../../model/subproduct.model";
import {SubproductProvider} from "../../providers/subproduct/subproduct";
import * as datefns from 'date-fns'

/**
 * Generated class for the SubproductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subproduct',
  templateUrl: 'subproduct.html',
})
export class SubproductPage {

  myDate: any;//= new Date().toISOString();
  myTime: any;
  hoursValues: number[] = [];
  minutesValues: number[] = [];
  isTimeValuesFilled: boolean = false;
  private selectedSubProduct: Subproduct;

  constructor(public navCtrl: NavController, public navParams: NavParams, private subProductProvider: SubproductProvider) {
    this.selectedSubProduct = navParams.get('subProduct');
    console.log(this.selectedSubProduct);
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SubproductPage');
    this.getImagesTimes(this.selectedSubProduct);
  }

  onDateChange(myDate) {
    console.log(myDate);
    console.log(this.myDate);
    let date = new Date(this.myDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    console.log(date.getFullYear());
    console.log(date.getMonth() + 1);
    console.log(date.getDate());

    this.subProductProvider.getImages(this.selectedSubProduct.id, year, month, day).toPromise().then((imgs) => {
      console.log(imgs);
    }, (err) => {

    })

  }

  onTimeChange(myTime: any) {


  }

  getImagesTimes(subProduct: Subproduct) {
    //return this.http.get(this.authProvider.host+ '/imagetime2/'+subProductId + '?access_token=' + this.authProvider.tokenData.access_token);
    /*let hv:number = Number(subProduct.startTime.split(':')[0]);
    let mv:number = Number(subProduct.startTime.split(':')[1]);
    let mhv:number = Number(subProduct.endTime.split(':')[0]);
    let mmv:number = Number(subProduct.endTime.split(':')[1]);
    let step:number = subProduct.step;
    while (hv <= mhv) {
      this.hoursValues.push(hv);
      hv+=1;
    }
    if(mv == mmv)
      mmv=60-step;
    while (mv <= mmv) {
      this.minutesValues.push(mv);
      mv=mv+step;
    }
    console.log(this.hoursValues);
    console.log(this.minutesValues);
    setTimeout(()=> {
      this.isTimeValuesFilled=true;
    });*/

    let startTime = datefns.parse(subProduct.startTime, "HH:mm", new Date(2018, 10, 10));
    let endTime = datefns.parse(subProduct.endTime, "HH:mm", new Date(2018, 10, 10));
    let step: number = subProduct.step;
    while (datefns.compareAsc(startTime, endTime) == -1) {
      let h = datefns.format(startTime, 'HH');
      let m = datefns.format(startTime, 'mm');
      if (this.hoursValues.indexOf(Number(h)) == -1)
        this.hoursValues.push(Number(h));
      if (this.minutesValues.indexOf(Number(m)) == -1)
        this.minutesValues.push(Number(m));

      startTime = datefns.addMinutes(startTime, step);
    }
    console.log(this.hoursValues);
    console.log(this.minutesValues);
    setTimeout(() => {
      this.isTimeValuesFilled = true;
    });

  }
}
