import { Timestamp } from "firebase/firestore";

export interface IStore {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IStorePlainText {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
