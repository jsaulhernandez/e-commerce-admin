// components
import BillboardForm from "./_components/billboard-form";
// interfaces
import { IBillboard } from "@/data/interfaces/billboard.interface";
// types
import { BillBoardPageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/utils";

const BillBoardPage = async ({ params }: BillBoardPageProps) => {
  const { storeId, billboardId } = await params;

  const billboard = (
    await getDataFirebase<IBillboard>(
      documentReference("stores", storeId, "billboards", billboardId)
    )
  ).data();

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillBoardPage;
