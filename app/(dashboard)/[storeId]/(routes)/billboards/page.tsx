import { format } from "date-fns";
// components
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";
import BillBoardClient from "./_components/client";
// types
import { BillBoardsPageProps } from "@/data/types";
import {
  IBillboard,
  IBillboardPlainText,
} from "@/data/interfaces/billboard.interface";

const BillboardsPage = async ({ params }: BillBoardsPageProps) => {
  const { storeId } = await params;

  const billboardsData = await getCollectionFirebase<IBillboard>(
    collectionReferenceByDoc(documentReference("stores", storeId), "billboards")
  );

  const dataList: IBillboardPlainText[] = billboardsData.docs.map((b) => {
    const data = b.data();

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
        <BillBoardClient data={dataList} />
      </div>
    </div>
  );
};

export default BillboardsPage;
