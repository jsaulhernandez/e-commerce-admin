"use client";
import { useEffect, useState } from "react";
// components
import StoreModal from "@/components/modal/store-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(!isMounted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) return null;

  return <StoreModal />;
};

export default ModalProvider;
