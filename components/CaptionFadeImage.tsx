import React from "react";
import Image from "next/image";

interface CaptionFadeImageProps {
  src: string;
  alt: string;
  caption: string;
}

const CaptionFadeImage: React.FC<CaptionFadeImageProps> = ({
  src,
  alt,
  caption,
}) => {
  return (
    <div className="relative inline-block">
      <Image
        src={src}
        alt={alt}
        layout="responsive"
        className="h-auto block w-full"
        width="0"
        height="0"
      />
      <div className="absolute bottom-0 left-0 w-full text-center text-white p-2 bg-gradient-to-t from-black to-transparent">
        {caption}
      </div>
    </div>
  );
};

export default CaptionFadeImage;
