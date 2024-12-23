import React from 'react';
import Table from '../../Table/Table';
import './SectureTable.css';
const SectureTable = ({ sectures, handleDelete, handleModify }) => {
    const header = ["Nom de Secture", "Codes Postaux", "Action"];
    const role = localStorage.getItem('role');

    const renderRow = (secture) => (
        <>
            <td className="py-2 px-4 border-b border-gray-200 centered-cell">{secture.name}</td>
            <td className="py-3 px-5 border-b border-gray-300 centered-cell">
                <ul className="list-none p-0 m-0 postal-code-list">
                    {secture.codesPostaux
                        .filter(code => code !== 0)
                        .map((code, index) => (
                            <li key={index} className="postal-code-item">
                                <span className="bullet">•</span>
                                <span className="fixed-width">{code}</span>
                            </li>
                        ))}
                </ul>
            </td>
        </>
    );

    return (
        <Table 
            headers={header} 
            data={sectures} 
            renderRow={renderRow} 
            handleDelete={handleDelete} 
            handleModify={handleModify} 
            role={role} 
        />
    );
}

export default SectureTable;
