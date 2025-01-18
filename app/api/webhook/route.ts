import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { serverTimestamp, updateDoc } from "firebase/firestore";
// utils
import { documentReference } from "@/lib/firebase-functions";
import { stripe } from "@/lib/stripe";

export const POST = async (req: Request) => {
  const body = await req.json();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse(`WEBHOOK error: ${(error as Error)?.message}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addressString = addressComponents.filter((a) => a !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    console.log("Order Id: ", session?.metadata?.orderId);

    if (session?.metadata?.orderId) {
      const ref = documentReference(
        "stores",
        session?.metadata?.storeId,
        "orders",
        session?.metadata?.orderId
      );

      await updateDoc(ref, {
        isPaid: true,
        address,
        addressString,
        Phone: session.customer_details?.phone,
        updatedAt: serverTimestamp(),
      });
    }
  }

  return new NextResponse(null, { status: 200 });
};
