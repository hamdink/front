import React, { useState, useEffect } from 'react';
import LivraisonForm from './LivraisonForm';
import ClientForm from '../clients/ClientForm';
import { fetchAllClients, addClient } from '../../api/clientService';
import { fetchProductsNoPage } from '../../api/productService';
import { fetchDrivers } from '../../api/driverService';
import { fetchallSectures } from '../../api/sectureService';
import { fetchPlans, decreasePlanTotals } from '../../api/plansService';
import { addLivraison } from '../../api/livraisonService';
import { decreaseMarketTotals } from '../../api/marketService';
import Dashboard from '../dashboard/Dashboard';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io('http://localhost:3001');

const DemandesLivraison = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClientForm, setShowClientForm] = useState(false);
    const [newClient, setNewClient] = useState({
        first_name: '',
        last_name: '',
        address1: '',
        code_postal: '',
        address2: '',
        code_postal2: '',
        phone: ''
    });

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsData, productsData, driversData, secteursData, plansData] = await Promise.all([
                    fetchAllClients(),
                    fetchProductsNoPage(),
                    fetchDrivers(),
                    fetchallSectures(),
                    fetchPlans()
                ]);

                setClients(clientsData);
                setProducts(productsData); 
                setDrivers(driversData);
                setSecteurs(secteursData);
                setPlans(plansData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data', error);
                toast.error('Erreur lors du chargement des données.');
            }
        };

        loadData();
    }, []);

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const addedClient = await addClient(newClient);
            setClients([...clients, addedClient]);
            setShowClientForm(false);
            setNewClient({
                first_name: '',
                last_name: '',
                address1: '',
                code_postal: '',
                address2: '',
                code_postal2: '',
                phone: ''
            });
            socket.emit('statusChange', { id: addedClient._id, status: 'added' });
        } catch (error) {
            console.error('Error adding client', error);
            toast.error('Erreur lors de l\'ajout du client.');
        }
    };

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setNewClient((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validateLivraison = (newLivraison, clients, plans, secteurs) => {
        const extractPostalCode = (address) => {
            const match = address.match(/\d{5}/);
            return match ? parseInt(match[0], 10) : null;
        };
    
        const selectedDate = newLivraison.Date;
        const selectedPeriod = newLivraison.Periode;
        const client = clients.find(client => client._id === newLivraison.client);
        const clientPostalCode = extractPostalCode(client?.code_postal);
        const clientPostalCode2 = extractPostalCode(client?.code_postal2);
    
        let isClientCodePostalValid = false;
        let isClientCodePostal2Valid = false;
        let planExists = false;
    
        for (const plan of plans) {
            if (plan.Date === selectedDate) {
                planExists = true;
    
                if (plan.totalMatin <= 0 && selectedPeriod === 'Matin') {
                    toast.error('Livraison matinale non disponible, attendez 24 heures ou contactez l\'administrateur.');
                    return false;
                }
                if (plan.totalMidi <= 0 && selectedPeriod === 'Midi') {
                    toast.error('Livraison de l\'après-midi non disponible, attendez 24 heures ou contactez l\'administrateur.');
                    return false;
                }
    
                if (selectedPeriod === 'Matin' && plan.secteurMatinal) {
                    isClientCodePostalValid = plan.secteurMatinal.some(secteur => secteur.codesPostaux.includes(clientPostalCode));
                    isClientCodePostal2Valid = plan.secteurMatinal.some(secteur => secteur.codesPostaux.includes(clientPostalCode2));
                } else if (selectedPeriod === 'Midi' && plan.secteurApresMidi) {
                    isClientCodePostalValid = plan.secteurApresMidi.some(secteur => secteur.codesPostaux.includes(clientPostalCode));
                    isClientCodePostal2Valid = plan.secteurApresMidi.some(secteur => secteur.codesPostaux.includes(clientPostalCode2));
                }
            }
        }
    
        if (!planExists) {
            newLivraison.status = 'En attente';
            toast.error('Attendez l\'administrateur.');
            return false;
        } else if (!isClientCodePostalValid && !isClientCodePostal2Valid) {
            toast.error('Le code postal du client ne fait pas partie des secteurs disponibles.');
            newLivraison.status = 'En attente';
            return false;
        } else {
            newLivraison.status = 'En attente';
        }
    
        return true;
    };
    
    const handleLivraisonSubmit = async (newLivraison) => {
        try {
            const fetchedPlans = await fetchPlans();
        
            if (!validateLivraison(newLivraison, clients, fetchedPlans, secteurs)) {
                return;
            }
        
            newLivraison.market = userId;
        
            const selectedPlan = fetchedPlans.find(plan => plan.Date === newLivraison.Date);
            if (!selectedPlan) {
                toast.error('Le plan sélectionné n\'est pas valide.');
                return;
            }
        
            let periodFieldPlan;
            if (newLivraison.Periode === 'Matin') {
                periodFieldPlan = 'totalMatin';
            } else if (newLivraison.Periode === 'Midi') {
                periodFieldPlan = 'totalMidi';
            }
        
            try {
                const { driver, ...payload } = newLivraison;
                const response = await addLivraison(payload);
        
                if (response && response._id) {
                    await decreasePlanTotals(selectedPlan._id, newLivraison.Periode);
                    await decreaseMarketTotals(newLivraison.market, newLivraison.Periode);
        
                    socket.emit('addLivraison', { id: response._id });
                    toast.success('Livraison soumise avec succès!');
                } else {
                    toast.error('Erreur lors de la soumission de la livraison. Réponse inattendue.');
                }
            } catch (error) {
                toast.error('Erreur lors de la soumission de la livraison.');
            }
        } catch (error) {
            toast.error('Erreur lors de la récupération des plans.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-white-100">
            <Dashboard title="Gestion des Livraisons" />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <LivraisonForm
                        clients={clients}
                        products={products}
                        secteurs={secteurs}
                        plans={plans}
                        setShowClientForm={setShowClientForm}
                        validateLivraison={validateLivraison}
                        handleLivraisonSubmit={handleLivraisonSubmit}
                    />
                    {showClientForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-10 rounded-2xl shadow-lg custom-width h-auto max-h-screen overflow-auto">
                                <ClientForm
                                    newClient={newClient}
                                    handleChange={handleClientChange}
                                    handleAddClient={handleAddClient}
                                    setShowForm={setShowClientForm}
                                    isEditMode={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemandesLivraison;
