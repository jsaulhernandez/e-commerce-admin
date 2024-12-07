"use client";

import { useEffect, useState } from "react";
// components
import CustomModal from "../CustomModal";
import { Button } from "../ui/button";
// types
import { AlertModalProps } from "@/data/types";

const AlertModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <CustomModal
      title="Are you sure?"
      description="This action cannot be undone!.."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant={"destructive"} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </CustomModal>
  );
};

export default AlertModal;
