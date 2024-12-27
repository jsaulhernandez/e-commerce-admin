import { format } from "date-fns";
// components
import CuisineClient from "./_components/client";
// interfaces
import {
  ICuisine,
  ICuisinePlainText,
} from "@/data/interfaces/cuisine.interface";
// types
import { GenericPageProps } from "@/data/types";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

const CuisinesPage = async ({ params }: GenericPageProps) => {
  const { storeId } = await params;

  const cuisinesData = await getCollectionFirebase<ICuisine>(
    collectionReferenceByDoc(documentReference("stores", storeId), "cuisines")
  );

  const dataFormatted: ICuisinePlainText[] = cuisinesData.docs.map((c) => {
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
        <CuisineClient data={dataFormatted} />
      </div>
    </div>
  );
};

export default CuisinesPage;
