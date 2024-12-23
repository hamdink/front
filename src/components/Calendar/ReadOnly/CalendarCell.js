import React from 'react';
import { format, isSameDay } from 'date-fns';
import PlanItem from './PlanItem';

const CalendarCell = ({ day, plansForDay, selectedDate }) => {
  return (
    <div
      className={`col cell ${!day.isSameMonth ? 'disabled' : ''} ${isSameDay(day.date, selectedDate) ? 'selected' : ''}`}
    >
      <span className="number">{format(day.date, 'd')}</span>
      {plansForDay.map((plan, index) => (
        <PlanItem key={index} plan={plan} />
      ))}
    </div>
  );
};

export default CalendarCell;
