import { Timestamp } from "firebase/firestore";

export interface ICuisineBase {
  id: string;
  name: string;
  value: string;
}

export interface ICuisine extends ICuisineBase {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ICuisinePlainText extends ICuisineBase {
  createdAt?: string;
  updatedAt?: string;
}
