import { Injectable, InjectionToken } from '@angular/core';
import Dexie from 'dexie';

export const PICTURE_STORE_TOKEN = new InjectionToken<PictureStore>('Picture Store');

export interface PictureStore {
  getPicture(id: number): Promise<PictureItem>;

  savePicture(picture: PictureItem, id?: number): Promise<number>;

  getPictureForOffer(offerId: number): Promise<PictureItem[]>;
}

export interface PictureItem {
  path: string;
  offerId: number;
  id?: number;
}

//Extend Dexie and implement Interface
@Injectable()
export class PictureIndexDbStore extends Dexie implements PictureStore {
  // declare property to reference a table with type and index
  pictures: Dexie.Table<PictureItem, number>;

  constructor() {
    // Call super and auto open database
    super('ImmoPictureDexie', { autoOpen: true });
    // start database with version 1 and describe the table
    this.version(1).stores({
      pictures: '++id, offerId',
    })
    // reference the table
    this.pictures = this.table('pictures');
  }

  async savePicture(picture: PictureItem): Promise<number> {
    // save a picture
    if (picture.id && picture.id > 0) {
      return this.pictures.put(picture, picture.id);
    }
    return this.pictures.add(picture)
  }

  async getPicture(id: number): Promise<PictureItem> {
    // return a picture
    return this.pictures.get(id)
  }

  async getPictureForOffer(offerId: number): Promise<PictureItem[]> {
    return this.pictures.filter(({ offerId: oid }) => oid === offerId).toArray();
  }
}
