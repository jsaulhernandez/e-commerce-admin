import { Timestamp } from "firebase/firestore";
import { IProduct, IProductPlainText } from "./product.interface";

export interface IOrderBase {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  order_status: string;
  userId: string;
}

export interface IOrder extends IOrderBase {
  orderItems: IProduct[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IOrderPlainText extends IOrderBase {
  orderItems: IProductPlainText[];
  createdAt?: string;
  updatedAt?: string;
}
