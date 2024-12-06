import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDocs, query, where } from "firebase/firestore";
// components
import MainNav from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
//interfaces
import { IStore, IStorePlainText } from "@/data/interfaces/store.interface";
// utils
import { dataPointCollection } from "@/lib/utils";

const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const storesSnap = await getDocs(
    query(dataPointCollection<IStore>("stores"), where("userId", "==", userId))
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
