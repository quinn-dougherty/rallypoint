import React from "react";
import Image from "next/image";

interface CaptionFadeImageProps {
  src: string;
  title: string;
  caption: string;
}

const CaptionFadeImage: React.FC<CaptionFadeImageProps> = ({
  src,
  title,
  caption,
}) => {
  return (
    <div className="relative inline-block">
      <h3 className="title">{title}</h3>
      <Image
        src={src}
        alt={title}
        layout="responsive"
        className="block rounded-full opacity-85"
        width="0"
        height="0"
      />
      <div className="absolute bottom-0 left-0 w-full text-center text-white p-2 bg-gradient-to-t from-black to-transparent">
        {`\n\n\n\n${caption}`}
      </div>
    </div>
  );
};

export default CaptionFadeImage;
