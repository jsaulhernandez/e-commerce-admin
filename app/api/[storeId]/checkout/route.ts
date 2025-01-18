import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
// interfaces
import { IProductBase } from "@/data/interfaces/product.interface";
// utils
import {
  collectionReference,
  documentReference,
} from "@/lib/firebase-functions";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const { storeId } = await params;
  const { products, userId } = await req.json();

  const line_items = (products as IProductBase[]).map((i: IProductBase) => {
    return {
      quantity: i.qty,
      price_data: {
        currency: "usd",
        product_data: {
          name: i.name,
        },
        unit_amount: Math.round(i.price * 100),
      },
    };
  });

  const orderData = {
    isPaid: false,
    orderItems: products,
    userId,
    order_status: "Processing",
    createdAt: serverTimestamp(),
  };

  const orderRef = await addDoc(
    collectionReference("stores", storeId, "orders"),
    orderData
  );

  const id = orderRef.id;

  await updateDoc(documentReference("stores", storeId, "orders", id), {
    ...orderData,
    id,
    updatedAt: serverTimestamp(),
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "IN"],
    },
    phone_number_collection: { enabled: true },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: id,
      storeId: storeId,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};
