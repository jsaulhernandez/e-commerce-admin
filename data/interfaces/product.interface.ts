import { Timestamp } from "firebase/firestore";

export interface IProductBase {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  isFeatured?: boolean;
  isArchived?: boolean;
  category: string;
  size?: string;
  kitchen?: string;
  cuisine?: string;
  qty: number;
}

export interface IProduct extends IProductBase {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IProductPlainText extends IProductBase {
  createdAt?: string;
  updatedAt?: string;
}
