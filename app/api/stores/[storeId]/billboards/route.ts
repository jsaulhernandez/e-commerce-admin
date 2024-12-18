import { IBillboard } from "@/data/interfaces/billboard.interface";
import { IStore } from "@/data/interfaces/store.interface";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
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

    const { label, imageUrl } = body;
    if (!label)
      throw new NextResponse("Billboard name is missing!", { status: 400 });
    if (!imageUrl)
      throw new NextResponse("Billboard image is missing!", { status: 400 });

    const store = await getDoc(doc(db, "stores", storeId));
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
      collection(db, "stores", storeId, "billboards"),
      billboardData
    );

    const id = billboardRef.id;

    await updateDoc(doc(db, "stores", storeId, "billboards", id), {
      ...billboardData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...billboardData, id });
  } catch (error) {
    console.error(`[Error] STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
