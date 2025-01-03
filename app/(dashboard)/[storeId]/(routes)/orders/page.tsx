import { format } from "date-fns";
// components
import OrderClient from "./_components/client";
// interfaces
import { IOrder, IOrderPlainText } from "@/data/interfaces/order.interface";
import { IProductPlainText } from "@/data/interfaces/product.interface";
// types
import { GenericPageProps } from "@/data/types";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

const OrdersPage = async ({ params }: GenericPageProps) => {
  const { storeId } = await params;

  const ordersData = await getCollectionFirebase<IOrder>(
    collectionReferenceByDoc(documentReference("stores", storeId), "orders")
  );

  const dataFormatted: IOrderPlainText[] = ordersData.docs.map((o) => {
    const data = o.data();
    const orderItems: IProductPlainText[] = data.orderItems.map((p) => {
      return {
        ...p,
        createdAt: p.createdAt
          ? format(p.createdAt.toDate(), "MMMM do, yyyy")
          : "",
        updatedAt: p.updatedAt
          ? format(p.updatedAt.toDate(), "MMMM do, yyyy")
          : "",
      };
    });

    const totalPrice: number = data.orderItems.reduce((total, item) => {
      if (item && item.qty !== undefined)
        return total + Number(item.price * item.qty);

      return total;
    }, 0);

    const products: string = data.orderItems.map((p) => p.name).join(", ");
    const images: string[] = data.orderItems.map((p) => p.images[0].url);

    return {
      ...data,
      orderItems,
      totalPrice,
      products,
      images,
      createdAt: data.createdAt
        ? format(data.createdAt.toDate(), "MMMM do, yyyy")
        : "",
      updatedAt: data.updatedAt
        ? format(data.updatedAt.toDate(), "MMMM do, yyyy")
        : "",
    };
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <OrderClient data={dataFormatted} />
      </div>
    </div>
  );
};

export default OrdersPage;
