"use client";

import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
// components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  isLoading: boolean;
  placeholder?: string;
}

const CustomField = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  isLoading,
}: CustomFormFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
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
