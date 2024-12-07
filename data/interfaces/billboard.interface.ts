import { Timestamp } from "firebase/firestore";

export interface IBillboards {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IBillboardsPlainText {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
