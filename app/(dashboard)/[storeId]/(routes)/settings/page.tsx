import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// components
import SettingsForm from "./_components/settings-form";
// interfaces
import { IStore, IStorePlainText } from "@/data/interfaces/store.interface";
// types
import { GenericPageProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { map } from "@/lib/utils";

const SettingsPage = async ({ params }: GenericPageProps) => {
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const store = (
    await getDataFirebase<IStore>(documentReference("stores", storeId))
  ).data();

  if (!store) redirect("/");
  if (store.userId !== userId) redirect("/");

  const storeConverted: IStorePlainText = map<IStore, IStorePlainText>(store, [
    "id",
    "name",
    "userId",
  ]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 p-8">
        <SettingsForm initialData={storeConverted} />
      </div>
    </div>
  );
};

export default SettingsPage;
