import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Table from '../../Table/Table';
import { FaCheck } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';

const DemandeTable = ({ demandes, handleDelete, handleAcceptOrder }) => {
    const headers = ["Référence", "Client", "Chauffeur", "Magasin", "Date de la Livraison", "Statut", "Actions"];
    const role = localStorage.getItem('role');

    const getStatusLabel = (status) => {
        switch (status) {
            case 'En attente':
                return { label: 'En attente', color: 'text-blue-600' };
            case 'À la livraison':
                return { label: 'À la livraison', color: 'text-yellow-600' };
            default:
                return { label: 'Inconnu', color: 'text-gray-600' };
        }
    };

    const renderRow = (demande) => {
        const statusInfo = getStatusLabel(demande.status);
        const formattedDate = new Date(demande.Date).toISOString().split('T')[0]; // Ensure the date is correctly formatted

        return (
            <>
                <td className="py-6 px-4 border-b border-gray-200">
                    {demande.reference}
                </td>
                <td className="py-6 px-4 border-b border-gray-200">{demande.client?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">
                    {demande.driver ? `${demande.driver.first_name} ${demande.driver.last_name}` : 'N/A'}
                </td>
                <td className="py-6 px-4 border-b border-gray-200">{demande.market?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{formattedDate}</td>
                <td className={`py-6 px-4 border-b border-gray-200 ${statusInfo.color}`}>
                    <span className={`w-2 h-2 rounded-full inline-block ${statusInfo.color}`}></span>
                    <span className="font-poppins font-normal text-base leading-6">
                        {statusInfo.label}
                    </span>
                </td>
                <td className="py-6 px-4 border-b border-gray-200">
                    {role === 'admin' && (
                        <div className="flex justify-center space-x-4">
                            <button
                                className="text-blue-500 hover:text-blue-700 transition duration-300"
                                onClick={() => handleAcceptOrder(demande)}
                            >
                                <FaCheck size={20} />
                            </button>
                            <button
                                className="text-red-500 hover:text-red-700 transition duration-300"
                                onClick={() => handleDelete(demande)}
                            >
                                <FaRegTrashCan size={20} />
                            </button>
                        </div>
                    )}
                </td>
            </>
        );
    };

    const filteredDemandes = demandes.filter(demande => demande.status === 'En attente');

    return (
        <Table
            headers={headers}
            data={filteredDemandes}
            renderRow={renderRow}
            role={role}
            showModify={false}
        />
    );
};

export default DemandeTable;
