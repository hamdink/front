import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
} from 'date-fns';
import './CalendarComponent.css';
import CalendarCell from './CalendarCell';
import { modifyPlan } from '../../api/plansService';

const CalendarComponent = ({ plans, onClickDay, handleChange, selectedPlan, fetchData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showListView, setShowListView] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
    if (showListView) {
      setShowAllEvents(false);
    }
  };

  const toggleView = () => {
    setShowListView(!showListView);
    setShowAllEvents(false);
  };

  const toggleShowAllEvents = () => {
    setShowAllEvents(!showAllEvents);
  };

  const handleDrop = async (plan, newDate) => {
    try {
      const updatedPlan = {
        Date: newDate,
        market: plan.market ? (plan.market._id || plan.market) : null,
        secteurMatinal: plan.secteurMatinal.map((secteur) => secteur._id),
        secteurApresMidi: plan.secteurApresMidi.map((secteur) => secteur._id),
        totalMatin: plan.totalMatin,
        totalMidi: plan.totalMidi,
        notes: plan.notes,
      };
      await modifyPlan(plan._id, updatedPlan);
      await fetchData();
    } catch (error) {
      console.error('Error updating plan date:', error);
    }
  };

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            &laquo;
          </div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <div className="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            &raquo;
          </div>
        </div>
        <div className="button-container">
          {!showListView && (
            <button className="btn-today" onClick={goToToday}>
              Aujourd'hui
            </button>
          )}
          <button className="btn-toggle" onClick={toggleView}>
            {showListView ? 'View Calendar' : 'View Events List'}
          </button>
          {showListView && (
            <button className="btn-toggle" onClick={toggleShowAllEvents}>
              {showAllEvents ? "Show Today's Events" : 'Show All Events'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'eee';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center day-name" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = new Date(day);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const plansForDay = plans.filter((plan) => {
          const planDate = new Date(plan.Date);
          return planDate.toDateString() === cloneDay.toDateString();
        });

        days.push(
          <CalendarCell
            key={day}
            day={{ date: cloneDay, isSameMonth: isCurrentMonth }}
            plansForDay={plansForDay}
            onClickDay={onClickDay}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            onDrop={handleDrop}
            className={isCurrentMonth ? '' : 'disabled'} // Adding a class to differentiate non-current month days
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const renderEventsList = () => {
    const today = new Date().toDateString();
    const eventsToShow = showAllEvents ? plans : plans.filter((plan) => new Date(plan.Date).toDateString() === today);

    return (
      <div className="events-list">
        <h2 className="events-list-title">{showAllEvents ? 'All Events' : "Today's Events"}</h2>
        {eventsToShow.length === 0 ? (
          <p>No events to display</p>
        ) : (
          <ul className="events-list-items">
            {eventsToShow.map((plan, index) => (
              <li key={index} className="events-list-item">
                <strong className="events-list-date">{new Date(plan.Date).toDateString()}</strong>
                <ul className="events-list-details">
                  {Array.isArray(plan.secteurMatinal) &&
                    plan.secteurMatinal.map((secteur, idx) => (
                      <li key={`matinal-${idx}`} className="events-list-detail">
                        Matinal: {secteur.name} - 8:00 AM
                      </li>
                    ))}
                  {Array.isArray(plan.secteurApresMidi) &&
                    plan.secteurApresMidi.map((secteur, idx) => (
                      <li key={`apresMidi-${idx}`} className="events-list-detail">
                        Apres Midi: {secteur.name} - 12:00 PM
                      </li>
                    ))}
                  {plan.notes && (
                    <li className="events-list-detail bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mt-2 rounded-md">
                      Notes: {plan.notes}
                    </li>
                  )}
                </ul>
                {selectedPlan._id === plan._id && (
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Add your notes here..."
                    value={selectedPlan.notes}
                    onChange={(e) => handleChange({ target: { name: 'notes', value: e.target.value } })}
                  ></textarea>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {showListView ? (
        renderEventsList()
      ) : (
        <>
          {renderDays()}
          {renderCells()}
        </>
      )}
    </div>
  );
};

export default CalendarComponent;
