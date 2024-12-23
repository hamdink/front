import React from 'react';
import Form from '../../Form/Form';
import '../../Form/Form.css';

const DriverForm = ({ 
  newDriver, 
  handleChange, 
  handleAddDriver, 
  handleEditDriver, 
  setShowForm, 
  isEditMode 
}) => {

  const fields = [
    { name: 'last_name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
    { name: 'first_name', label: 'Prénom', type: 'text', placeholder: 'Prénom', colSpan: 1 },
    { name: 'email', label: 'Email Adresse', type: 'email', placeholder: 'E-mail', colSpan: 2 },
    !isEditMode && { name: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Mot de passe', colSpan: 2 }
  ].filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleEditDriver(e);
    } else {
      handleAddDriver(e);
    }
  };

  return (
    <Form 
      formData={newDriver} 
      handleChange={handleChange} 
      handleSubmit={handleSubmit} 
      setShowForm={setShowForm} 
      isEditMode={isEditMode} 
      title={isEditMode ? 'Modifier le Chauffeur' : 'Ajouter un Chauffeur'} 
      fields={fields} 
    />
  );
};

export default DriverForm;
