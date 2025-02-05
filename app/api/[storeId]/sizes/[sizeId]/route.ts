import { auth } from "@clerk/nextjs/server";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
import { ISize } from "@/data/interfaces/size.interface";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, sizeId } = await params;

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

    const ref = documentReference<ISize>("stores", storeId, "sizes", sizeId);
    const snapshot = await getDataFirebase(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, {
        ...snapshot.data(),
        name,
        value,
        updatedAt: serverTimestamp(),
      });

      const dataUpdated = (await getDataFirebase(ref)).data();

      return NextResponse.json(dataUpdated);
    }

    return NextResponse.json("Size Not Found", { status: 404 });
  } catch (error) {
    console.error(`[Error] SIZE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params;

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

    const ref = documentReference<ISize>("stores", storeId, "sizes", sizeId);
    await deleteDoc(ref);

    return NextResponse.json({
      msg: "Size and all of its sub-collections deleted",
    });
  } catch (error) {
    console.error(`[Error] SIZE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
