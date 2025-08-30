"use client";
import React, { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/beethoven-fur-elise-relaxing-classical-piano-268551.mp3"; // Place your Beethoven music file in public/

const BackgroundAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.08; // slightly lower volume
      audio.loop = true;
      // Try to autoplay after user gesture
      const playAudio = () => {
        if (!isPlaying) {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        window.removeEventListener('click', playAudio);
        window.removeEventListener('keydown', playAudio);
      };
      window.addEventListener('click', playAudio);
      window.addEventListener('keydown', playAudio);
    }
    // Cleanup
    return () => {
      window.removeEventListener('click', () => {});
      window.removeEventListener('keydown', () => {});
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        style={{ display: "none" }}
      />
      <button
        onClick={handlePlayPause}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 9999,
          background: isPlaying ? "#f97316" : "#fff",
          color: isPlaying ? "#fff" : "#333",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        title={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? "🔊" : "🔈"}
      </button>
    </>
  );
};

export default BackgroundAudio;
