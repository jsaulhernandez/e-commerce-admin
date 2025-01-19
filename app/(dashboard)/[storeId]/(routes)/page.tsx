import { DollarSign } from "lucide-react";
// components
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import CardItem from "./_components/card-item";
import CardChart from "./_components/card-chart";
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
import { getGraphTotalRevenue } from "@/actions/get-graph-total-revenue";
import { getOrderPaymentStatusTotalRevenue } from "@/actions/get-order-payment-status-total-revenue";
import { getOrderTotalRevenueByCategory } from "@/actions/get-order-total-revenue-by-category";
import { getOrderStatusTotalRevenue } from "@/actions/get-order-status-total-revenue";

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
  const { storeId } = await params;
  const store = (
    await getDataFirebase<IStore>(documentReference("stores", storeId))
  ).data();

  const totalRevenue = await getTotalRevenue(store?.id ?? "");
  const totalRevenueFormatted = formatter.format(totalRevenue);

  const totalSale = await getTotalSales(store?.id ?? "");
  const totalProducts = await getTotalProducts(store?.id ?? "");
  const monthlyGraphRevenue = await getGraphTotalRevenue(store?.id ?? "");
  const orderStatusTotalRevenue = await getOrderPaymentStatusTotalRevenue(
    store?.id ?? ""
  );
  const revenueByCategory = await getOrderTotalRevenueByCategory(
    store?.id ?? ""
  );
  const revenueByOrderStatus = await getOrderStatusTotalRevenue(
    store?.id ?? ""
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        <div className="grid gap-4 grid-cols-4">
          {/* cards */}
          <CardItem
            title="Total Revenue"
            value={totalRevenueFormatted}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-2"
          />
          <CardItem
            title="Sales"
            value={`+ ${totalSale}`}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-1"
          />
          <CardItem
            title="Products"
            value={`+ ${totalProducts}`}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-1"
          />
          {/* charts */}
          <CardChart
            title="Revenue By Month"
            data={monthlyGraphRevenue}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-3"
          />
          <CardChart
            title="Revenue By Payment Status"
            data={orderStatusTotalRevenue}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-1"
          />
          <CardChart
            title="Revenue By Category"
            data={revenueByCategory}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-2"
          />
          <CardChart
            title="Revenue By Order Status"
            data={revenueByOrderStatus}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            className="col-span-2"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
