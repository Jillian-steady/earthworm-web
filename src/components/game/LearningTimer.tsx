"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlarmClock } from "lucide-react";

import { useGameStore } from "@/stores/game";

export default function LearningTimer() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const clockIconRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isGamePaused = useGameStore((s) => s.isGamePaused);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const stopTracking = useGameStore((s) => s.stopTracking);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [totalSeconds]);

  // Start timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Animate clock on minute boundaries
  useEffect(() => {
    if (totalSeconds % 60 === 0 && totalSeconds !== 0 && clockIconRef.current) {
      const el = clockIconRef.current;
      el.style.transition = "transform 0.8s ease-in-out";
      el.style.transform = "scale(1.1) rotate(5deg)";
      setTimeout(() => {
        el.style.transform = "scale(1) rotate(0deg)";
      }, 400);
    }
  }, [totalSeconds]);

  // Handle visibility change - pause when tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isGamePaused()) return;
      if (document.hidden) {
        stopTracking?.();
        pauseGame();
      }
    };

    const handleBeforeunload = () => {
      if (isGamePaused()) return;
      stopTracking?.();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeunload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeunload);
    };
  }, [isGamePaused, pauseGame, stopTracking]);

  return (
    <div className="flex items-center font-sans text-gray-300 dark:text-gray-500">
      <div ref={clockIconRef} className="mr-1 flex items-center justify-center">
        <AlarmClock className="h-8 w-8" />
      </div>
      <p className="text-lg font-bold">{formattedTime}</p>
    </div>
  );
}
