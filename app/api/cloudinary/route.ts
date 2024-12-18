import cloudinary from "@/lib/cloudinary";
import { extractPublicIdFromUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64String = buffer.toString("base64");

    const response = await cloudinary.v2.uploader.upload(
      `data:${file.type};base64,${base64String}`,
      {
        resource_type: "auto",
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      }
    );

    return NextResponse.json({
      url: response.secure_url,
      public_id: response.public_id,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Image upload failed:", error.message);
      return new NextResponse("Image upload failed", { status: 500 });
    } else {
      console.error("Unknown error:", error);
      return new NextResponse("Image upload failed - Unknown error", {
        status: 500,
      });
    }
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { imageUrl } = await req.json();

    const publicId = extractPublicIdFromUrl(imageUrl);

    if (!publicId) {
      return NextResponse.json(
        { message: "Invalid image URL" },
        { status: 400 }
      );
    }

    const response = await cloudinary.v2.uploader.destroy(publicId);

    return NextResponse.json({
      message: "Image deleted successfully",
      result: response,
    });
  } catch (error) {
    console.error("Error deleting image:", error);

    if (error instanceof Error) {
      console.error("Image deletion failed:", error.message);
      return new NextResponse("Image deletion failed", { status: 500 });
    } else {
      console.error("Unknown error:", error);
      return new NextResponse("Image deletion failed - Unknown error", {
        status: 500,
      });
    }
  }
};
