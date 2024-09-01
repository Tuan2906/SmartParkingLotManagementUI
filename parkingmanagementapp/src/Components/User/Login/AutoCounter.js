import React, { memo } from 'react';

const TimerDisplay = memo(({ timeLeft }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return <p style={{textAlign:"center"}}>Thời gian còn lại: {formatTime(timeLeft)}</p>;
});

export default TimerDisplay;
