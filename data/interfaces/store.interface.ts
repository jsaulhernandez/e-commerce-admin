import { Timestamp } from "firebase/firestore";

export interface IStoreBase {
  id: string;
  name: string;
  userId: string;
}

export interface IStore extends IStoreBase {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IStorePlainText extends IStoreBase {
  createdAt?: string;
  updatedAt?: string;
}
