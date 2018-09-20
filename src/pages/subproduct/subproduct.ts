import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, LoadingController, NavController, NavParams, Slides} from 'ionic-angular';
import {Subproduct} from "../../model/subproduct.model";
import {SubproductProvider} from "../../providers/subproduct/subproduct";
import * as datefns from 'date-fns';
import {ImgLoader} from 'ionic-image-loader';


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
  isTimeValuesFilled: boolean = false;
  fullscreen: boolean = false;
  bColor: any;
  imgs: any[];
  allImgs: any[] = [];
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  private selectedSubProduct: Subproduct;

  constructor(public navCtrl: NavController, public navParams: NavParams, private subProductProvider: SubproductProvider,
              private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.selectedSubProduct = navParams.get('subProduct');

  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SubproductPage');
    this.getImagesTimes();
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

      this.subProductProvider.getImages(this.selectedSubProduct.id, year, month, day).toPromise().then((data: { img: any[] }) => {
        console.log(data);
        this.allImgs = data.img.slice(0, this.imgsTimes.length);
        this.imgs = this.allImgs.slice(0, 10);
        this.myTime = this.imgsTimes[0];

        loading.dismiss();
      }, (err) => {
        console.log("Error while getting images:", err);
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

  toogleFullscreen() {
    this.fullscreen = !this.fullscreen;
    this.bColor = (this.bColor != "#000000") ? "#000000" : "#FFFFFF";
  }

  getImagesTimes() {
    this.imgsTimes = [];
    let startTime = datefns.parse(this.selectedSubProduct.startTime, "HH:mm", this.myDate);
    let endTime = datefns.parse(this.selectedSubProduct.endTime, "HH:mm", this.myDate);
    let step: number = this.selectedSubProduct.step;

    while ((datefns.compareAsc(startTime, endTime) <= 0) && datefns.compareAsc(startTime, new Date()) <= 0) {
      this.imgsTimes.push(datefns.format(startTime, 'HH:mm'));

      startTime = datefns.addMinutes(startTime, step);
    }
    console.log(this.imgsTimes);
    this.myTime = this.imgsTimes[0];

    setTimeout(() => {
      this.isTimeValuesFilled = true;
    });
  }

  onDateChange() {
    this.getImagesTimes();
    this.getImages();
    this.slides.update();
  }

  onTimeChange() {

    let isAutoPlay = this.slides._autoplaying;
    let ind = this.imgsTimes.indexOf(this.myTime);
    if (this.imgs.length < (ind + 6)) {
      if (this.imgs.length < ind + 1) {
        this.imgs = this.allImgs.slice(0, ind);
        const loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Veuillez Patienter ...'
        });
        loading.present();
        setTimeout(() => {
          this.slides.slideTo(ind);
          loading.dismiss();
          console.log(ind * 50);
        }, ind * 20);

      }
      else {
        this.imgs = this.allImgs.slice(0, this.imgs.length + 10);
        this.slides.slideTo(ind);
      }
    }
    else
      this.slides.slideTo(ind);

    if (isAutoPlay)
      this.slides.startAutoplay();

  }

  onPreviousBtn() {
    this.slides.slidePrev();
    this.myTime = this.imgsTimes[this.slides.getActiveIndex()];
    if (this.slides._autoplaying)
      this.slides.stopAutoplay();
  }

  onPlayBtn() {

    if (this.slides._autoplaying)
      this.slides.stopAutoplay();
    else {
      this.slides.autoplay = 1000;
      this.slides.speed = 500;
      this.slides.startAutoplay()
    }
  }

  onNextBtn() {
    if (this.imgs.length < (this.slides.getActiveIndex() + 6))
      this.imgs = this.allImgs.slice(0, this.imgs.length + 10);

    this.slides.slideNext();
    this.myTime = this.imgsTimes[this.slides.getActiveIndex()];
  }

  onSlideChange() {
    if (this.imgs.length < (this.slides.getActiveIndex() + 6))
      this.imgs = this.allImgs.slice(0, this.imgs.length + 10);

    this.myTime = this.imgsTimes[this.slides.getActiveIndex()];
  }
}
