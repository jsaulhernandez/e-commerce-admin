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
import { ISizePlainText } from "@/data/interfaces/size.interface";
// columns
import { columnsSizes } from "./columns";

const SizeClient = ({ data }: { data: ISizePlainText[] }) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for you store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/sizes/create`)}>
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columnsSizes} data={data} />

      <Heading title="API" description="API calls for sizes" />
      <ApiList entityName="sizes" entityNameId="sizeId" />
    </>
  );
};

export default SizeClient;
