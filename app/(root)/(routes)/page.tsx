"use client";

import { useEffect } from "react";
// states
import { useStoreModal } from "@/hooks/useStoreModal";

const SetupPage = () => {
  const { onOpen, isOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
