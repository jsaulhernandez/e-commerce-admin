import { PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { IStorePlainText } from "../interfaces/store.interface";
import { IOption } from "../interfaces/option.interface";

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

export type DashboardLayoutProps = {
  children: React.ReactNode;
  params: { storeId: string };
};

export type DashboardOverviewProps = {
  params: { storeId: string };
};

export type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export type StoreSwitcherProps = PopoverTriggerProps & {
  items: IStorePlainText[];
};

export type StoreListItemProps = {
  store: IOption;
  onSelect: (payload: IOption) => void;
  isChecked: boolean;
};
