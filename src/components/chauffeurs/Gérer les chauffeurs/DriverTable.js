import React from 'react';
import Table from '../../Table/Table';

const DriverTable = ({ drivers, handleDelete, handleModify }) => {
    const headers = ["ID", "Nom de chauffeur", "E-mail", "Créé le", "Action"];
    const role = localStorage.getItem('role');
    const renderRow = (driver) => (
        <>
            <td className="py-8 px-4 border-b border-gray-200">{driver._id}</td>
            <td className="py-8 px-4 border-b border-gray-200">{driver.first_name + " " + driver.last_name}</td>
            <td className="py-6 px-4 border-b border-gray-200">{driver.email}</td>
            <td className="py-8 px-4 border-b border-gray-200">
                {`${new Date(driver.created_at).getDate()} ${new Date(driver.created_at).toLocaleString('default', { month: 'short' })} ${new Date(driver.created_at).getFullYear()}`}
            </td>
        </>
    );

    return (
        <Table 
            headers={headers} 
            data={drivers} 
            renderRow={renderRow} 
            handleDelete={handleDelete} 
            handleModify={handleModify} 
            role={role}
        />
    );
};

export default DriverTable;
