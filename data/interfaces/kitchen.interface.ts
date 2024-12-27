import { Timestamp } from "firebase/firestore";

export interface IKitchenBase {
  id: string;
  name: string;
  value: string;
}

export interface IKitchen extends IKitchenBase {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IKitchenPlainText extends IKitchenBase {
  createdAt?: string;
  updatedAt?: string;
}
