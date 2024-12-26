"use client";

import { useState } from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
// components
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AlertModal from "@/components/modal/alert-modal";
import ImageUpload from "@/components/image-upload";
import CustomField from "@/components/custom-field";
// interfaces
import { IBillboardPlainText } from "@/data/interfaces/billboard.interface";
// types
import { GenericFormProps } from "@/data/types";
// schemas
import { billBoardFormSchema } from "@/data/schemas";

const BillboardForm = ({
  initialData,
}: GenericFormProps<IBillboardPlainText>) => {
  const { storeId, billboardId } = useParams<{
    storeId: string;
    billboardId: string;
  }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof billBoardFormSchema>>({
    resolver: zodResolver(billBoardFormSchema),
    defaultValues: initialData || { label: "", imageUrl: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const action = initialData ? "Save Changes" : "Create Billboard";
  const toastMessage = initialData ? "Billboard Updated" : "Billboard Created";

  const onSubmit = async (values: z.infer<typeof billBoardFormSchema>) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await axios.patch(`/api/${storeId}/billboards/${billboardId}`, values);
      } else {
        await axios.post(`/api/${storeId}/billboards`, values);
      }

      toast.success(toastMessage);
      router.refresh();
      router.push(`/${storeId}/billboards`);
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
      const { imageUrl } = form.getValues();
      await axios
        .delete("/api/cloudinary", {
          data: { imageUrl },
        })
        .then(async () => {
          await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
        });

      toast.success("Billboard Removed");
      router.refresh();
      router.push(`/${storeId}/billboards`);
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    onSetIsUploading={setIsUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <CustomField
              name="label"
              label="Name"
              placeholder="Your billboard name..."
              control={form.control}
              isLoading={isLoading}
            />
          </div>

          <Button disabled={isLoading || isUploading} type="submit" size={"sm"}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
