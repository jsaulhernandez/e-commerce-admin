"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
// components
import CustomField from "@/components/custom-field";
import CustomSelect from "@/components/custom-select";
import Heading from "@/components/Heading";
import AlertModal from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
// interfaces
import { IOption } from "@/data/interfaces/option.interface";
import { ICategoryPlainText } from "@/data/interfaces/category.interface";
// types
import { CategoryFormProps } from "@/data/types";
// schemas
import { categoryFormSchema } from "@/data/schemas";

const CategoryForm = ({
  billboards,
  initialData,
}: CategoryFormProps<ICategoryPlainText>) => {
  const { storeId, categoryId } = useParams<{
    storeId: string;
    categoryId: string;
  }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || { name: "", billboardId: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const dataOptions: IOption[] = billboards.map((b) => ({
    label: b.label,
    value: b.id,
  }));
  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const action = initialData ? "Save Changes" : "Create Category";
  const toastMessage = initialData ? "Category Updated" : "Category Created";

  const onSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    setIsLoading(true);
    // getting billboard label
    const billboardLabel =
      billboards.find((b) => b.id === values.billboardId)?.label ?? "";
    const data = {
      ...values,
      billboardLabel,
    } as ICategoryPlainText;
    try {
      if (initialData) {
        await axios.patch(`/api/${storeId}/categories/${categoryId}`, data);
      } else {
        await axios.post(`/api/${storeId}/categories`, data);
      }

      toast.success(toastMessage);
      router.refresh();
      router.push(`/${storeId}/categories`);
    } catch (error) {
      console.error("[Error]", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/${storeId}/categories/${categoryId}`);

      toast.success("Category Removed");
      router.refresh();
      router.push(`/${storeId}/categories`);
    } catch (error) {
      console.error("[Error]", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <CustomField
              name="name"
              label="Name"
              placeholder="Your category name..."
              control={form.control}
              isLoading={isLoading}
            />

            <CustomSelect
              name="billboardId"
              label="Billboard"
              placeholder="Select a billboard"
              control={form.control}
              isLoading={isLoading}
              data={dataOptions}
            />
          </div>

          <Button disabled={isLoading} type="submit" size={"sm"}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
