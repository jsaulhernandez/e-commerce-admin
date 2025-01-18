import { NextResponse } from "next/server";
// interfaces
import { IOrder } from "@/data/interfaces/order.interface";
import { IStore } from "@/data/interfaces/store.interface";
// utils
import {
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
} from "@/lib/firebase-functions";

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse> => {
  try {
    const { storeId } = await params;

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const sizes = await getCollectionFirebase<IOrder>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "orders"
      )
    );

    const data = sizes.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] ORDERS_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
