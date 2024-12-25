// component
import CategoryForm from "./_components/category-form";
// types
import { CategoryPageProps } from "@/data/types";
import {
  IBillboard,
  IBillboardPlainText,
} from "@/data/interfaces/billboard.interface";
import {
  ICategory,
  ICategoryPlainText,
} from "@/data/interfaces/category.interface";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
  getDataFirebase,
} from "@/lib/firebase-functions";
import { map } from "@/lib/utils";

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { storeId, categoryId } = await params;

  const category = (
    await getDataFirebase<ICategory>(
      documentReference("stores", storeId, "categories", categoryId)
    )
  ).data();

  const billboards = await getCollectionFirebase<IBillboard>(
    collectionReferenceByDoc(documentReference("stores", storeId), "billboards")
  );

  let initialData: ICategoryPlainText | undefined = undefined;

  if (category) {
    initialData = map<ICategory, ICategoryPlainText>(category, [
      "billboardId",
      "billboardLabel",
      "id",
      "name",
    ]);
  }

  const billboardsFormatted: IBillboardPlainText[] = billboards.docs.map((b) =>
    map<IBillboard, IBillboardPlainText>(b.data(), ["id", "label"])
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          initialData={initialData}
          billboards={billboardsFormatted}
        />
      </div>
    </div>
  );
};
export default CategoryPage;
