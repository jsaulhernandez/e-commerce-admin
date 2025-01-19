// components
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
// types
import { DashboardOverviewProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
  const { storeId } = await params;
  const store = (
    await getDataFirebase<IStore>(documentReference("stores", storeId))
  ).data();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
      </div>
    </div>
  );
};

export default DashboardOverview;
