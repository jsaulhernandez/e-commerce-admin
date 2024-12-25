"use client";

import React from "react";
import { FieldValues } from "react-hook-form";
// components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// types
import { CustomFormFieldProps } from "@/data/types";

const CustomField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isLoading,
}: CustomFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input disabled={isLoading} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomField;
