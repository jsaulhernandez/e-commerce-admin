"use client";

import axios from "axios";
import { Copy, Edit, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
// components
import AlertModal from "@/components/modal/alert-modal";
import CustomDropdownActions from "@/components/custom-dropdown-actions";
// interfaces
import { IDropdownItem } from "@/data/interfaces/dropdown.interface";
import { ISizePlainText } from "@/data/interfaces/size.interface";

const CellAction = ({ data }: { data: ISizePlainText }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const dropdownItems: IDropdownItem[] = [
    {
      label: "Copy ID",
      icon: <Copy className="h-4 w-4 mr-2" />,
      onClick: () => onCopy(data.id),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4 mr-2" />,
      onClick: () => router.push(`/${storeId}/sizes/${data.id}`),
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4 mr-2" />,
      onClick: () => setOpen(true),
    },
  ];

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Size id copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/sizes/${data.id}`);

      toast.success("Size Removed");
      router.refresh();
      router.push(`/${storeId}/sizes`);
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
      <CustomDropdownActions items={dropdownItems} />
    </>
  );
};

export default CellAction;
