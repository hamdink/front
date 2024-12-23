import React from 'react';
import { useDrop } from 'react-dnd';
import { format, isSameDay } from 'date-fns';
import PlanItem from './PlanItem';

const CalendarCell = ({ day, plansForDay, onClickDay, setSelectedDate, selectedDate, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'plan',
    drop: (item) => {
      const formattedDate = format(day.date, 'yyyy-MM-dd'); 
      onDrop(item.plan, formattedDate);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`col cell ${!day.isSameMonth ? 'disabled' : ''} ${isSameDay(day.date, selectedDate) ? 'selected' : ''}`}
      onClick={() => {
        if (day.isSameMonth) {
          setSelectedDate(day.date);
          onClickDay(day.date);
        }
      }}
    >
      <span className="number">{format(day.date, 'd')}</span>
      {plansForDay.map((plan, index) => (
        <PlanItem key={index} plan={plan} />
      ))}
      {isOver && canDrop && <div className="drop-overlay">Drop here</div>}
    </div>
  );
};

export default CalendarCell;
