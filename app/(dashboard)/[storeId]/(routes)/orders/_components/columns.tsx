"use client";

import { ColumnDef } from "@tanstack/react-table";
// components
import CellAction from "./cell-action";
import CellImage from "./cell-image";
// interfaces
import { IOrderPlainText } from "@/data/interfaces/order.interface";
// utils
import { cn, formatter } from "@/lib/utils";

export const columnsOrders: ColumnDef<IOrderPlainText>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => (
      <div className="grid grid-cols-2 gap-2">
        <CellImage images={row.original.images} />
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Amount",
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return formatter.format(price);
    },
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ getValue }) => {
      const isPaid = getValue<boolean>();

      return (
        <p
          className={cn(
            "text-lg font-semibold",
            isPaid ? "text-emerald-500" : "text-red-500"
          )}
        >
          {isPaid ? "Paid" : "Not Paid"}
        </p>
      );
    },
  },
  {
    accessorKey: "order_status",
    header: "OrderStatus",
    cell: ({ getValue }) => {
      const orderStatus = getValue<string>();

      return (
        <p
          className={cn(
            "text-lg font-semibold",
            (orderStatus === "Delivering" && "text-yellow-500") ||
              (orderStatus === "Processing" && "text-orange-500") ||
              (orderStatus === "Delivered" && "text-emerald-500") ||
              (orderStatus === "Canceled" && "text-red-500")
          )}
        >
          {orderStatus}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
