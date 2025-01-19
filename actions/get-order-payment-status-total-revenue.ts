// interfaces
import { IGraphData } from "@/data/interfaces/graph-data.interface";
import { IOrder } from "@/data/interfaces/order.interface";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

export const getOrderPaymentStatusTotalRevenue = async (storeId: string) => {
  const snapshot = await getCollectionFirebase<IOrder>(
    collectionReferenceByDoc(documentReference("stores", storeId), "orders")
  );

  const ordersData = snapshot.docs.map((s) => s.data());
  const statusRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    const status = order.isPaid ? "Paid" : "Not Paid";

    if (status) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        if (item.qty !== undefined) {
          revenueForOrder += item.price * item.qty;
        } else {
          revenueForOrder += item.price;
        }
      }

      statusRevenue[status] = (statusRevenue[status] || 0) + revenueForOrder;
    }
  }

  const statusMap: { [key: string]: number } = {
    Paid: 0,
    "Not Paid": 1,
  };

  const graphData: IGraphData[] = Object.keys(statusMap).map((statusName) => ({
    name: statusName,
    total: statusRevenue[statusName] || 0,
  }));

  return graphData;
};
