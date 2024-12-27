import { Timestamp } from "firebase/firestore";

export interface ISizeBase {
  id: string;
  name: string;
  value: string;
}

export interface ISize extends ISizeBase {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ISizePlainText extends ISizeBase {
  createdAt?: string;
  updatedAt?: string;
}
