import { IStore } from "@/data/interfaces/store.interface";
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const { name } = body;
    if (!name)
      throw new NextResponse("Store name is missing!", { status: 400 });

    const docRef = documentReference<IStore>("stores", storeId);
    await updateDoc(docRef, { name });
    const store = (await getDataFirebase(docRef)).data() as IStore;

    return NextResponse.json(store);
  } catch (error) {
    console.error(`[Error] STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId?: string } }
) => {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const docRef = documentReference<IStore>("stores", storeId);
    // TODO: delete all sub-collections and long with those data file urls
    await deleteDoc(docRef);

    return NextResponse.json({
      msg: "Store and all of its sub-collections deleted",
    });
  } catch (error) {
    console.error(`[Error] STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
