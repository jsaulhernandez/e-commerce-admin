import { Timestamp } from "firebase/firestore";

export interface IKitchen {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IKitchenPlainText {
  id: string;
  name: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}
