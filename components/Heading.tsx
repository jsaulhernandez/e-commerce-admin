"use client";

// types
import { HeadingProps } from "@/data/types";

const Heading = ({ title = "", description = "" }: HeadingProps) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Heading;
