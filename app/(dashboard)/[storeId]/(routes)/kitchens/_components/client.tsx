"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
// components
import { DataTable } from "@/components/data-table";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
// interfaces
import { IKitchenPlainText } from "@/data/interfaces/kitchen.interface";
// columns
import { columnsKitchens } from "./columns";

const KitchenClient = ({ data }: { data: IKitchenPlainText[] }) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Kitchens (${data.length})`}
          description="Manage kitchens for you store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/kitchens/create`)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columnsKitchens} data={data} />

      <Heading title="API" description="API calls for kitchens" />
      <ApiList entityName="kitchens" entityNameId="kitchenId" />
    </>
  );
};

export default KitchenClient;
