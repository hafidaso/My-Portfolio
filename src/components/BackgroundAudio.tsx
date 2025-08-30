"use client";
import React, { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/beethoven-fur-elise-relaxing-classical-piano-268551.mp3";

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768;

const BackgroundAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudio, setShowAudio] = useState(isDesktop());

  useEffect(() => {
    const handleResize = () => {
      const desktop = isDesktop();
      setShowAudio(desktop);
      if (!desktop && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!showAudio) return;
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.08;
      audio.loop = true;
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
    return () => {
      window.removeEventListener('click', () => {});
      window.removeEventListener('keydown', () => {});
    };
  }, [isPlaying, showAudio]);

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

  if (!showAudio) return null;

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
