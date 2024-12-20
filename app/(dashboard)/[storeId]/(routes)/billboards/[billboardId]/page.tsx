import { format } from "date-fns/format";
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

const BillBoardPage = async ({ params }: BillBoardPageProps) => {
  const { storeId, billboardId } = await params;

  const billboard = (
    await getDataFirebase<IBillboard>(
      documentReference("stores", storeId, "billboards", billboardId)
    )
  ).data();

  let initialData: IBillboardPlainText | undefined = undefined;

  if (billboard) {
    initialData = {
      ...billboard!,
      createdAt: billboard!.createdAt
        ? format(billboard!.createdAt.toDate(), "MMMM do, yyyy")
        : "",
      updatedAt: billboard!.updatedAt
        ? format(billboard!.updatedAt.toDate(), "MMMM do, yyyy")
        : "",
    };
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
