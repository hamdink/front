import React from "react";
import Table from "../Table/Table";

const ProuditsTable = ({ produits, handleDelete, handleModify }) => {
  const role = localStorage.getItem('role');
  const headers = ["Image", "Nom de produit", "Description", "Prix"];
  
  if (role === 'admin') {
    headers.push("Action");
  }

  const renderRow = (produit) => (
    <>
      <td className="py-6 px-4 border-b border-gray-200">
        {produit.image ? (
          <img
            src={produit.image}
            alt={produit.name}
            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
            className="rounded-lg"
          />
        ) : "-"}
      </td>
      <td className="py-6 px-4 border-b border-gray-200">{produit.name}</td>
      <td className="py-6 px-4 border-b border-gray-200">{produit.description}</td>
      <td className="py-6 px-4 border-b border-gray-200">{produit.price}€</td>
    </>
  );

  return (
    <Table
      headers={headers}
      data={produits}
      renderRow={renderRow}
      handleDelete={handleDelete}
      handleModify={handleModify}
      role={role} 
    />
  );
}

export default ProuditsTable;
