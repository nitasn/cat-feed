import { useRef } from "react";

interface useEasterEggClickerProps {
  clicksNeeded: number;
  msToClearCount: number;
  onAchieved: () => void;
}

export function useEasterEggClicker({ clicksNeeded, msToClearCount, onAchieved }: useEasterEggClickerProps) {
  const countRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return () => {
    clearTimeout(timeoutRef.current);

    if (++countRef.current === clicksNeeded) {
      onAchieved();
    }
    timeoutRef.current = setTimeout(() => (countRef.current = 0), msToClearCount);
  };
}
