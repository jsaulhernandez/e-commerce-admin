// components
import KitchenForm from "./_components/kitchen-form";
// interfaces
import {
  IKitchen,
  IKitchenPlainText,
} from "@/data/interfaces/kitchen.interface";
// types
import { KitchenPageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { map } from "@/lib/utils";

const KitchenPage = async ({ params }: KitchenPageProps) => {
  const { storeId, kitchenId } = await params;

  const kitchen = (
    await getDataFirebase<IKitchen>(
      documentReference("stores", storeId, "kitchens", kitchenId)
    )
  ).data();

  let initialData: IKitchenPlainText | undefined = undefined;

  if (kitchen) {
    initialData = map<IKitchen, IKitchenPlainText>(kitchen, [
      "id",
      "name",
      "value",
    ]);
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenForm initialData={initialData} />
      </div>
    </div>
  );
};
export default KitchenPage;
