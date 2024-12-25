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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// types
import { CustomFormSelectProps } from "@/data/types";

const CustomSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isLoading,
  data,
}: CustomFormSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              disabled={isLoading}
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  defaultValue={field.value}
                  placeholder={placeholder}
                />
              </SelectTrigger>
              <SelectContent>
                {data.map((o) => (
                  <SelectItem value={o.value} key={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomSelect;
