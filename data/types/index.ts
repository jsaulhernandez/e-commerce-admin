import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
// components
import { PopoverTrigger } from "@/components/ui/popover";
// interfaces
import { IStorePlainText } from "../interfaces/store.interface";
import { IOption } from "../interfaces/option.interface";
import { IBillboardPlainText } from "../interfaces/billboard.interface";

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

export type CreateNewStoreItemProps = {
  onClick: () => void;
};

export type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

export type GenericFormProps<T extends object> = {
  initialData?: T;
};

export type HeadingProps = {
  title: string;
  description: string;
};

export type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

export type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

export type BillBoardsPageProps = {
  params: { storeId: string };
};

export type BillBoardPageProps = {
  params: { storeId: string; billboardId: string };
};

export type ImageUploadProps = {
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  onSetIsUploading: (value: boolean) => void;
};

export type CategoriesPageProps = {
  params: { storeId: string };
};

export type CategoryPageProps = {
  params: { storeId: string; categoryId: string };
};

export type CategoryFormProps<T extends object> = GenericFormProps<T> & {
  billboards: IBillboardPlainText[];
};

export type CustomFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  isLoading: boolean;
};

export type CustomFormSelectProps<T extends FieldValues> =
  CustomFormFieldProps<T> & {
    data: IOption[];
  };

export type ApiListProps = {
  entityName: string;
  entityNameId: string;
};

export type SizePageProps = {
  params: {
    storeId: string;
    sizeId: string;
  };
};

export type KitchenPageProps = {
  params: {
    storeId: string;
    kitchenId: string;
  };
};
