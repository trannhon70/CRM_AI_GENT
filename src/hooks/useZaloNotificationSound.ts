import { useCallback, useEffect, useRef } from "react";

interface UseZaloNotificationSoundProps {
  volume?: number;
}

export const useZaloNotificationSound = ({
  volume = 1,
}: UseZaloNotificationSoundProps = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/notication.mp3");

    audio.preload = "auto";
    audio.volume = volume;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      await audioRef.current.play();
    } catch (err) {
      console.warn("Cannot play notification sound:", err);
    }
  }, []);

  return {
    play,
  };
};