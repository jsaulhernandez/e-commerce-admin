import { Timestamp } from "firebase/firestore";

export interface ICuisine {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ICuisinePlainText {
  id: string;
  name: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}
