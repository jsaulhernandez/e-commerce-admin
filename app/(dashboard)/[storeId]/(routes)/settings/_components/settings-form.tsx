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
import { Form } from "@/components/ui/form";
import AlertModal from "@/components/modal/alert-modal";
import ApiAlert from "@/components/ApiAlert";
import CustomField from "@/components/custom-field";
// hooks
import { useOrigin } from "@/hooks/useOrigin";
// interfaces
import { IStorePlainText } from "@/data/interfaces/store.interface";
// types
import { GenericFormProps } from "@/data/types";
// schemas
import { storeFormSchema } from "@/data/schemas";

const SettingsForm = ({ initialData }: GenericFormProps<IStorePlainText>) => {
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: initialData,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof storeFormSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/stores/${storeId}`, values);
      toast.success("Store Updated");
      window.location.assign(`/${response.data.id}`);
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
      await axios.delete(`/api/stores/${storeId}`);
      toast.success("Store Deleted");
      router.refresh();
      router.push("/");
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
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash className="w-4 h-4" />
        </Button>
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
              placeholder="Your store name..."
              control={form.control}
              isLoading={isLoading}
            />
          </div>

          <Button disabled={isLoading} type="submit" size={"sm"}>
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_URL"
        description={`${origin}/api/${storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
