import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format, parseISO } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPlans, deletePlan, addPlan, modifyPlan } from '../../api/plansService';
import { fetchMagasins } from '../../api/marketService';
import { fetchallSectures } from '../../api/sectureService';
import PlanForm from './PlansForm';
import Dashboard from '../dashboard/Dashboard';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
import CalendarComponent from '../Calendar/Calendar';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    Date: '',
    secteurMatinal: [],
    secteurApresMidi: [],
    totalMatin: '',
    totalMidi: '',
    notes: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansData, marketsData, secteursData] = await Promise.all([
        fetchPlans(),
        fetchMagasins(),
        fetchallSectures(),
      ]);
      setPlans(plansData);
      console.log('Markets Data:', marketsData); // Add this line to log markets data
      setMarkets(Array.isArray(marketsData.markets) ? marketsData.markets : []); // Ensure marketsData.markets is an array
      setSecteurs(secteursData);
      setFilteredPlans(plansData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDayClick = (date) => {
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    const existingPlan = plans.find(plan => format(new Date(plan.Date), 'yyyy-MM-dd') === formattedDate);

    if (existingPlan) {
      setSelectedPlan(existingPlan);
      setShowForm(true);
      setIsEditMode(true);
    } else {
      setSelectedPlan({
        Date: formattedDate,
        secteurMatinal: [],
        secteurApresMidi: [],
        totalMatin: '',
        totalMidi: '',
        notes: ''
      });
      setShowForm(true);
      setIsEditMode(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
    setIsEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [fieldName, index] = name.split('_');

    if (index !== undefined) {
      setSelectedPlan(prevPlan => {
        const updatedArray = [...(prevPlan[fieldName] || [])];
        updatedArray[Number(index)] = value;
        return { ...prevPlan, [fieldName]: updatedArray };
      });
    } else {
      setSelectedPlan(prevPlan => ({ ...prevPlan, [name]: value }));
    }
  };

  const handleAddPlan = async (plan) => {
    try {
      const formattedPlan = {
        ...plan,
        Date: format(new Date(plan.Date), 'yyyy-MM-dd')
      };
      await addPlan(formattedPlan);
      fetchData();
      setShowForm(false);
      toast.success('Plan created successfully!');
    } catch (error) {
      toast.error('Error creating plan. Please try again.');
      console.error('Error creating plan:', error);
    }
  };

  const handleEditPlan = async (planId, plan) => {
    try {
      const formattedPlan = {
        ...plan,
        Date: format(new Date(plan.Date), 'yyyy-MM-dd')
      };
      await modifyPlan(planId, formattedPlan);
      fetchData();
      setShowForm(false);
      toast.success('Plan modified successfully!');
    } catch (error) {
      toast.error('Error modifying plan. Please try again.');
      console.error('Error editing plan:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      fetchData();
      setShowForm(false);
      toast.success('Plan deleted successfully!');
    } catch (error) {
      toast.error('Error deleting plan. Please try again.');
      console.error('Error deleting plan:', error);
    }
  };

  const handleSearch = (searchResults) => {
    setFilteredPlans(searchResults);
    setIsSearchActive(true);
  };

  const handleDrop = async (planId, newDate) => {
    const formattedDate = format(new Date(newDate), 'yyyy-MM-dd');
    const updatedPlan = plans.find(plan => plan._id === planId);
    if (updatedPlan) {
      updatedPlan.Date = formattedDate;

      if (updatedPlan.market) {
        updatedPlan.market = updatedPlan.market._id || updatedPlan.market;
      } else {
        updatedPlan.market = null;
      }

      await modifyPlan(updatedPlan._id, updatedPlan);
      fetchData();
    }
  };

  const handleEditFormClose = () => {
    setShowForm(false);
    setSelectedPlan({
      Date: '',
      secteurMatinal: [],
      secteurApresMidi: [],
      totalMatin: '',
      totalMidi: '',
      notes: ''
    });
    setIsEditMode(false);
  };

  const toggleShowAllNotes = () => {
    setShowAllNotes(!showAllNotes);
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayNotes = plans.filter(plan => plan.Date === today && plan.notes);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <Dashboard title="Gérer les plans" />
        <div className="flex-1 container mx-auto p-6 relative flex flex-col pt-24">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="flex flex-1 overflow-hidden">
            <div className="w-4/5 h-full overflow-auto">
              {showForm && (
                <PlanForm
                  newPlan={selectedPlan}
                  handleChange={handleChange}
                  handleAddPlan={handleAddPlan}
                  handleEditPlan={handleEditPlan}
                  handleDeletePlan={handleDeletePlan}
                  setShowForm={handleEditFormClose}
                  isEditMode={isEditMode}
                  markets={markets} // No need to check if it's an array here anymore
                  secteurs={secteurs}
                />
              )}

              <CalendarComponent
                plans={plans}
                onEdit={handlePlanSelect}
                onDrop={handleDrop}
                onClickDay={handleDayClick}
                handleChange={handleChange}
                selectedPlan={selectedPlan}
                fetchData={fetchData}
              />
            </div>
            <div className="w-1/5 p-4 bg-gray-100 border-l border-gray-300 overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Today's Notes</h2>
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
    </DndProvider>
  );
};

export default Plans;
