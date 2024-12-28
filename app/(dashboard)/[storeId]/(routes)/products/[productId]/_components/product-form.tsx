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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import CustomSelect from "@/components/custom-select";
import CustomCheckbox from "@/components/custom-checkbox";
import ImageUpload from "@/components/image-upload";
// interfaces
import { IProductPlainText } from "@/data/interfaces/product.interface";
import { IOption } from "@/data/interfaces/option.interface";
// types
import { ProductFormProps } from "@/data/types";
// schemas
import { productFormSchema } from "@/data/schemas";

const ProductForm = ({
  initialData,
  categories,
  cuisines,
  kitchens,
  sizes,
}: ProductFormProps<IProductPlainText>) => {
  const { storeId, productId } = useParams<{
    storeId: string;
    productId: string;
  }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      category: "",
      cuisine: "",
      images: [],
      isArchived: false,
      isFeatured: false,
      kitchen: "",
      name: "",
      price: 1,
      size: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const action = initialData ? "Save Changes" : "Create Product";
  const toastMessage = initialData ? "Product Updated" : "Product Created";
  const categoriesOptions: IOption[] = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const sizesOptions: IOption[] = sizes.map((s) => ({
    label: s.name,
    value: s.id,
  }));
  const kitchensOptions: IOption[] = kitchens.map((k) => ({
    label: k.name,
    value: k.id,
  }));
  const cuisinesOptions: IOption[] = cuisines.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await axios.patch(`/api/${storeId}/products/${productId}`, values);
      } else {
        await axios.post(`/api/${storeId}/products`, values);
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
      const { images } = form.getValues();

      const deletePromises = images.map(async (image) => {
        await axios.delete("/api/cloudinary", {
          data: { imageUrl: image.url },
        });
      });

      await Promise.all(deletePromises);

      await axios.delete(`/api/${storeId}/products/${productId}`);

      toast.success("Product Removed");
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
    router.push(`/${storeId}/products`);
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((i) => i.url)}
                    onChange={(urls) =>
                      field.onChange(urls.map((url) => ({ url })))
                    }
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((current) => current.url !== url)
                      )
                    }
                    onSetIsUploading={setIsUploading}
                    isMultiple={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <CustomField
              name="name"
              label="Name"
              placeholder="Your product name..."
              control={form.control}
              isLoading={isLoading}
            />

            <CustomField
              name="price"
              label="Price"
              placeholder="Your product price..."
              control={form.control}
              isLoading={isLoading}
            />

            <CustomSelect
              name="category"
              label="Category"
              placeholder="Select a category"
              control={form.control}
              isLoading={isLoading}
              data={categoriesOptions}
            />

            <CustomSelect
              name="size"
              label="Size"
              placeholder="Select a size"
              control={form.control}
              isLoading={isLoading}
              data={sizesOptions}
            />

            <CustomSelect
              name="kitchen"
              label="Kitchen"
              placeholder="Select a kitchen"
              control={form.control}
              isLoading={isLoading}
              data={kitchensOptions}
            />

            <CustomSelect
              name="cuisine"
              label="Cuisine"
              placeholder="Select a cuisine"
              control={form.control}
              isLoading={isLoading}
              data={cuisinesOptions}
            />

            <CustomCheckbox
              name="isFeatured"
              label="Featured"
              control={form.control}
              extra="This product will be on home screen under featured products"
            />

            <CustomCheckbox
              name="isArchived"
              label="Archived"
              control={form.control}
              extra="This product will not be display"
            />
          </div>

          <div className="flex gap-4">
            <Button
              disabled={isLoading || isUploading}
              type="button"
              size={"sm"}
              variant={"outline"}
              onClick={onGoBack}
            >
              Regresar
            </Button>
            <Button
              disabled={isLoading || isUploading}
              type="submit"
              size={"sm"}
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
