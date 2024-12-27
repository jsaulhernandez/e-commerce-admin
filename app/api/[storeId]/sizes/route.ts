import { auth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
import { ISize } from "@/data/interfaces/size.interface";
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
    if (!name) throw new NextResponse("Size name is missing!", { status: 400 });
    if (!value)
      throw new NextResponse("Size value is missing!", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );
    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const sizeData = {
      name,
      value,
      createdAt: serverTimestamp(),
    } as ISize;

    const sizeRef = await addDoc(
      collectionReference("stores", storeId, "sizes"),
      sizeData
    );

    const id = sizeRef.id;

    await updateDoc(documentReference("stores", storeId, "sizes", id), {
      ...sizeData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...sizeData, id });
  } catch (error) {
    console.error(`[Error] SIZES_POST: ${error}`);
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

    const sizes = await getCollectionFirebase<ISize>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "sizes"
      )
    );

    const data = sizes.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] SIZES_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
