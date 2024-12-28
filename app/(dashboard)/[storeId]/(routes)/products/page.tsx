import { format } from "date-fns";
// components
import ProductClient from "./_components/client";
// interfaces
import {
  IProduct,
  IProductPlainText,
} from "@/data/interfaces/product.interface";
// types
import { GenericPageProps } from "@/data/types";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

const ProductsPage = async ({ params }: GenericPageProps) => {
  const { storeId } = await params;

  const productsData = await getCollectionFirebase<IProduct>(
    collectionReferenceByDoc(documentReference("stores", storeId), "products")
  );

  const dataFormatted: IProductPlainText[] = productsData.docs.map((c) => {
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
        <ProductClient data={dataFormatted} />
      </div>
    </div>
  );
};

export default ProductsPage;
