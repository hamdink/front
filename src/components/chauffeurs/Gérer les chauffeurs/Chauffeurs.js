import React, { useState, useEffect, useCallback } from 'react';
import { fetchDrivers, deleteDriver, addDriver, searchDrivers, modifyDriver } from '../../../api/driverService';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import DriverForm from './DriverForm';
import DriverTable from './DriverTable';
import Pagination from '../../Pagination/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './chauffeurs.css';

const Chauffeurs = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchDriversData();
  }, [currentPage]);

  const fetchDriversData = async () => {
    try {
      const { drivers, totalPages } = await fetchDrivers(currentPage);
      setDrivers(drivers);
      setFilteredDrivers(drivers);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching drivers', error);
      toast.error('Erreur lors de la récupération des chauffeurs.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur?')) {
      try {
        await deleteDriver(id);
        fetchDriversData();
        toast.success('Chauffeur supprimé avec succès!');
      } catch (error) {
        console.error('Error deleting driver', error);
        toast.error('Erreur lors de la suppression du chauffeur.');
      }
    }
  };

  const handleModify = (driver) => {
    setCurrentDriver(driver);
    setNewDriver(driver);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditDriver = async (e) => {
    e.preventDefault();
    try {
      await modifyDriver(newDriver);
      fetchDriversData();
      setShowForm(false);
      toast.success('Chauffeur modifié avec succès!');
    } catch (error) {
      console.error('Error modifying driver', error);
      toast.error('Erreur lors de la modification du chauffeur.');
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await addDriver(newDriver);
      fetchDriversData();
      setShowForm(false);
      toast.success('Chauffeur ajouté avec succès!');
    } catch (error) {
      console.error('Error adding driver', error);
      toast.error('Erreur lors de l\'ajout du chauffeur.');
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewDriver(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleSearch = async (searchTerm) => {
    if (searchTerm === '') {
      setFilteredDrivers(drivers);
      setIsSearchActive(false);
    } else {
      try {
        const response = await searchDrivers(searchTerm);
        setFilteredDrivers(response);
        setIsSearchActive(true);
        toast.success('Recherche effectuée avec succès!');
      } catch (error) {
        console.error('Error searching drivers', error);
        toast.error('Erreur lors de la recherche des chauffeurs.');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Dashboard title="Gérer les chauffeurs" />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="container mx-auto p-9 relative mt-20">
          <ToastContainer />
          <Search setData={handleSearch} title={"Tout les chauffeurs"} />
          <button
            className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setNewDriver({
                first_name: '',
                last_name: '',
                email: '',
                password: ''
              });
            }}>
            Ajouter un chauffeur
          </button>

          {showForm && (
            <DriverForm
              newDriver={newDriver}
              handleChange={handleChange}
              handleAddDriver={handleAddDriver}
              handleEditDriver={handleEditDriver}
              setShowForm={setShowForm}
              isEditMode={isEditMode}
            />
          )}

          <DriverTable drivers={filteredDrivers} handleDelete={handleDelete} handleModify={handleModify} />

          {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
};

export default Chauffeurs;
