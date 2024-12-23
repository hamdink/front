import React, { useEffect, useState, useCallback } from 'react';
import { fetchByMarketId } from '../../api/livraisonService';
import MarketListTable from './MarketListTable';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
import Dashboard from '../dashboard/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MarketList() {
    const [livraisons, setLivraisons] = useState([]);
    const [filteredLivraisons, setFilteredLivraisons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Retrieve market ID from localStorage
    const marketId = localStorage.getItem('userId');

    const fetchLivraisonsData = useCallback(async () => {
        try {
            const { livraisons = [], totalPages } = await fetchByMarketId(marketId, currentPage);
            setLivraisons(livraisons);
            setTotalPages(totalPages);
            setFilteredLivraisons(livraisons);
        } catch (error) {
            toast.error('Error fetching livraisons');
        }
    }, [marketId, currentPage]);

    useEffect(() => {
        fetchLivraisonsData();
    }, [currentPage, fetchLivraisonsData]);

    const handleSearch = async (searchTerm) => {
        if (searchTerm === '') {
            setFilteredLivraisons(livraisons);
            setIsSearchActive(false);
        } else {
            try {
                // Assuming fetchByMarketId supports search
                const response = await fetchByMarketId(marketId, currentPage, searchTerm);
                setFilteredLivraisons(response.livraisons);
                setIsSearchActive(true);
            } catch (error) {
                toast.error('Error searching livraisons');
            }
        }
    };

    return (
        <div className="flex h-screen">
            <Dashboard />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="container mx-auto p-9 relative mt-20">
                    <ToastContainer />
                    <Search setData={handleSearch} title={"Commandes par Magasin"} />
                    <MarketListTable
                        livraisons={isSearchActive ? filteredLivraisons : livraisons}
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
    
}

export default MarketList;
