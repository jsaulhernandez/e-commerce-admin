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
import { IProductPlainText } from "@/data/interfaces/product.interface";
// columns
import { columnsProducts } from "./columns";

const ProductClient = ({ data }: { data: IProductPlainText[] }) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for you store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/products/create`)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columnsProducts} data={data} />

      <Heading title="API" description="API calls for products" />
      <ApiList entityName="products" entityNameId="productId" />
    </>
  );
};

export default ProductClient;
