import { Timestamp } from "firebase/firestore";

export interface IStore {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
