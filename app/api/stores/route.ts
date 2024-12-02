import { IStore } from "@/data/interfaces/store.interface";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    const body = await req.json();
    const { name } = body;
    if (!name)
      throw new NextResponse("Store name is missing!", { status: 400 });

    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    } as IStore;

    const storeRef = await addDoc(collection(db, "stores"), storeData);
    const id = storeRef.id;

    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...storeData, id });
  } catch (error) {
    console.error(`[Error] STORE_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
