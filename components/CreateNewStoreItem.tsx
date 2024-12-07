"use client";

// types
import { CreateNewStoreItemProps } from "@/data/types";
import { PlusCircle } from "lucide-react";

const CreateNewStoreItem = ({ onClick }: CreateNewStoreItemProps) => {
  return (
    <div
      className="flex items-center bg-gray-50 px-2 py-1 cursor-pointer text-muted-foreground hover:text-primary"
      onClick={onClick}
    >
      <PlusCircle className="mr-2 w-5 h-5" />
      Create Store
    </div>
  );
};

export default CreateNewStoreItem;
