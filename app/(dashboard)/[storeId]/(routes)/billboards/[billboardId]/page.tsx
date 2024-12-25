// components
import BillboardForm from "./_components/billboard-form";
// interfaces
import {
  IBillboard,
  IBillboardPlainText,
} from "@/data/interfaces/billboard.interface";
// types
import { BillBoardPageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { map } from "@/lib/utils";

const BillBoardPage = async ({ params }: BillBoardPageProps) => {
  const { storeId, billboardId } = await params;

  const billboard = (
    await getDataFirebase<IBillboard>(
      documentReference("stores", storeId, "billboards", billboardId)
    )
  ).data();

  let initialData: IBillboardPlainText | undefined = undefined;

  if (billboard) {
    initialData = map<IBillboard, IBillboardPlainText>(billboard, [
      "id",
      "label",
      "imageUrl",
    ]);
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={initialData} />
      </div>
    </div>
  );
};

export default BillBoardPage;
