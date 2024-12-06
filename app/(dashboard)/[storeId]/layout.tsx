import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDocs, query, where } from "firebase/firestore";
// components
import Navbar from "@/components/Navbar";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
// types
import { DashboardLayoutProps } from "@/data/types";
// utils
import { dataPointCollection } from "@/lib/utils";
const DashboardLayout = async ({ params, children }: DashboardLayoutProps) => {
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const storeSnap = await getDocs(
    query(
      dataPointCollection<IStore>("stores"),
      where("userId", "==", userId),
      where("id", "==", storeId)
    )
  );

  let store: IStore = {} as IStore;
  if (!storeSnap.empty) {
    store = storeSnap.docs[storeSnap.docs.length - 1].data();
  }

  if (!store.id) redirect("/");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
