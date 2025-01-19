import { IOrder } from "@/data/interfaces/order.interface";
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

export const getTotalRevenue = async (storeId: string) => {
  const snapshot = await getCollectionFirebase<IOrder>(
    collectionReferenceByDoc(documentReference("stores", storeId), "orders")
  );

  const ordersData = snapshot.docs.map((s) => s.data());
  const paidOrders = ordersData.filter((o) => o.isPaid);

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((sum, product) => {
      if (product.qty !== undefined) return sum + product.price * product.qty;

      return sum + product.price;
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
