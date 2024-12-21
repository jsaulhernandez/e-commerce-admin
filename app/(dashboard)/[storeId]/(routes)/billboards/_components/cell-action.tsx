"use client";

import axios from "axios";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
// components
import AlertModal from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// interfaces
import { IBillboardPlainText } from "@/data/interfaces/billboard.interface";

const CellAction = ({ data }: { data: IBillboardPlainText }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard id copied to clipboard");
  };

  const onDelete = async () => {
    console.log("open", open);
    try {
      setLoading(true);
      const { imageUrl } = data;
      await axios
        .delete("/api/cloudinary", {
          data: { imageUrl },
        })
        .then(async () => {
          await axios.delete(`/api/stores/${storeId}/billboards/${data.id}`);
        });

      toast.success("Billboard Removed");
      router.refresh();
      router.push(`/${storeId}/billboards`);
    } catch (error) {
      console.error("[Error]", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/${storeId}/billboards/${data.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
