import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, LoadingController, NavParams, Slides} from 'ionic-angular';
import {Subproduct} from "../../model/subproduct.model";
import {SubproductProvider} from "../../providers/subproduct/subproduct";
import * as datefns from 'date-fns';

@IonicPage()
@Component({
  selector: 'page-subproduct',
  templateUrl: 'subproduct.html',
})
export class SubproductPage {

  myDate: any = datefns.format(new Date(), "YYYY-MM-dd");
  nowDate = datefns.format(new Date(), "YYYY-MM-dd");
  myTime: any;
  imgsTimes: any[] = [];
  isTimeValuesFilled: boolean = false;
  fullscreen: boolean = false;
  bColor: any;
  imgs: any[];
  allImgs: any[] = [];
  areImgsReady: boolean = false;
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  private selectedSubProduct: Subproduct;

  constructor(public navParams: NavParams, private subProductProvider: SubproductProvider,
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

    if (datefns.isValid(this.myDate)) {
      let date = new Date(this.myDate);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      this.subProductProvider.getImages(this.selectedSubProduct.id, year, month, day).toPromise().then((data: { img: any[] }) => {
        this.allImgs = data.img.slice(0, this.imgsTimes.length);
        this.imgs = this.allImgs.slice(0, 10);
        this.myTime = this.imgsTimes[0];
        this.areImgsReady = (this.imgs.length > 0);


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
      }).catch((err) => {
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
    this.myTime = this.imgsTimes[0];

    setTimeout(() => {
      this.isTimeValuesFilled = true;
    });
  }

  onDateChange() {
    this.getImagesTimes();
    this.getImages();
    if (this.slides != null)
      this.slides.update();
  }

  onTimeChange() {

    let isAutoPlay = this.slides._autoplaying;
    let ind = this.imgsTimes.indexOf(this.myTime);
    if (this.imgs.length < (ind + 6) && !this.slides.isEnd()) {
      if (this.imgs.length < ind + 2) {

        this.allImgs.slice(this.imgs.length, ind).forEach((img) => {
          this.imgs.push(img);
        });

        const loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Veuillez Patienter ...'
        });
        loading.present();
        setTimeout(() => {
          this.slides.slideTo(ind + 1);
          loading.dismiss();
        }, ind * 40);

      }
      else {

        this.allImgs.slice(this.imgs.length, this.imgs.length + 10).forEach((img) => {
          this.imgs.push(img);
        });
        this.slides.slideTo(ind + 1);
      }
    }
    else
      this.slides.slideTo(ind);

    if (isAutoPlay)
      this.slides.startAutoplay();

    if (this.slides != null)
      this.slides.update();

  }

  onPreviousBtn() {
    this.slides.slidePrev();
    this.myTime = this.imgsTimes[this.slides.getActiveIndex()];
    if (this.slides._autoplaying)
      this.slides.stopAutoplay();
  }

  onPlayBtn() {
    this.slides.fade = {
      crossFade: true
    };
    if (this.slides._autoplaying)
      this.slides.stopAutoplay();
    else {
      this.slides.autoplay = 1000;
      this.slides.speed = 1;
      this.slides.startAutoplay()
    }
  }

  onNextBtn() {
    if (this.imgs.length < (this.slides.getActiveIndex() + 6)) {
      this.allImgs.slice(this.imgs.length, this.imgs.length + 10).forEach((img) => {
        this.imgs.push(img);
      });

      if (this.slides != null)
        this.slides.update();
    }


    this.slides.slideNext();
    this.myTime = this.imgsTimes[this.slides.getActiveIndex()];
  }

  onSlideChange() {
    if (this.imgs.length < (this.slides.getActiveIndex() + 6)) {
      this.allImgs.slice(this.imgs.length, this.imgs.length + 10).forEach((img) => {
        this.imgs.push(img);
      });
      if (this.slides != null)
        this.slides.update();
    }

    this.myTime = this.imgsTimes[this.slides.getActiveIndex()];
  }
}
