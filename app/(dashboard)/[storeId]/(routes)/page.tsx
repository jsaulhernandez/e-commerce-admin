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

  return <div>DashboardOverview {store?.name}</div>;
};

export default DashboardOverview;
