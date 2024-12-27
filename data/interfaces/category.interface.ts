import { Timestamp } from "firebase/firestore";

export interface ICategoryBase {
  id: string;
  billboardId: string;
  billboardLabel: string;
  name: string;
}

export interface ICategory extends ICategoryBase {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ICategoryPlainText extends ICategoryBase {
  createdAt?: string;
  updatedAt?: string;
}
