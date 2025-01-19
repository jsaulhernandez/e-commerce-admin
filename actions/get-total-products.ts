import { IProduct } from "@/data/interfaces/product.interface";
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

export const getTotalProducts = async (storeId: string) => {
  const snapshot = await getCollectionFirebase<IProduct>(
    collectionReferenceByDoc(documentReference("stores", storeId), "products")
  );

  return snapshot.size;
};
