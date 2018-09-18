import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Subproduct} from "../../model/subproduct.model";
import {SubproductProvider} from "../../providers/subproduct/subproduct";
import * as datefns from 'date-fns';

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

  myDate: any = datefns.format(new Date(), "YYYY-MM-dd");
  myTime: any;
  imgsTimes: any[] = [];
  /*hoursValues: number[] = [];
  minutesValues: number[] = [];
  startTime: any;
  endTime: any;*/
  isTimeValuesFilled: boolean = false;
  private selectedSubProduct: Subproduct;
  fullscreen: boolean = false;
  bColor: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private subProductProvider: SubproductProvider,
              private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.selectedSubProduct = navParams.get('subProduct');
    console.log(this.selectedSubProduct);
    /*this.startTime =datefns.format(datefns.parse(this.selectedSubProduct.startTime, "HH:mm", new Date(2018, 10, 10)),"x");
    this.endTime = datefns.format(datefns.parse(this.selectedSubProduct.endTime, "HH:mm", new Date(2018, 10, 10)),"x");*/

  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SubproductPage');
    this.getImagesTimes();
    this.getImages();
  }

  onDateChange() {
    this.getImages();

  }

  getImages() {
    const loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Veuillez Patienter ...'
    });
    loading.present();

    console.log(this.myDate);
    if (datefns.isValid(this.myDate)) {
      let date = new Date(this.myDate);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      console.log(date.getFullYear());
      console.log(date.getMonth() + 1);
      console.log(date.getDate());

      this.subProductProvider.getImages(this.selectedSubProduct.id, year, month, day).toPromise().then((imgs) => {
        console.log(imgs);
        loading.dismiss();
      }, (err) => {
        const alert = this.alertCtrl.create({
          title: 'Erreur!',
          subTitle: 'Erreur lors de la récupération des images!',
          buttons: [{
            text: 'OK',
            handler: () => {

            }
          }]
        });
        alert.present();
        loading.dismiss();
      })
    }


  }

  onTimeChange(myTime: any) {

    console.log(myTime);
  }

  toogleFullscreen() {

    this.fullscreen = !this.fullscreen;
    this.bColor = (this.bColor != "#000000") ? "#000000" : "#FFFFFF";
  }

  getImagesTimes() {
    let startTime = datefns.parse(this.selectedSubProduct.startTime, "HH:mm", new Date(2018, 10, 10));
    let endTime = datefns.parse(this.selectedSubProduct.endTime, "HH:mm", new Date(2018, 10, 10));
    let step: number = this.selectedSubProduct.step;
    console.log(startTime);
    while (datefns.compareAsc(startTime, endTime) == -1 || datefns.compareAsc(startTime, endTime) == 0) {
      this.imgsTimes.push(datefns.format(startTime, 'HH:mm'));

      startTime = datefns.addMinutes(startTime, step);
    }
    console.log(this.imgsTimes);
    this.myTime = this.imgsTimes[0];

    setTimeout(() => {
      this.isTimeValuesFilled = true;
    });

  }
}
