// Clients.js
import React, { useCallback, useEffect, useState } from "react";
import { addClient, deleteClient, fetchClients, modifyClient, searchClients } from "../../api/clientService";
import Pagination from "../Pagination/Pagination";
import Dashboard from "../dashboard/Dashboard";
import Search from "../searchbar/Search";
import ClientForm from "./ClientForm";
import ClientTable from "./ClientTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    address1: '',
    code_postal: '',
    address2: '',
    code_postal2: '',
    phone: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // useEffect(() => {
  //   fetchClientsData();
  // }, [currentPage]);

  // const fetchClientsData = async () => {
  //   try {
  //     const data = await fetchClients(currentPage);
  //     setClients(data.clients);
  //     setFilteredClients(data.clients);
  //     setTotalPages(data.totalPages); // Set the total pages
  //   } catch (error) {
  //     console.error('Error fetching clients', error);
  //   }
  // };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client?')) {
      try {
        await deleteClient(id);
        // fetchClientsData();
        toast.success('Client supprimé avec succès!');
      } catch (error) {
        console.error('Error deleting client', error);
        toast.error('Erreur lors de la suppression du client.');
      }
    }
  };

  const handleModify = (client) => {
    setCurrentClient(client);
    setNewClient(client);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditClient = async (e) => {
    e.preventDefault();
    try {
      await modifyClient(newClient);
      // fetchClientsData();
      setShowForm(false);
      toast.success('Client modifié avec succès!');
    } catch (error) {
      console.error('Error modifying client', error);
      toast.error('Erreur lors de la modification du client.');
    }
  };

  const handleSearch = async (searchTerm) => {
    if (searchTerm) {
      setIsSearchActive(true);
      const data = await searchClients(searchTerm);
      setFilteredClients(data);
    } else {
      setIsSearchActive(false);
      setFilteredClients(clients);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await addClient(newClient);
      // fetchClientsData();
      setShowForm(false);
      toast.success('Client ajouté avec succès!');
    } catch (error) {
      console.error('Error adding client', error);
      toast.error('Erreur lors de l\'ajout du client.');
    }
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewClient(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  return (
    <div className="flex h-screen">
      <Dashboard />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="container mx-auto p-9 relative mt-20">
          <ToastContainer />
          <Search setData={handleSearch} title={"Tous les clients"} />
          <button
            className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
            onClick={() => {
              setShowForm(true);
              setIsEditMode(false);
              setNewClient({
                first_name: '',
                last_name: '',
                address1: '',
                code_postal: '',
                address2: '',
                code_postal2: '',
                phone: ''
              });
            }}
          >
            Ajouter un client
          </button>
          {showForm && (
            <ClientForm
              newClient={newClient}
              handleChange={handleChange}
              handleAddClient={handleAddClient}
              handleEditClient={handleEditClient}
              setShowForm={setShowForm}
              isEditMode={isEditMode}
            />
          )}
          <ClientTable 
            clients={isSearchActive ? filteredClients : clients} 
            handleDelete={handleDelete} 
            handleModify={handleModify} 
          />
          {!isSearchActive && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );

};

export default Clients;
