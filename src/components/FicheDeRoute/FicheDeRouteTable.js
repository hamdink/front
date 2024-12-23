import React from 'react';
import Table from '../Table/Table';
import { FaUserPlus, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FicheDeRouteTable = ({ livraisons, handleAssignDriver ,handleViewDetails}) => {
  const headers = ['Numero Commande', 'Référence', 'Client', 'Driver', 'Status', 'Date', 'Action'];
  const role = localStorage.getItem('role');

  const renderRow = (livraison) => (
    <>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.NumeroCommande}</td>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.reference}</td>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.client ? livraison.client.first_name : 'No client info'}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        {livraison.driver ? livraison.driver.first_name : 'No driver assigned'}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        {livraison.status}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.Date ? new Date(livraison.Date).toLocaleDateString() : 'No date info'}</td>

      <td className="py-2 px-4 border-b border-gray-200 text-center">
        {livraison.driver ? (
          <div className="flex justify-center items-center h-full">
            <Link to={`/route-sheet/driver/${livraison.driver._id}/date/${livraison.Date}`} className="flex items-center justify-center">
              <FaEye className="text-blue-500 hover:text-blue-700" size={20} />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <button onClick={() => handleAssignDriver(livraison)} className="flex items-center justify-center">
              <FaUserPlus className="text-blue-500 hover:text-blue-700" size={20} />
            </button>
          </div>
        )}
      </td>
      
    </>
  );

  return (
    <Table
      headers={headers}
      data={livraisons}
      renderRow={renderRow}
      role={role}
      showModify={false}
      showDelete={false}
      showThirdAction={true}
      ThirdIcon={FaEye}
      handleThirdAction={handleViewDetails}
    />
  );
};

export default FicheDeRouteTable;
