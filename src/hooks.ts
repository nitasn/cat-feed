import { useRef } from "react";

interface useEasterEggClickerProps {
  clicksNeeded: number;
  msToClearCount: number;
  onAchieved: () => void;
}
export function useEasterEggClicker({ clicksNeeded, msToClearCount, onAchieved }: useEasterEggClickerProps) {
  const clicksCountRef = useRef(0);

  const timeoutRef = useRef<NodeJS.Timeout>();

  return () => {
    clearTimeout(timeoutRef.current);
    if (++clicksCountRef.current === clicksNeeded) {
      onAchieved();
    }
    timeoutRef.current = setTimeout(() => {
      clicksCountRef.current = 0;
    }, msToClearCount);
  };
}
