"use client";
import React, { useRef, useState, useEffect } from "react";

const AUDIO_SRC = "/beethoven-fur-elise-relaxing-classical-piano-268551.mp3"; // Place your Beethoven music file in public/


const BackgroundAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.15;
      audio.loop = true;
      // Optionally, play after user interaction for autoplay policy
      // audio.play().catch(() => {});
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src={AUDIO_SRC}
      autoPlay
      loop
      style={{ display: "none" }}
    />
  );
};

export default BackgroundAudio;
