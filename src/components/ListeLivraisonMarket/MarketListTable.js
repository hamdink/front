import React from 'react';
import Table from '../Table/Table';
import { Link } from 'react-router-dom';

const MarketListTable = ({ livraisons = [] }) => {  // Default to an empty array if livraisons is undefined
    const headers = ["Numéro", "Client", "Chauffeur", "Magasin", "Date de livraison", "Statut"];
    const role = localStorage.getItem('role');

    const getStatusLabel = (status) => {
        switch (status) {
            case 'En attente':
                return { label: 'En attente', color: 'text-blue-600', circleColor: 'bg-blue-600' };
            case 'À la livraison':
                return { label: 'À la livraison', color: 'text-yellow-600', circleColor: 'bg-yellow-600' };
            case 'Livré':
                return { label: 'Livré', color: 'text-green-600', circleColor: 'bg-green-600' };
            case 'Annulé':
                return { label: 'Annulé', color: 'text-red-600', circleColor: 'bg-red-600' };
            case 'Retardé':
                return { label: 'Retardé', color: 'text-orange-600', circleColor: 'bg-orange-600' };
            default:
                return { label: 'Inconnu', color: 'text-gray-600', circleColor: 'bg-gray-600' };
        }
    };

    const renderRow = (livraison) => {
        const statusInfo = getStatusLabel(livraison.status);
        return (
            <>
                <td className="py-6 px-4 border-b border-gray-200">
                    <Link to={`/invoice/${livraison.NumeroCommande}`}>{"#" + livraison.NumeroCommande}</Link>
                </td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.client?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.driver?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.market?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.Date}</td>
                <td className={`py-6 px-4 border-b border-gray-200 ${statusInfo.color}`}>
                    <div className="inline-flex items-center">
                        <span className={`inline-block w-2.5 h-2.5 mr-2 rounded-full ${statusInfo.circleColor}`}></span>
                        <span>{statusInfo.label}</span>
                    </div>
                </td>
            </>
        );
    };

    return (
        <div className="overflow-x-auto">
            <Table
                headers={headers}
                data={livraisons}
                renderRow={renderRow}
                role={role}
            />
        </div>
    );
}

export default MarketListTable;
