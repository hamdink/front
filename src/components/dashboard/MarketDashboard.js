import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import ReadOnlyCalendarComponent from '../Calendar/ReadOnly/ReadOnlyCalendarComponent';
import { fetchPlans } from '../../api/plansService';
import { format, parseISO } from 'date-fns';
import './AdminDashboard.css'; // Reusing the AdminDashboard styles

const MarketDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansData = await fetchPlans();
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleShowAllNotes = () => {
    setShowAllNotes(!showAllNotes);
  };

  const today = format(new Date(), 'yyyy-MM-dd'); // Get today's date in 'yyyy-MM-dd' format
  const todayNotes = plans.filter(plan => plan.Date === today && plan.notes);

  return (
    <div className="dashboard-container">
      <Dashboard title="Market Dashboard" className="sidebar" />
      <div className="main-content">
        <div className="header-section">
          <h1 className="title">Market Dashboard</h1>
        </div>
        <div className="calendar-and-notes-section">
          <div className="calendar-container">
            <ReadOnlyCalendarComponent plans={plans} /> {/* Pass the plans data here */}
          </div>
          <div className="notes-container">
            <h2 className="notes-title">Today's Notes</h2>
            {todayNotes.length > 0 ? (
              todayNotes.map(note => (
                <div key={note._id} className="sticky-note mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                  <strong>{format(parseISO(note.Date), 'MMM dd, yyyy')}</strong>
                  <p>{note.notes}</p>
                </div>
              ))
            ) : (
              <p>No notes for today</p>
            )}
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
              onClick={toggleShowAllNotes}
            >
              {showAllNotes ? 'Hide All Notes' : 'Show All Notes'}
            </button>
            {showAllNotes && (
              <div className="mt-4">
                {plans.filter(plan => plan.notes).map(note => (
                  <div key={note._id} className="note mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                    <strong>{format(parseISO(note.Date), 'MMM dd, yyyy')}</strong>
                    <p>{note.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
