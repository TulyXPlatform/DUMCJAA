import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    isPast: false,
  };
}

const Segment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="countdown-segment">
    <span className="countdown-value">{String(value).padStart(2, '0')}</span>
    <span className="countdown-label">{label}</span>
  </div>
);

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    if (timeLeft.isPast) return;
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate, timeLeft.isPast]);

  if (timeLeft.isPast) {
    return <span className="countdown-past">Event has ended</span>;
  }

  if (compact) {
    return (
      <span className="countdown-compact">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {String(timeLeft.hours).padStart(2, '0')}h{' '}
        {String(timeLeft.minutes).padStart(2, '0')}m
      </span>
    );
  }

  return (
    <div className="countdown-timer">
      <Segment value={timeLeft.days} label="Days" />
      <span className="countdown-sep">:</span>
      <Segment value={timeLeft.hours} label="Hrs" />
      <span className="countdown-sep">:</span>
      <Segment value={timeLeft.minutes} label="Min" />
      <span className="countdown-sep">:</span>
      <Segment value={timeLeft.seconds} label="Sec" />
    </div>
  );
};
