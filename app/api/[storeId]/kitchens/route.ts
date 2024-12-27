import { auth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
import { IKitchen } from "@/data/interfaces/kitchen.interface";
// utils
import {
  collectionReference,
  collectionReferenceByDoc,
  documentReference,
  getCollectionFirebase,
  getDataFirebase,
} from "@/lib/firebase-functions";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const { name, value } = body;
    if (!name)
      throw new NextResponse("Kitchen name is missing!", { status: 400 });
    if (!value)
      throw new NextResponse("Kitchen value is missing!", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );
    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const kitchenData = {
      name,
      value,
      createdAt: serverTimestamp(),
    } as IKitchen;

    const kitchenRef = await addDoc(
      collectionReference("stores", storeId, "kitchens"),
      kitchenData
    );

    const id = kitchenRef.id;

    await updateDoc(documentReference("stores", storeId, "kitchens", id), {
      ...kitchenData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...kitchenData, id });
  } catch (error) {
    console.error(`[Error] KITCHENS_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse> => {
  try {
    const { storeId } = await params;

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const kitchens = await getCollectionFirebase<IKitchen>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "kitchens"
      )
    );

    const data = kitchens.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] KITCHENS_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
