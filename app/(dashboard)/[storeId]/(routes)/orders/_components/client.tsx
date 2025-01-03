"use client";

// components
import { DataTable } from "@/components/data-table";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
// interfaces
import { IOrderPlainText } from "@/data/interfaces/order.interface";
// columns
import { columnsOrders } from "./columns";

const OrderClient = ({ data }: { data: IOrderPlainText[] }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for you store"
        />
      </div>

      <Separator />
      <DataTable searchKey={"phone"} columns={columnsOrders} data={data} />

      <Heading title="API" description="API calls for orders" />
      <ApiList entityName="orders" entityNameId="orderId" />
    </>
  );
};

export default OrderClient;
