import React from "react";
import Table from "../Table/Table";
const ClientTable = ({ clients, handleDelete, handleModify }) => {
    const headers = [ "Nom et Prenom", "Adresse de la Livraison","Adresse Alternative","Numéro de Téléphone","Action"];
    const role = localStorage.getItem('role');

    const renderRow = (client) => (
        <>
            <td className="py-8 px-4 border-b border-gray-200">{client.first_name+" "+client.last_name}</td>
            <td className="py-6 px-4 border-b border-gray-200">{client.address1}</td>
            <td className="py-6 px-4 border-b border-gray-200">{client.address2}</td>
            <td className="py-6 px-4 border-b border-gray-200">{client.phone}</td>
        </>
    );

    return (
        <Table 
            headers={headers} 
            data={clients} 
            renderRow={renderRow} 
            handleDelete={handleDelete} 
            handleModify={handleModify} 
            role={role}
        />
    );
}
export default ClientTable;