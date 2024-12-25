import { Timestamp } from "firebase/firestore";

export interface ISize {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ISizePlainText {
  id: string;
  name: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}
