"use client";

import { Check, StoreIcon } from "lucide-react";
// types
import { StoreListItemProps } from "@/data/types";
// utils
import { cn } from "@/lib/utils";

const StoreListItem = ({
  isChecked = false,
  onSelect,
  store,
}: StoreListItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center px-2 cursor-pointer hover:bg-gray-50 text-muted-foreground hover:text-primary py-2",
        isChecked ? "pointer-events-none" : ""
      )}
      onClick={() => onSelect(store)}
    >
      <StoreIcon className="mr-2 h-4 w-4" />
      <p className="w-full truncate text-sm whitespace-nowrap">{store.label}</p>
      <Check
        className={cn(
          "ml-auto w-4 h-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default StoreListItem;
