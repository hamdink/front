import React, { useState, useEffect } from 'react';
import { fetchSectures, deleteSecture, addSecture, modifySecture, searchSectures } from '../../../api/sectureService';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import SectureForm from './SecteursForm';
import SectureTable from './SecteursTable';
import Pagination from '../../Pagination/Pagination';

const Secture = () => {
  const [sectures, setSectures] = useState([]);
  const [filteredSectures, setFilteredSectures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSecture, setCurrentSecture] = useState({ name: '', codesPostaux: [] });
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchSecturesData();
  }, [currentPage]);

  const fetchSecturesData = async () => {
    try {
      const data = await fetchSectures(currentPage);
      setSectures(data.secteurs);
      setFilteredSectures(data.secteurs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching sectures', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSecture(id);
      fetchSecturesData();
    } catch (error) {
      console.error('Error deleting secture', error);
    }
  };

  const handleModify = (secture) => {
    setCurrentSecture(secture);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleAddSecture = () => {
    setCurrentSecture({ name: '', codesPostaux: [] });
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleSaveSecture = async (secteur) => {
    try {
      // Convert string array to number array
      secteur.codesPostaux = secteur.codesPostaux.map(code => Number(code));
      if (isEditMode) {
        await modifySecture(secteur);
      } else {
        await addSecture(secteur);
      }
      fetchSecturesData();
      setShowForm(false);
      setIsEditMode(false);
      setCurrentSecture({ name: '', codesPostaux: [] });
    } catch (error) {
      console.error('Error saving secture', error);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (searchTerm) {
      setIsSearchActive(true);
      const data = await searchSectures(searchTerm);
      setFilteredSectures(data);
    } else {
      setIsSearchActive(false);
      setFilteredSectures(sectures);
    }
  };

  const handleClearSearch = () => {
    setIsSearchActive(false);
    setFilteredSectures(sectures);
  };

  return (
    <div className="flex h-screen">
      <Dashboard title="Secture" />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="container mx-auto p-9 relative mt-20">
          <Search setData={handleSearch} title={"Tous les sectures"} clearSearch={handleClearSearch} />
          <button
            className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
            onClick={handleAddSecture}
          >
            Ajouter un secteur
          </button>
          {showForm && (
            <SectureForm
              newSecture={currentSecture}
              handleSaveSecture={handleSaveSecture}
              setShowForm={setShowForm}
              isEditMode={isEditMode}
            />
          )}
          <SectureTable
            sectures={isSearchActive ? filteredSectures : sectures}
            handleDelete={handleDelete}
            handleModify={handleModify}
          />
          {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
};

export default Secture;
