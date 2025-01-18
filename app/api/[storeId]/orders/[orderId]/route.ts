import { auth } from "@clerk/nextjs/server";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IOrder } from "@/data/interfaces/order.interface";
import { IStore } from "@/data/interfaces/store.interface";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, orderId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });
    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const { order_status } = body;

    if (!orderId)
      throw new NextResponse("Order ID is required", { status: 400 });
    if (!order_status)
      throw new NextResponse("Order Status is required", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );

    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const ref = documentReference<IOrder>("stores", storeId, "orders", orderId);
    const snapshot = await getDataFirebase(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, {
        ...snapshot.data(),
        order_status,
        updatedAt: serverTimestamp(),
      });

      const dataUpdated = (await getDataFirebase(ref)).data();

      return NextResponse.json(dataUpdated);
    }

    return NextResponse.json("Order Not Found", { status: 404 });
  } catch (error) {
    console.error(`[Error] ORDER_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const { storeId, orderId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });
    if (!orderId)
      throw new NextResponse("Order ID is required", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );

    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const ref = documentReference<IOrder>("stores", storeId, "orders", orderId);
    await deleteDoc(ref);

    return NextResponse.json({
      msg: "Order deleted",
    });
  } catch (error) {
    console.error(`[Error] ORDER_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
