"use client";
import React, { useRef, useState, useEffect } from "react";

const AUDIO_SRC = "/beethoven-fur-elise-relaxing-classical-piano-268551.mp3"; // Place your Beethoven music file in public/

const BackgroundAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.15; // Soft volume
      audio.loop = true;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <audio ref={audioRef} src={AUDIO_SRC} autoPlay loop />
      <button
        onClick={handlePlayPause}
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
    </div>
  );
};

export default BackgroundAudio;
