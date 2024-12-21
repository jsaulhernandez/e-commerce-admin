"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
// components
import CustomModal from "@/components/CustomModal";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomField from "@/components/custom-field";
// states
import { useStoreModal } from "@/hooks/useStoreModal";
//schemas
import { storeFormSchema } from "@/data/schemas";

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof storeFormSchema>) => {
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
              <CustomField
                name="name"
                label="Name"
                placeholder="Your store name..."
                control={form.control}
                isLoading={isLoading}
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
