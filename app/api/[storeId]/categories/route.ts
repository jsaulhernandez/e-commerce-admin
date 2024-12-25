import { auth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IBillboard } from "@/data/interfaces/billboard.interface";
import { ICategory } from "@/data/interfaces/category.interface";
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

    const { name, billboardId, billboardLabel } = body;
    if (!name)
      throw new NextResponse("Category name is missing!", { status: 400 });
    if (!billboardId)
      throw new NextResponse("Billboard is missing!", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );
    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const categoryData = {
      name,
      billboardId,
      billboardLabel,
      createdAt: serverTimestamp(),
    } as ICategory;

    const categoryRef = await addDoc(
      collectionReference("stores", storeId, "categories"),
      categoryData
    );

    const id = categoryRef.id;

    await updateDoc(documentReference("stores", storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...categoryData, id });
  } catch (error) {
    console.error(`[Error] CATEGORIES_POST: ${error}`);
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

    const categories = await getCollectionFirebase<IBillboard>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "categories"
      )
    );

    const data = categories.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] CATEGORIES_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
