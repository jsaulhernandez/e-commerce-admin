// interfaces
import { IOrder } from "@/data/interfaces/order.interface";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

export const getTotalSales = async (storeId: string) => {
  const snapshot = await getCollectionFirebase<IOrder>(
    collectionReferenceByDoc(documentReference("stores", storeId), "orders")
  );

  return snapshot.size;
};
