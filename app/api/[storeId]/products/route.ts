import { auth } from "@clerk/nextjs/server";
import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
import { IProduct } from "@/data/interfaces/product.interface";
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

    const productData = {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      category,
      size,
      kitchen,
      cuisine,
      createdAt: serverTimestamp(),
    } as IProduct;

    const productRef = await addDoc(
      collectionReference("stores", storeId, "products"),
      productData
    );

    const id = productRef.id;

    await updateDoc(documentReference("stores", storeId, "products", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ...productData, id });
  } catch (error) {
    console.error(`[Error] PRODUCTS_POST: ${error}`);
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

    const products = await getCollectionFirebase<IProduct>(
      collectionReferenceByDoc(
        documentReference<IStore>("stores", storeId),
        "products"
      )
    );

    const data = products.docs.map((doc) => doc.data());

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Error] PRODUCTS_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
