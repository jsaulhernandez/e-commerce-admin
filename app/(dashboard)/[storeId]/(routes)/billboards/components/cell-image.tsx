"use client";

import Image from "next/image";

const CellImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="overflow-hidden w-32 min-h-16  min-w-32 relative rounded-md shadow-md">
      <Image
        fill
        alt="Billboard Image"
        className="object-cover"
        src={imageUrl}
      />
    </div>
  );
};

export default CellImage;
