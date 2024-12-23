import React, { useState, useEffect, useCallback } from 'react';
import { deleteLivraison, updateStatus, findByStatus } from '../../../api/livraisonService';
import DemandeTable from './DemandeTable';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import Pagination from '../../Pagination/Pagination';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3001');

function Demandes() {
    const [demandes, setDemandes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredDemandes, setFilteredDemandes] = useState([]);

    const loadData = useCallback(async (page) => {
        try {
            const response = await findByStatus('En attente');
            const pendingDemandes = response.length > 0 ? response : [];
            setDemandes(pendingDemandes);
            setTotalPages(Math.ceil(pendingDemandes.length / 10));
        } catch (error) {
            console.error('Error loading data', error);
        }
    }, []);

    useEffect(() => {
        loadData(currentPage);
    
        socket.on('statusChange', () => loadData(currentPage));
        socket.on('addLivraison', () => loadData(currentPage));
    
        // Listen to new pending deliveries
        socket.on('newPendingLivraison', () => loadData(currentPage));
    
        return () => {
            socket.off('statusChange', () => loadData(currentPage));
            socket.off('addLivraison', () => loadData(currentPage));
            socket.off('newPendingLivraison');
        };
    }, [currentPage, loadData]);
    
    const handleDelete = async (demande) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?");
        if (confirmed) {
            try {
                console.log('Deleting livraison with ID:', demande._id);  // This should log the correct ID
                await deleteLivraison(demande._id);  // Pass only the _id, not the whole object
                socket.emit('statusChange', { id: demande._id, status: 'deleted' });
                toast.success('Demande supprimée avec succès!', { toastId: 'delete1' });
                loadData(currentPage);
            } catch (error) {
                console.error('Error deleting demande', error);
                toast.error('Erreur lors de la suppression de la demande.');
            }
        }
    };
    
    

    const handleAcceptOrder = async (demande) => {
        if (!demande.driver) {
            toast.error("Veuillez d'abord assigner un chauffeur dans la fiche de route.", { toastId: 'noDriver' });
            return;
        }
    
        const confirmed = window.confirm("Voulez-vous accepter cette commande ?");
        if (confirmed) {
            try {
                await updateStatus(demande._id, 'À la livraison');
                socket.emit('statusChange', { id: demande._id, status: 'À la livraison' });
                toast.success('Commande acceptée avec succès!', { toastId: 'accept1' });
                loadData(currentPage);
            } catch (error) {
                console.error('Error updating livraison:', error);
                toast.error('Erreur lors de l\'acceptation de la commande.');
            }
        }
    };
    

    const handleSearch = useCallback((searchTerm) => {
        setSearchTerm(searchTerm);
        setIsSearchActive(true);
        setCurrentPage(1);
    }, []);

    const handlePaginationChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setIsSearchActive(false);
            return;
        }
        const filteredData = demandes.filter((demande) => demande.reference.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredDemandes(filteredData);
        setTotalPages(Math.ceil(filteredData.length / 10));
    }, [searchTerm, demandes]);

    const currentData = isSearchActive
        ? filteredDemandes.slice((currentPage - 1) * 10, currentPage * 10)
        : demandes.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div className="flex h-screen">
            <Dashboard />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="container mx-auto p-9 relative mt-20">
                    <ToastContainer />
                    <Search setData={handleSearch} title="Toutes les demandes de livraison" />
                    <DemandeTable
                        demandes={currentData}
                        handleDelete={handleDelete}
                        handleAcceptOrder={handleAcceptOrder}
                    />
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={handlePaginationChange}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    );
}

export default Demandes;
