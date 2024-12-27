import { auth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
import { ICuisine } from "@/data/interfaces/cuisine.interface";
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
      throw new NextResponse("Cuisine name is missing!", { status: 400 });
    if (!value)
      throw new NextResponse("Cuisine value is missing!", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );
    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const cuisineData = {
      name,
      value,
      createdAt: serverTimestamp(),
    } as ICuisine;

    const cuisineRef = await addDoc(
      collectionReference("stores", storeId, "cuisines"),
      cuisineData
    );

    const id = cuisineRef.id;

    await updateDoc(documentReference("stores", storeId, "cuisines", id), {
      ...cuisineData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...cuisineData, id });
  } catch (error) {
    console.error(`[Error] CUISINES_POST: ${error}`);
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

    const cuisines = await getCollectionFirebase<ICuisine>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "cuisines"
      )
    );

    const data = cuisines.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] CUISINES_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
