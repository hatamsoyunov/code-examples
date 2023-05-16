import { useState, useEffect } from 'react';

export const useTimer = (timerSeconds: number) => {
  const [seconds, setSeconds] = useState(timerSeconds);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (seconds <= 0) {
        clearInterval(timerId);
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds]);

  const resetTimer = () => {
    setSeconds(timerSeconds);
  };

  return {
    seconds,
    resetTimer,
  };
};
