import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { OfferItem } from 'src/app/models/offer-item.model';
import { FavouritesService } from 'src/app/services/favourites.service';
import { Clipboard } from '@capacitor/clipboard';
import { PictureService } from 'src/app/services/picture.service';
import { PictureItem } from 'src/app/stores/picture-index-db.store';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage {
  form = this.fb.group({
    title: ['', [Validators.required]],
    address: ['', [Validators.required]],
    shortDescription: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });
  images: PictureItem[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly favourites: FavouritesService,
    private readonly toast: ToastController,
    private readonly pictures: PictureService,
    private readonly router: Router,
  ) {}

  async onCapture(path: string) {
    this.images.push({
      path,
      offerId: -1,
    });
  }

  async submit() {
    const item = {
      ...this.form.value,
      offerId: 1000 + Math.floor(Math.random() * 1000),
      image: this.images[0]?.path || '',
    } as OfferItem;
    await this.favourites.checkAndAdd(item);

    if (this.images.length > 1) {
      for (const picture of this.images.slice(1)) {
        await this.pictures.savePicture(picture.path, item.offerId);
      }
    }

    const toast = await this.toast.create({
      translucent: false,
      color: 'dark',
      message: 'Added new Offer to Favourites',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            this.router.navigate(['offer-details/' + item.offerId]);
          },
        },
      ],
    });
    await toast.present();

    this.form.reset();
    this.images.length = 0;
  }

  async paste() {
    const clipboard = await Clipboard.read();
    this.form.patchValue({ title: clipboard.value });
  }
}
