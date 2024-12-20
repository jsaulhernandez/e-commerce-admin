import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// components
import SettingsForm from "./components/settings-form";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
// types
import { SettingsPageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const store = (
    await getDataFirebase<IStore>(documentReference("stores", storeId))
  ).data();

  if (!store) redirect("/");
  if (store.userId !== userId) redirect("/");

  const storeConverted = {
    ...store,
    createdAt: store.createdAt.toDate().toISOString(),
    updatedAt: store.updatedAt.toDate().toISOString(),
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 p-8 pt-6">
        <SettingsForm initialData={storeConverted} />
      </div>
    </div>
  );
};

export default SettingsPage;
