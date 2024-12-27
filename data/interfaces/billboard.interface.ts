import { Timestamp } from "firebase/firestore";

export interface IBillboardBase {
  id: string;
  label: string;
  imageUrl: string;
}

export interface IBillboard extends IBillboardBase {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IBillboardPlainText extends IBillboardBase {
  createdAt?: string;
  updatedAt?: string;
}
