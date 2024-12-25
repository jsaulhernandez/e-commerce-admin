import { Timestamp } from "firebase/firestore";

export interface ICategory {
  id: string;
  billboardId: string;
  billboardLabel: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ICategoryPlainText {
  id: string;
  billboardId: string;
  billboardLabel: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
