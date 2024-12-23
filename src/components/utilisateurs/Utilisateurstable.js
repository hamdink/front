import React, { useMemo } from 'react';
import Table from '../Table/Table';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Utilisateurstable = React.memo(({
  utilisateurs,
  handleDelete,
  handleModify,
}) => {
  const headers = ['Nom', 'Email', 'Role', 'Actions'];
  const role = localStorage.getItem('role');

  const normalizedUtilisateurs = useMemo(() => {
    return utilisateurs.map(utilisateur => {
      const _doc = utilisateur && utilisateur._doc ? utilisateur._doc : {};  // Safely access _doc
      return {
        _id: _doc._id || 'N/A',
        displayName: utilisateur && utilisateur.displayName ? utilisateur.displayName : 'Unnamed User',
        email: _doc.email || 'No Email Provided',
        role: utilisateur && utilisateur.role ? utilisateur.role : 'No Role',
      };
    });
  }, [utilisateurs]);

  const renderRow = (utilisateur) => {
    return (
      <>
        <td className="py-6 px-4 border-b border-gray-200">{utilisateur.displayName}</td>
        <td className="py-6 px-4 border-b border-gray-200">{utilisateur.email}</td>
        <td className="py-6 px-4 border-b border-gray-200">{utilisateur.role}</td>
        <td className="py-6 px-4 border-b border-gray-200 text-center">
          <button
            className="text-blue-500 hover:text-blue-700 transition mx-2"
            onClick={() => handleModify(utilisateur)}
          >
            <FaRegEdit size={18} />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 transition mx-2"
            onClick={() => handleDelete(utilisateur)}
          >
            <FaRegTrashCan size={18} />
          </button>
        </td>
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table
        headers={headers}
        data={normalizedUtilisateurs}
        renderRow={renderRow}
        showModify={false}
        role={role}
      />
    </div>
  );
});

export default Utilisateurstable;
