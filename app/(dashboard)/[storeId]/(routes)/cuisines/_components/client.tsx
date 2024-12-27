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
import { ICuisinePlainText } from "@/data/interfaces/cuisine.interface";
// columns
import { columnsCuisines } from "./columns";

const CuisineClient = ({ data }: { data: ICuisinePlainText[] }) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cuisines (${data.length})`}
          description="Manage cuisines for you store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/cuisines/create`)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columnsCuisines} data={data} />

      <Heading title="API" description="API calls for cuisines" />
      <ApiList entityName="cuisines" entityNameId="cuisineId" />
    </>
  );
};

export default CuisineClient;
