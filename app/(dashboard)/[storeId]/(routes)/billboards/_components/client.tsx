"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
// components
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
// columns
import { columnsBillboard } from "./columns";
// interfaces
import { IBillboardPlainText } from "@/data/interfaces/billboard.interface";
import ApiList from "@/components/api-list";

const BillBoardClient = ({ data }: { data: IBillboardPlainText[] }) => {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for you store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/create`)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"label"} columns={columnsBillboard} data={data} />
      <ApiList entityName="billboards" entityNameId="billboardId" />
    </>
  );
};

export default BillBoardClient;
