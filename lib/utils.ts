import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to extract public ID from the Cloudinary URL
export const extractPublicIdFromUrl = (url: string) => {
  const urlParts = url?.split("/");
  // Find the position of 'upload' in the array
  const uploadIndex = urlParts.indexOf("upload");
  // Extract the public ID based on the position of 'upload'
  const publicIdWithExtension =
    uploadIndex !== -1 ? urlParts.slice(uploadIndex + 2).join("/") : null;

  // Remove the file extension
  const publicIdWithoutExtension = publicIdWithExtension
    ?.split(".")
    .slice(0, -1)
    .join(".");

  // Sanitize the public ID by replacing invalid characters within each part
  const sanitizedPublicId = publicIdWithoutExtension?.replace(
    /[^a-zA-Z0-9_./-]/g,
    "_"
  );
  if (!sanitizedPublicId) {
    console.error("Invalid Cloudinary URL. Public ID not found.");
    return null;
  }

  return sanitizedPublicId;
};

export type Mapper<TSource, TTarget> = (source: TSource) => TTarget;

/**
 *
 * @param source data of firebase
 * @param mapping array of keys to include in the output data
 * @returns source only with the key defined in the mapping array
 */
export function map<TSource, TTarget>(
  source: TSource,
  mapping: (keyof TSource)[]
): TTarget {
  const result: Partial<TTarget> = {};

  mapping.forEach((key) => {
    const sourceValue = source[key];
    if (sourceValue !== undefined) {
      result[key as unknown as keyof TTarget] =
        sourceValue as TTarget[keyof TTarget];
    }
  });

  return result as TTarget;
}

/**
 *
 * @param source data of firebase
 * @param mapping array of keys that are not included in the output data
 * @returns source without keys included in mapping
 */
export function mapNotInclude<TSource extends object, TTarget>(
  source: TSource,
  mapping: (keyof TSource)[]
): TTarget {
  const result: Partial<TTarget> = {};

  Object.keys(source).forEach((key) => {
    if (!mapping.includes(key as keyof TSource)) {
      const sourceValue = source[key as keyof TSource];
      if (sourceValue !== undefined) {
        result[key as keyof TTarget] = sourceValue as TTarget[keyof TTarget];
      }
    }
  });

  return result as TTarget;
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
