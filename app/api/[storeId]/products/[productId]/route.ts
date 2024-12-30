import { auth } from "@clerk/nextjs/server";
import { deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
import { IProduct } from "@/data/interfaces/product.interface";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, productId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      category,
      size,
      kitchen,
      cuisine,
    } = body;

    if (!name)
      throw new NextResponse("Product name is missing!", { status: 400 });
    if (!price)
      throw new NextResponse("Product price is missing!", { status: 400 });
    if (!images || !images.length)
      throw new NextResponse("Product images are missing!", { status: 400 });
    if (!category)
      throw new NextResponse("Product category is missing!", { status: 400 });

    const store = await getDataFirebase<IStore>(
      documentReference("stores", storeId)
    );

    if (store.exists()) {
      const storeData = store.data() as IStore;

      if (storeData.userId !== userId) {
        throw new NextResponse("Un-Authorized Access", { status: 500 });
      }
    }

    const ref = documentReference<IProduct>(
      "stores",
      storeId,
      "products",
      productId
    );
    const snapshot = await getDataFirebase(ref);

    if (snapshot.exists()) {
      await updateDoc(ref, {
        ...snapshot.data(),
        name,
        price,
        images,
        isFeatured,
        isArchived,
        category,
        size,
        kitchen,
        cuisine,
        updatedAt: serverTimestamp(),
      });

      const dataUpdated = (await getDataFirebase(ref)).data();

      return NextResponse.json(dataUpdated);
    }

    return NextResponse.json("Product Not Found", { status: 404 });
  } catch (error) {
    console.error(`[Error] PRODUCTS_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
): Promise<NextResponse> => {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;

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

    const ref = documentReference<IProduct>(
      "stores",
      storeId,
      "products",
      productId
    );

    const productData = await getDataFirebase(ref);
    if (!productData.exists())
      return new NextResponse("Product not found", { status: 404 });

    await deleteDoc(ref);

    return NextResponse.json({
      msg: "Product and associated images delete successfully",
    });
  } catch (error) {
    console.error(`[Error] PRODUCTS_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
): Promise<NextResponse> => {
  try {
    const { storeId, productId } = await params;

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    if (!productId)
      throw new NextResponse("Product ID is required", { status: 400 });

    const product = await getDataFirebase<IProduct>(
      documentReference("stores", storeId, "products", productId)
    );

    return NextResponse.json(product.data());
  } catch (error) {
    console.error(`[Error] PRODUCTS_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
