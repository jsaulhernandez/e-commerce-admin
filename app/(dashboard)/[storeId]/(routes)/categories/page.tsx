import { format } from "date-fns";
// components
import CategoryClient from "./_components/client";
// interfaces
import {
  ICategory,
  ICategoryPlainText,
} from "@/data/interfaces/category.interface";
// types
import { CategoriesPageProps } from "@/data/types";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { storeId } = await params;

  const categoriesData = await getCollectionFirebase<ICategory>(
    collectionReferenceByDoc(documentReference("stores", storeId), "categories")
  );

  const dataList: ICategoryPlainText[] = categoriesData.docs.map((c) => {
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
        <CategoryClient data={dataList} />
      </div>
    </div>
  );
};

export default CategoriesPage;
