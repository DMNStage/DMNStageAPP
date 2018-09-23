import {Component, ViewChild} from '@angular/core';
import {MenuController, Slides} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('slider') slider: Slides;

  slides = [
    {
      title: 'La D.M.N, Votre partenaire pour un développement durable',
      imageUrl: 'assets/imgs/homeSlider/1.png'
    },
    {
      title: 'Le Siège de la Direction de la Météorologie Nationale ',
      imageUrl: 'assets/imgs/homeSlider/2.png'
    },
    {
      title: 'Le Siège de la Direction de la Météorologie Nationale',
      imageUrl: 'assets/imgs/homeSlider/3.png'
    },
    {
      title: ' Le Siège de la Direction de la Météorologie Nationale',
      imageUrl: 'assets/imgs/homeSlider/4.png'
    }
  ];

  constructor(private menuCtrl: MenuController) {

  }


  openMenu() {
    this.menuCtrl.open()
  }
}
