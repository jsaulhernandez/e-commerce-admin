import { auth } from "@clerk/nextjs/server";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { ICategory } from "@/data/interfaces/category.interface";
import { IStore } from "@/data/interfaces/store.interface";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, categoryId } = await params;

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

    const ref = documentReference<ICategory>(
      "stores",
      storeId,
      "categories",
      categoryId
    );
    const snapshot = await getDataFirebase(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, {
        ...snapshot.data(),
        name,
        billboardId,
        billboardLabel,
        updatedAt: serverTimestamp(),
      });

      const dataUpdated = (await getDataFirebase(ref)).data();

      return NextResponse.json(dataUpdated);
    }

    return NextResponse.json("Category Not Found", { status: 404 });
  } catch (error) {
    console.error(`[Error] CATEGORY_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );

    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const ref = documentReference<ICategory>(
      "stores",
      storeId,
      "categories",
      categoryId
    );
    await deleteDoc(ref);

    return NextResponse.json({
      msg: "Category and all of its sub-collections deleted",
    });
  } catch (error) {
    console.error(`[Error] CATEGORY_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
