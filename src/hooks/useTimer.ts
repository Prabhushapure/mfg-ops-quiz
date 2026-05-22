import { useState, useRef, useCallback, useEffect } from "react";
import { GAME_DURATION } from "@/lib/gameLogic";

export function useTimer() {
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(GAME_DURATION);
  }, []);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeRemaining]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    timeRemaining,
    isRunning,
    formattedTime: formatTime(timeRemaining),
    start,
    pause,
    resume,
    reset,
    isExpired: timeRemaining <= 0,
    isWarning: timeRemaining <= 60 && timeRemaining > 0,
  };
}
