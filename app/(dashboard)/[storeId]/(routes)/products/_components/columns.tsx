"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
// components
import { Button } from "@/components/ui/button";
import CellAction from "./cell-action";
// interfaces
import { IProductPlainText } from "@/data/interfaces/product.interface";
// utils
import { formatter } from "@/lib/utils";

export const columnsProducts: ColumnDef<IProductPlainText>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return formatter.format(price);
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ getValue }) => {
      const isFeatured = getValue<boolean>();
      return isFeatured ? "T" : "F";
    },
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ getValue }) => {
      const isArchived = getValue<boolean>();
      return isArchived ? "T" : "F";
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ getValue }) => {
      const size = getValue<string>();
      return size ?? "N/A";
    },
  },
  {
    accessorKey: "kitchen",
    header: "Kitchen",
    cell: ({ getValue }) => {
      const kitchen = getValue<string>();
      return kitchen ?? "N/A";
    },
  },
  {
    accessorKey: "cuisine",
    header: "Cuisine",
    cell: ({ getValue }) => {
      const cuisine = getValue<string>();
      return cuisine ?? "N/A";
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
