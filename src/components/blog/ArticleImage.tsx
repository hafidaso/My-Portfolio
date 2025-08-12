"use client";

import React from "react";
import Image from "next/image";

interface ArticleImageProps {
  postData: {
    id: string;
    title: string;
    image?: string;
  };
}

export default function ArticleImage({ postData }: ArticleImageProps) {
  const [srcIndex, setSrcIndex] = React.useState(0);
  const extensions = [
    postData.image ? null : `/images/${postData.id}.png`,
    `/images/${postData.id}.jpg`,
    `/images/${postData.id}.gif`,
  ];
  let src = postData.image || extensions[srcIndex];
  const fallback = "/images/default.png";
  return (
    <Image
      src={src}
      alt={postData.title}
      width={800}
      height={400}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px"
      className="rounded-lg mb-8 object-cover w-full"
      priority={true}
      quality={90}
      onError={() => {
        if (srcIndex < extensions.length - 1) setSrcIndex(srcIndex + 1);
        else if (src !== fallback) setSrcIndex(extensions.length); // fallback
      }}
    />
  );
} 