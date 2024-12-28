// components
import {
  ICategory,
  ICategoryPlainText,
} from "@/data/interfaces/category.interface";
import ProductForm from "./_components/product-form";
// interfaces
import {
  IProduct,
  IProductPlainText,
} from "@/data/interfaces/product.interface";
import {
  ICuisine,
  ICuisinePlainText,
} from "@/data/interfaces/cuisine.interface";
import {
  IKitchen,
  IKitchenPlainText,
} from "@/data/interfaces/kitchen.interface";
import { ISize, ISizePlainText } from "@/data/interfaces/size.interface";
// types
import { ProductPageProps } from "@/data/types";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
  getDataFirebase,
} from "@/lib/firebase-functions";
import { map, mapNotInclude } from "@/lib/utils";

const ProductPage = async ({ params }: ProductPageProps) => {
  const { storeId, productId } = await params;
  let initialData: IProductPlainText | undefined = undefined;

  const product = (
    await getDataFirebase<IProduct>(
      documentReference("stores", storeId, "products", productId)
    )
  ).data();

  const categories = await getCollectionFirebase<ICategory>(
    collectionReferenceByDoc(documentReference("stores", storeId), "categories")
  );

  const cuisines = await getCollectionFirebase<ICuisine>(
    collectionReferenceByDoc(documentReference("stores", storeId), "cuisines")
  );

  const kitchens = await getCollectionFirebase<IKitchen>(
    collectionReferenceByDoc(documentReference("stores", storeId), "kitchens")
  );

  const sizes = await getCollectionFirebase<ISize>(
    collectionReferenceByDoc(documentReference("stores", storeId), "sizes")
  );

  if (product) {
    initialData = mapNotInclude<IProduct, IProductPlainText>(product, [
      "createdAt",
      "updatedAt",
    ]);
  }

  const categoriesFormatted: ICategoryPlainText[] = categories.docs.map((b) =>
    map<ICategory, ICategoryPlainText>(b.data(), ["id", "name"])
  );

  const cuisinesFormatted: ICuisinePlainText[] = cuisines.docs.map((b) =>
    map<ICuisine, ICuisinePlainText>(b.data(), ["id", "name"])
  );

  const kitchensFormatted: IKitchenPlainText[] = kitchens.docs.map((b) =>
    map<IKitchen, IKitchenPlainText>(b.data(), ["id", "name"])
  );

  const sizesFormatted: ISizePlainText[] = sizes.docs.map((b) =>
    map<ISize, ISizePlainText>(b.data(), ["id", "name"])
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={initialData}
          categories={categoriesFormatted}
          cuisines={cuisinesFormatted}
          kitchens={kitchensFormatted}
          sizes={sizesFormatted}
        />
      </div>
    </div>
  );
};
export default ProductPage;
