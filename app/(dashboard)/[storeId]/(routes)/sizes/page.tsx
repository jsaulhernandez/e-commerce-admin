import { format } from "date-fns";
// components
import SizeClient from "./_components/client";
// interfaces
import { ISize, ISizePlainText } from "@/data/interfaces/size.interface";
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

  const sizesData = await getCollectionFirebase<ISize>(
    collectionReferenceByDoc(documentReference("stores", storeId), "sizes")
  );

  const dataFormatted: ISizePlainText[] = sizesData.docs.map((c) => {
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
        <SizeClient data={dataFormatted} />
      </div>
    </div>
  );
};

export default SizesPage;
