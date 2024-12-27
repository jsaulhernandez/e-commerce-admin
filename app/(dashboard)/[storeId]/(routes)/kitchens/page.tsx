import { format } from "date-fns";
// components
import KitchenClient from "./_components/client";
// interfaces
import {
  IKitchen,
  IKitchenPlainText,
} from "@/data/interfaces/kitchen.interface";
// types
import { CategoriesPageProps } from "@/data/types";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

const SizesPage = async ({ params }: CategoriesPageProps) => {
  const { storeId } = await params;

  const kitchensData = await getCollectionFirebase<IKitchen>(
    collectionReferenceByDoc(documentReference("stores", storeId), "kitchens")
  );

  const dataFormatted: IKitchenPlainText[] = kitchensData.docs.map((c) => {
    const data = c.data();

    return {
      ...data,
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
        <KitchenClient data={dataFormatted} />
      </div>
    </div>
  );
};

export default SizesPage;
