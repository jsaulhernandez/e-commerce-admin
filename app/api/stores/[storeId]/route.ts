import { auth } from "@clerk/nextjs/server";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
//interfaces
import { IBillboard } from "@/data/interfaces/billboard.interface";
import { ICategory } from "@/data/interfaces/category.interface";
import { ICuisine } from "@/data/interfaces/cuisine.interface";
import { IKitchen } from "@/data/interfaces/kitchen.interface";
import { IOrder } from "@/data/interfaces/order.interface";
import { IProduct } from "@/data/interfaces/product.interface";
import { ISize } from "@/data/interfaces/size.interface";
import { IStore } from "@/data/interfaces/store.interface";
// utils
import {
  collectionReference,
  documentReference,
  getCollectionFirebase,
  getDataFirebase,
} from "@/lib/firebase-functions";
import cloudinary from "@/lib/cloudinary";
import { extractPublicIdFromUrl } from "@/lib/utils";

export const PATCH = async (
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

    const { name } = body;
    if (!name)
      throw new NextResponse("Store name is missing!", { status: 400 });

    const docRef = documentReference<IStore>("stores", storeId);
    await updateDoc(docRef, { name });
    const store = (await getDataFirebase(docRef)).data() as IStore;

    return NextResponse.json(store);
  } catch (error) {
    console.error(`[Error] STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId?: string } }
) => {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) throw new NextResponse("Un-Authorized", { status: 404 });

    if (!storeId)
      throw new NextResponse("Store ID is required", { status: 400 });

    const docRef = documentReference<IStore>("stores", storeId);

    // Billboards
    const billboardsQuerySnapshot = await getCollectionFirebase<IBillboard>(
      collectionReference("stores", storeId, "billboards")
    );

    billboardsQuerySnapshot.docs.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);

      const imageUrl = billboardDoc.data().imageUrl;

      const publicId = extractPublicIdFromUrl(imageUrl);
      if (publicId) await cloudinary.v2.uploader.destroy(publicId);
    });

    // Categories
    const categoriesQuerySnapshot = await getCollectionFirebase<ICategory>(
      collectionReference("stores", storeId, "categories")
    );

    categoriesQuerySnapshot.docs.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // Sizes
    const sizesQuerySnapshot = await getCollectionFirebase<ISize>(
      collectionReference("stores", storeId, "sizes")
    );

    sizesQuerySnapshot.docs.forEach(async (sizeDoc) => {
      await deleteDoc(sizeDoc.ref);
    });

    // Kitchens
    const kitchensQuerySnapshot = await getCollectionFirebase<IKitchen>(
      collectionReference("stores", storeId, "kitchens")
    );

    kitchensQuerySnapshot.docs.forEach(async (kitchenDoc) => {
      await deleteDoc(kitchenDoc.ref);
    });

    // Cuisines
    const cuisinesQuerySnapshot = await getCollectionFirebase<ICuisine>(
      collectionReference("stores", storeId, "categories")
    );

    cuisinesQuerySnapshot.docs.forEach(async (cuisineDoc) => {
      await deleteDoc(cuisineDoc.ref);
    });

    // Products and Images
    const productsQuerySnapshot = await getCollectionFirebase<IProduct>(
      collectionReference("stores", storeId, "products")
    );

    productsQuerySnapshot.docs.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);

      const images = productDoc.data().images;
      if (images && Array.isArray(images)) {
        const promisesDelete = images.map(async (i) => {
          const publicId = extractPublicIdFromUrl(i.url);
          if (publicId) await cloudinary.v2.uploader.destroy(publicId);
        });

        await Promise.all(promisesDelete);
      }
    });

    // Orders and its order items  and its images
    const ordersQuerySnapshot = await getCollectionFirebase<IOrder>(
      collectionReference("stores", storeId, "orders")
    );

    ordersQuerySnapshot.docs.forEach(async (orderDoc) => {
      await deleteDoc(orderDoc.ref);

      const orderItems = orderDoc.data().orderItems;
      if (orderItems && Array.isArray(orderItems)) {
        const promisesDelete = orderItems.map(async (o) => {
          const images = o.images;

          if (images && Array.isArray(images)) {
            const promisesDelete = images.map(async (i) => {
              const publicId = extractPublicIdFromUrl(i.url);

              if (publicId) await cloudinary.v2.uploader.destroy(publicId);
            });

            await Promise.all(promisesDelete);
          }
        });

        await Promise.all(promisesDelete);
      }
    });

    // finally deleting the store
    await deleteDoc(docRef);

    return NextResponse.json({
      msg: "Store and all of its sub-collections deleted",
    });
  } catch (error) {
    console.error(`[Error] STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
