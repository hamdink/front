import React from 'react';
import Table from '../Table/Table';
const MagasinTable = ({ magasins, handleDelete, handleModify }) => {
    const headers = [ "Nom et Prenom", "Email","Adresse","Créé le","Action"];
    const role = localStorage.getItem('role');
    const renderRow = (magasin) => (
        <>
            <td className="py-8 px-4 border-b border-gray-200">{magasin.first_name+" "+magasin.last_name}</td>
            <td className="py-6 px-4 border-b border-gray-200">{magasin.email}</td>
            <td className="py-6 px-4 border-b border-gray-200">{magasin.address}</td>
            <td className="py-6 px-4 border-b border-gray-200">  {`${new Date(magasin.created_at).getDate()} ${new Date(magasin.created_at).toLocaleString('default', { month: 'short' })} ${new Date(magasin.created_at).getFullYear()}`}
            </td>
        </>
    );

    return (
        <Table 
            headers={headers} 
            data={magasins} 
            renderRow={renderRow} 
            handleDelete={handleDelete} 
            handleModify={handleModify} 
            role={role}
        />
    );
}
export default MagasinTable;