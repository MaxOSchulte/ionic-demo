import { Inject, Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { PICTURE_STORE_TOKEN, PictureItem, PictureStore } from '../stores/picture-index-db.store';
import { Camera, CameraResultType } from '@capacitor/camera'


@Injectable({
    providedIn: 'root',
})
export class PictureService {
    constructor(
        private readonly toasts: ToastController,
        @Inject(PICTURE_STORE_TOKEN) private readonly pictures: PictureStore,
  ) {
  }

  async takePicture(): Promise<string> {
    // try to call getPhoto with dataUrl and return dataUrl
    try {
      return (await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      })).dataUrl;
    } catch (e) {
      // notify user on error
      const toast = await this.toasts.create({
        message: 'Could not take picture - ' + e.message,
        duration: 2000,
        color: 'warning',
        translucent: true,
      });
      await toast.present();
    }
  }


    async savePicture(path: string, offerId: number): Promise<number> {
        // call save on picture store service
        const pictureId = await this.pictures.savePicture({path, offerId});

        // try to persist storage
        try {
            let persistState = await navigator.storage.persisted();
            console.log('persist?', persistState);

            if (!persistState) {
                persistState =
                    (await navigator.permissions.query({name: 'persistent-storage'})).state === 'granted';
            }

            if (persistState) {
                navigator.storage.persist();
            }
        } catch (e) {
            console.warn(e);
        }

        // notify user for saved picture
        const toastConfig = {
            animated: true,
            duration: 3000,
            message: `Picture Saved`,
            color: 'dark',
        };

        // check browser for quota and warn in notification
        if (navigator.storage && navigator.storage.estimate) {
            const {quota, usage} = await navigator.storage.estimate();

            if (quota / usage < 2) {
                toastConfig.message += ' - Storage Usage Warning';
                toastConfig.color = 'warning';
            }
        }

        const quotaToast = await this.toasts.create(toastConfig);
        await quotaToast.present();

        return pictureId;
    }

    loadOfferPictures(offerid: number): Promise<PictureItem[]> {
        return this.pictures.getPictureForOffer(offerid);
    }

    convertToBase64(image: File): Promise<string> {
        if (!image) {
            return;
        }

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(image);
        return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }
}
