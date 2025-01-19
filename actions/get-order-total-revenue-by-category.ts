// interfaces
import { ICategory } from "@/data/interfaces/category.interface";
import { IGraphData } from "@/data/interfaces/graph-data.interface";
import { IOrder } from "@/data/interfaces/order.interface";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

export const getOrderTotalRevenueByCategory = async (storeId: string) => {
  const snapshotOrders = await getCollectionFirebase<IOrder>(
    collectionReferenceByDoc(documentReference("stores", storeId), "orders")
  );
  const ordersData = snapshotOrders.docs.map((s) => s.data());

  const snapshotCategories = await getCollectionFirebase<ICategory>(
    collectionReferenceByDoc(documentReference("stores", storeId), "categories")
  );
  const categoriesData = snapshotCategories.docs.map((s) => s.data());

  const categoryRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    for (const item of order.orderItems) {
      const category = item.category;

      if (category) {
        let revenueForItem = 0;

        if (item.qty !== undefined) {
          revenueForItem = item.price * item.qty;
        } else {
          revenueForItem = item.price;
        }

        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + revenueForItem;
      }
    }
  }

  for (const category of categoriesData) {
    categoryRevenue[category.name] = categoryRevenue[category.name] || 0;
  }

  const graphData: IGraphData[] = categoriesData.map((category) => ({
    name: category.name,
    total: categoryRevenue[category.name] || 0,
  }));

  return graphData;
};
