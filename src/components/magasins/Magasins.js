import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMagasins, deleteMagasin, addMagasin, modifyMagasin, searchMagasins } from '../../redux/reducers/magasinReducer';
import Dashboard from '../dashboard/Dashboard';
import Search from '../searchbar/Search';
import MagasinForm from './MagasinForm';
import MagasinTable from './MagasinTable';
import Pagination from '../Pagination/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Magasins = () => {
  const dispatch = useDispatch();
  const magasins = useSelector((state) => state.magasins.items) || [];
  const totalItems = useSelector((state) => state.magasins.total) || 0;
  const loading = useSelector((state) => state.magasins.loading);
  const error = useSelector((state) => state.magasins.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newMagasin, setNewMagasin] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    numberMa: '',
    numberMi: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMagasin, setCurrentMagasin] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [userRole, setUserRole] = useState('');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    dispatch(fetchMagasins(currentPage));
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, [dispatch, currentPage]);

  const handleDelete = (id) => {
    dispatch(deleteMagasin(id));
    toast.success('Magasin supprimé avec succès!');
  };

  const handleModify = (magasin) => {
    setCurrentMagasin(magasin);
    setNewMagasin({ ...magasin });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditMagasin = (e) => {
    e.preventDefault();
    dispatch(modifyMagasin(newMagasin))
      .unwrap()
      .then(() => {
        setShowForm(false);
        setIsEditMode(false);
        setCurrentMagasin(null);
        setNewMagasin({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          address: '',
          numberMa: '',
          numberMi: ''
        });
      })
      .catch((error) => {
        console.error('Failed to edit magasin:', error);
        toast.error('Failed to edit magasin');
      });
  };

  const handleAddMagasin = (e) => {
    e.preventDefault();
    dispatch(addMagasin(newMagasin))
      .unwrap()
      .then(() => {
        setShowForm(false);
        toast.success('Magasin ajouté avec succès!');
      })
      .catch((error) => {
        console.error('Failed to add magasin:', error);
        toast.error('Failed to add magasin');
      });
  };

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setNewMagasin((prevState) => ({
      ...prevState,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setIsSearchActive(false);
      dispatch(fetchMagasins(currentPage));
    } else {
      dispatch(searchMagasins(searchTerm))
        .unwrap()
        .then((data) => {
          console.log('Search success:', data);
          setIsSearchActive(true);
        })
        .catch((error) => {
          console.error('Search failed:', error);
          toast.error('Search failed');
        });
    }
  };

  return (
    <div className="flex h-screen">
        <Dashboard title="Gérer les magasins" />
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            <div className="container mx-auto p-9 relative mt-20">
                <ToastContainer />
                <Search setData={handleSearch} title={"Tous les magasins"} />
                <button
                    className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
                    onClick={() => {
                        setShowForm(true);
                        setIsEditMode(false);
                        setNewMagasin({
                            first_name: '',
                            last_name: '',
                            email: '',
                            password: '',
                            address: '',
                            numberMa: '',
                            numberMi: ''
                        });
                    }}
                >
                    Ajouter un magasin
                </button>

                {showForm && (
                    <MagasinForm
                        newMagasin={newMagasin}
                        handleChange={handleChange}
                        handleAddMagasin={handleAddMagasin}
                        handleEditMagasin={handleEditMagasin}
                        setShowForm={setShowForm}
                        isEditMode={isEditMode}
                    />
                )}

                <MagasinTable
                    magasins={magasins}
                    handleDelete={handleDelete}
                    handleModify={handleModify}
                />

                {!isSearchActive && (
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                )}
            </div>
        </div>
    </div>
);
}

export default Magasins;
