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
import Heading from "@/components/Heading";
import AlertModal from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
// interfaces
import { ICuisinePlainText } from "@/data/interfaces/cuisine.interface";
// types
import { GenericFormProps } from "@/data/types";
// schemas
import { cuisineFormSchema } from "@/data/schemas";

const CuisineForm = ({ initialData }: GenericFormProps<ICuisinePlainText>) => {
  const { storeId, cuisineId } = useParams<{
    storeId: string;
    cuisineId: string;
  }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof cuisineFormSchema>>({
    resolver: zodResolver(cuisineFormSchema),
    defaultValues: initialData || { name: "", value: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const title = initialData ? "Edit Cuisine" : "Create Cuisine";
  const description = initialData ? "Edit a cuisine" : "Add a new cuisine";
  const action = initialData ? "Save Changes" : "Create Cuisine";
  const toastMessage = initialData ? "Cuisine Updated" : "Cuisine Created";

  const onSubmit = async (values: z.infer<typeof cuisineFormSchema>) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await axios.patch(`/api/${storeId}/cuisines/${cuisineId}`, values);
      } else {
        await axios.post(`/api/${storeId}/cuisines`, values);
      }

      toast.success(toastMessage);
      router.refresh();
      onGoBack();
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
      await axios.delete(`/api/${storeId}/cuisines/${cuisineId}`);

      toast.success("Cuisine Removed");
      router.refresh();
      onGoBack();
    } catch (error) {
      console.error("[Error]", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onGoBack = () => {
    router.push(`/${storeId}/cuisines`);
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
          autoComplete="off"
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <CustomField
              name="name"
              label="Name"
              placeholder="Your cuisine name..."
              control={form.control}
              isLoading={isLoading}
            />

            <CustomField
              name="value"
              label="Value"
              placeholder="Your cuisine value..."
              control={form.control}
              isLoading={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              disabled={isLoading}
              type="button"
              size={"sm"}
              variant={"outline"}
              onClick={onGoBack}
            >
              Regresar
            </Button>
            <Button disabled={isLoading} type="submit" size={"sm"}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CuisineForm;
