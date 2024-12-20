import { Timestamp } from "firebase/firestore";

export interface IBillboard {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IBillboardPlainText {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
