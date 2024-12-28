import { z, ZodSchema } from "zod";
// interfaces
import { IBillboardPlainText } from "@/data/interfaces/billboard.interface";
import { IStorePlainText } from "@/data/interfaces/store.interface";
import { ICategoryPlainText } from "@/data/interfaces/category.interface";
import { ISizePlainText } from "@/data/interfaces/size.interface";
import { IKitchenPlainText } from "@/data/interfaces/kitchen.interface";
import { ICuisinePlainText } from "@/data/interfaces/cuisine.interface";
import { IProductPlainText } from "../interfaces/product.interface";

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

export const sizeFormSchema: ZodSchema<
  Omit<ISizePlainText, "id" | "createdAt" | "updatedAt">
> = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const kitchenFormSchema: ZodSchema<
  Omit<IKitchenPlainText, "id" | "createdAt" | "updatedAt">
> = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const cuisineFormSchema: ZodSchema<
  Omit<ICuisinePlainText, "id" | "createdAt" | "updatedAt">
> = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export const productFormSchema: ZodSchema<
  Omit<IProductPlainText, "id" | "createdAt" | "updatedAt" | "qty">
> = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  category: z.string().min(1),
  size: z.string().min(1),
  kitchen: z.string().min(1),
  cuisine: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});
