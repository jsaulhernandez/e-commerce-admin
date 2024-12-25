import { z, ZodSchema } from "zod";
// interfaces
import { IBillboardPlainText } from "@/data/interfaces/billboard.interface";
import { IStorePlainText } from "../interfaces/store.interface";
import { ICategoryPlainText } from "../interfaces/category.interface";

export const storeFormSchema: ZodSchema<
  Omit<IStorePlainText, "id" | "userId" | "createdAt" | "updatedAt">
> = z.object({
  name: z
    .string()
    .min(3, { message: "Store name must be minimum 3 characters" }),
});

export const billBoardFormSchema: ZodSchema<
  Omit<IBillboardPlainText, "id" | "createdAt" | "updatedAt">
> = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const categoryFormSchema: ZodSchema<
  Omit<ICategoryPlainText, "id" | "createdAt" | "updatedAt" | "billboardLabel">
> = z.object({
  billboardId: z.string().min(1),
  name: z.string().min(1),
});
