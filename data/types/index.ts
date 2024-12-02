import React from "react";

export type GenericLayoutProps = {
  children: React.ReactNode;
};

export type ModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};
