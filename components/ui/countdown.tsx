import { Hourglass } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

interface CountDownProps {
  hr?: number;
  min?: number;
  second?: number;
  autoStart?: boolean;
  onCounterEnd?: () => void;
  onStart?: () => void;
}

export default function CountDown({
  hr = 0,
  min = 0,
  second = 0,
  autoStart = true,
  onCounterEnd,
  onStart,
}: CountDownProps) {
  const [time, setTime] = useState<number>(hr * 3600 + min * 60 + second);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  const startCounter = useCallback(() => {
    setIsRunning(true);
    if (onStart) {
      onStart();
    }
  }, [onStart]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          if (prevTime === 1) {
            clearInterval(intervalId);
            setIsRunning(false);
            if (onCounterEnd) {
              onCounterEnd();
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, time, onCounterEnd]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-xl font-bold leading-none flex items-center border border-gray-300 rounded-md px-2 py-1">
      <Hourglass size={20} className="mx-2" />
      {formatTime(time)}
    </div>
  );
}
