"use client";

import React, { useEffect, useRef, useState } from "react";

interface CircularTimerProps {
  durationMinutes: number;
  onTimeUp?: () => void;
}

export default function CircularTimer({ durationMinutes, onTimeUp }: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const hasFiredRef = useRef(false);
  // Start timer on mount
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
// Ensure onTimeUp is called only once when time runs out
  useEffect(() => {
    if (timeLeft > 0 || hasFiredRef.current) return;
    hasFiredRef.current = true;
    onTimeUp?.();
  }, [onTimeUp, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Progress for the circle
  const totalSeconds = durationMinutes * 60;
  const percentage = (timeLeft / totalSeconds) * 100;
  
  const size = 60;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#155DFC"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black font-mono text-gray-900">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
