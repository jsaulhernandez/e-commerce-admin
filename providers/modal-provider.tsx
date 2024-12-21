"use client";
import { useEffect, useState } from "react";
// components
import StoreModal from "@/components/modal/store-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <StoreModal />;
};

export default ModalProvider;
