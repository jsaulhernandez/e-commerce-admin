"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
// components
import CustomModal from "../CustomModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// states
import { useStoreModal } from "@/hooks/useStoreModal";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name must be minimum 3 characters" }),
});

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/stores", values);
      toast.success("Store created");
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.error("[Error]", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnClose = () => {
    form.reset();
    onClose();
  };

  return (
    <CustomModal
      title="Create a new store"
      description="Add a new store to manage the products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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

              <div className="pt-6  space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleOnClose}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit" size={"sm"}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </CustomModal>
  );
};

export default StoreModal;
