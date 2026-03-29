"use client";

import { useState, useCallback, useRef } from "react";
import { rollDice } from "@/lib/gameLogic";
import { playDiceRoll } from "@/lib/sounds";

export function useDice() {
  const [value, setValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const displayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const roll = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      setIsRolling(true);
      playDiceRoll();

      // Show random faces during animation
      let count = 0;
      displayInterval.current = setInterval(() => {
        setValue(Math.floor(Math.random() * 6) + 1);
        count++;
        if (count >= 8) {
          if (displayInterval.current) clearInterval(displayInterval.current);
          const finalValue = rollDice();
          setValue(finalValue);
          setIsRolling(false);
          resolve(finalValue);
        }
      }, 60);
    });
  }, []);

  const reset = useCallback(() => {
    setValue(null);
    setIsRolling(false);
    if (displayInterval.current) clearInterval(displayInterval.current);
  }, []);

  return { value, isRolling, roll, reset };
}
