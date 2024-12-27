import { auth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IBillboard } from "@/data/interfaces/billboard.interface";
import { IStore } from "@/data/interfaces/store.interface";
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

    const { label, imageUrl } = body;
    if (!label)
      throw new NextResponse("Billboard name is missing!", { status: 400 });
    if (!imageUrl)
      throw new NextResponse("Billboard image is missing!", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );
    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const billboardData = {
      label,
      imageUrl,
      createdAt: serverTimestamp(),
    } as IBillboard;

    const billboardRef = await addDoc(
      collectionReference("stores", storeId, "billboards"),
      billboardData
    );

    const id = billboardRef.id;

    await updateDoc(documentReference("stores", storeId, "billboards", id), {
      ...billboardData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...billboardData, id });
  } catch (error) {
    console.error(`[Error] BILLBOARD_POST: ${error}`);
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

    const billboards = await getCollectionFirebase<IBillboard>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "billboards"
      )
    );

    const data = billboards.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] BILLBOARD_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
