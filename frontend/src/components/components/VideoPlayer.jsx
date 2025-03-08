"use client";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function VideoPlayer({ url }) {
  return (
    <ReactPlayer
      url={url || "https://www.youtube.com/watch?v=-2RAq5o5pwc"}
      controls
      width="100%"
      height="360px"
    />
  );
}
