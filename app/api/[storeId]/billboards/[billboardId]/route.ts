import { IBillboard } from "@/data/interfaces/billboard.interface";
import { IStore } from "@/data/interfaces/store.interface";
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, billboardId } = await params;

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

    const ref = documentReference<IBillboard>(
      "stores",
      storeId,
      "billboards",
      billboardId
    );
    const snapshot = await getDataFirebase(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, {
        ...snapshot.data(),
        label,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

      const dataUpdated = (await getDataFirebase(ref)).data();

      return NextResponse.json(dataUpdated);
    }

    return NextResponse.json("Billboard Not Found", { status: 404 });
  } catch (error) {
    console.error(`[Error] BILLBOARD_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;

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

    const ref = documentReference<IBillboard>(
      "stores",
      storeId,
      "billboards",
      billboardId
    );
    await deleteDoc(ref);

    return NextResponse.json({
      msg: "Billboard and all of its sub-collections deleted",
    });
  } catch (error) {
    console.error(`[Error] BILLBOARD_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};