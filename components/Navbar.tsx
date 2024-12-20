import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// components
import MainNav from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
//interfaces
import { IStore, IStorePlainText } from "@/data/interfaces/store.interface";
// utils
import { collectionReference, getCollectionByQueryFirebase } from "@/lib/utils";

const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const storesSnap = await getCollectionByQueryFirebase<IStore>(
    collectionReference("stores"),
    { key: "userId", opStr: "==", value: userId }
  );

  const stores: IStorePlainText[] =
    storesSnap.docs.map((d) => ({
      ...d.data(),
      createdAt: d.data().createdAt.toDate().toISOString(),
      updatedAt: d.data().updatedAt.toDate().toISOString(),
    })) ?? [];

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        {/* routes */}
        <MainNav />
        {/* user profile */}
        <div className="ml-auto">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
