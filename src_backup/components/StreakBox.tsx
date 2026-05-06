import { FC, useMemo } from 'react';
import { StreakBoxProps } from '../types';
import '../styles/streak.css';

const StreakBox: FC<StreakBoxProps> = ({ days, totalDays, percentile }) => {
  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const displayDays = useMemo(() => {
    if (days.length === 0) {
      return dayLetters.map((letter, idx) => ({
        day: letter,
        completed: idx < 5,
      }));
    }
    return days;
  }, [days]);

  return (
    <div className="streak-box">
      <div className="streak-header">
        <span className="streak-title">Posting streak</span>
        <span className="streak-count">{totalDays} days</span>
      </div>

      <div className="streak-days">
        {displayDays.map((dayData, idx) => (
          <div
            key={idx}
            className={`streak-day ${dayData.completed ? 'completed' : 'missed'}`}
          >
            {dayLetters[idx]}
          </div>
        ))}
      </div>

      <div className="streak-footer">
        You're in the top {percentile}% of consistent posters this week.
      </div>
    </div>
  );
};

export default StreakBox;
