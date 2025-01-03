import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// components
import Navbar from "@/components/Navbar";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
// types
import { DashboardLayoutProps } from "@/data/types";
// utils
import {
  collectionReference,
  getCollectionByQueryFirebase,
} from "@/lib/firebase-functions";

const DashboardLayout = async ({ params, children }: DashboardLayoutProps) => {
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const storeSnap = await getCollectionByQueryFirebase<IStore>(
    collectionReference("stores"),
    { key: "userId", opStr: "==", value: userId },
    { key: "id", opStr: "==", value: storeId }
  );

  let store: IStore = {} as IStore;
  if (!storeSnap.empty) {
    store = storeSnap.docs[storeSnap.docs.length - 1].data();
  }

  if (!store.id) redirect("/");

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <div className="container p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
