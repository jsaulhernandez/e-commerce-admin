"use client";

import { useState } from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
// types
import { SettingsFormProps } from "@/data/types";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name must be minimum 3 characters" }),
});

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const onHandleClick = () => {};

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button variant={"destructive"} size={"icon"} onClick={onHandleClick}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your store name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" size={"sm"}>
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
