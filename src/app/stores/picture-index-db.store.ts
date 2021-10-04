import { Injectable, InjectionToken } from '@angular/core';

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
export class PictureIndexDbStore {
  // declare property to reference a table with type and index

  constructor() {
    // Call super and auto open database
    // start database with version 1 and describe the table
    // reference the table
  }

  async savePicture(picture: PictureItem, id?: number): Promise<number> {
    // save a picture
    return -1;
  }

  async getPicture(id: number): Promise<PictureItem> {
    // return a picture
    return {} as PictureItem;
  }

  async getPictureForOffer(offerId: number): Promise<PictureItem[]> {
    // return this.pictures.filter(({ offerId: oid }) => oid === offerId).toArray();
    return [];
  }
}
