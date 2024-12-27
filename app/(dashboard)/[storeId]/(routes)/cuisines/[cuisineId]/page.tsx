// components
import CuisineForm from "./_components/cuisine-form";
// interfaces
import {
  ICuisine,
  ICuisinePlainText,
} from "@/data/interfaces/cuisine.interface";
// types
import { CuisinePageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { map } from "@/lib/utils";

const CuisinePage = async ({ params }: CuisinePageProps) => {
  const { storeId, cuisineId } = await params;

  const cuisine = (
    await getDataFirebase<ICuisine>(
      documentReference("stores", storeId, "cuisines", cuisineId)
    )
  ).data();

  let initialData: ICuisinePlainText | undefined = undefined;

  if (cuisine) {
    initialData = map<ICuisine, ICuisinePlainText>(cuisine, [
      "id",
      "name",
      "value",
    ]);
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineForm initialData={initialData} />
      </div>
    </div>
  );
};
export default CuisinePage;
