import { useEffect, useMemo, useState } from 'react';
import { Side } from '../types';

export function useFeedingTimer(startSide: Side) {
  const initialSide = startSide === 'both' ? 'right' : startSide;
  const [activeSide, setActiveSide] = useState<'right' | 'left'>(initialSide);
  const [isPaused, setPaused] = useState(false);
  const [rightSeconds, setRightSeconds] = useState(0);
  const [leftSeconds, setLeftSeconds] = useState(0);

  useEffect(() => {
    if (isPaused) return undefined;
    const id = window.setInterval(() => {
      if (activeSide === 'right') setRightSeconds((value) => value + 1);
      else setLeftSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeSide, isPaused]);

  const totalSeconds = useMemo(() => rightSeconds + leftSeconds, [rightSeconds, leftSeconds]);

  return {
    activeSide,
    setActiveSide,
    isPaused,
    setPaused,
    rightSeconds,
    setRightSeconds,
    leftSeconds,
    setLeftSeconds,
    totalSeconds,
  };
}
