import { z, ZodSchema } from "zod";
// interfaces
import { IBillboardPlainText } from "@/data/interfaces/billboard.interface";
import { IStorePlainText } from "../interfaces/store.interface";

export const storeFormScheme: ZodSchema<
  Omit<IStorePlainText, "id" | "userId" | "createdAt" | "updatedAt">
> = z.object({
  name: z
    .string()
    .min(3, { message: "Store name must be minimum 3 characters" }),
});

export const billBoardFormScheme: ZodSchema<
  Omit<IBillboardPlainText, "id" | "createdAt" | "updatedAt">
> = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});
