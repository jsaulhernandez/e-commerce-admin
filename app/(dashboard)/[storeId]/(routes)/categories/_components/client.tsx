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
import { ICategoryPlainText } from "@/data/interfaces/category.interface";
// columns
import { columnsCategories } from "./columns";

const CategoryClient = ({ data }: { data: ICategoryPlainText[] }) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for you store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/categories/create`)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columnsCategories} data={data} />

      <Heading title="API" description="API calls for categories" />
      <ApiList entityName="categories" entityNameId="categoryId" />
    </>
  );
};

export default CategoryClient;
