import { DollarSign } from "lucide-react";
// components
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import CardItem from "./_components/card-item";
// interfaces
import { IStore } from "@/data/interfaces/store.interface";
// types
import { DashboardOverviewProps } from "@/data/types";
// utils
import { documentReference, getDataFirebase } from "@/lib/firebase-functions";
import { formatter } from "@/lib/utils";
// actions
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { getTotalProducts } from "@/actions/get-total-products";

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
  const { storeId } = await params;
  const store = (
    await getDataFirebase<IStore>(documentReference("stores", storeId))
  ).data();

  const totalRevenue = await getTotalRevenue(store?.id ?? "");
  const totalRevenueFormatted = formatter.format(totalRevenue);

  const totalSale = await getTotalSales(store?.id ?? "");
  const totalProducts = await getTotalProducts(store?.id ?? "");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        <div className="grid gap-4 grid-cols-4">
          <CardItem
            title="Total Revenue"
            value={totalRevenueFormatted}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
          />
          <CardItem
            title="Sales"
            value={`+ ${totalSale}`}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
          />
          <CardItem
            title="Products"
            value={`+ ${totalProducts}`}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
