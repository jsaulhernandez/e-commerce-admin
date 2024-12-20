import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
// types
import { GenericLayoutProps } from "@/data/types";
// utils
import { collectionReference, getCollectionByQueryFirebase } from "@/lib/utils";

const SetupLayout = async ({ children }: GenericLayoutProps) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const storeSnap = await getCollectionByQueryFirebase<IStore>(
    collectionReference("stores"),
    { key: "userId", opStr: "==", value: userId }
  );

  let store: IStore = {} as IStore;

  if (!storeSnap.empty) {
    store = storeSnap.docs[storeSnap.docs.length - 1].data();
  }

  if (store.id) redirect(`/${store?.id}`);

  return <div>{children}</div>;
};

export default SetupLayout;
