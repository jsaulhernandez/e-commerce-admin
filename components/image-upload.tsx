"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { ImagePlus, Trash } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
// components
import { Button } from "./ui/button";
// types
import { ImageUploadProps } from "@/data/types";

const ImageUpload = ({
  onChange,
  onRemove,
  value,
  onSetIsUploading,
  isMultiple = false,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    let files: File[] = Array.from(e.target.files || []);
    files = isMultiple ? files : [files[0]];

    if (files.length === 0) return;

    setIsLoading(true);
    onSetIsUploading(true);

    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/cloudinary", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data.url;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(`Image upload failed: ${file.name}`);
        return null;
      }
    });

    const uploadResults = await Promise.all(uploadPromises);

    const successfulUrls = uploadResults.filter(
      (url) => url !== null
    ) as string[];

    if (successfulUrls.length > 0) {
      onChange(successfulUrls);
      toast.success(`Images upload successful`);
    }

    setIsLoading(false);
    onSetIsUploading(false);
  };

  const onDelete = async (imageUrl: string) => {
    try {
      await axios.delete("/api/cloudinary", {
        data: { imageUrl },
      });
      onRemove(imageUrl);
      toast.success("Image Removed");
    } catch (error) {
      console.error("Image deleting failed:", error);
      toast.success("Image deletion failed");
    }
  };

  return (
    <div className="">
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden"
                key={url}
              >
                <Image
                  fill
                  className="object-cover"
                  alt="Billboard Image"
                  src={url}
                />
                <div className="absolute z-10 top-2 right-2">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    type="button"
                    onClick={() => onDelete(url)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader size={30} color="#555" />
              {/* <p>{`${progress.toFixed(2)}%`}</p> */}
              <p>Uploading image...</p>
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="h-4 w-4 " />
                  <p>Upload an image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="w-0 h-0"
                  multiple={isMultiple}
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
