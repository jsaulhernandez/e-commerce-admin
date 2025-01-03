"use client";

import Image from "next/image";

const CellImage = ({ images }: { images: string[] }) => {
  return (
    <>
      {images.map((i, index) => (
        <div
          className="overflow-hidden w-16 h-16 min-h-16 aspect-square rounded-md flex items-center relative"
          key={index}
        >
          <Image fill alt="image" className="object-contain" src={i} />
        </div>
      ))}
    </>
  );
};

export default CellImage;
