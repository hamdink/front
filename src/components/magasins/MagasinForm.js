import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMagasin, modifyMagasin } from '../../redux/reducers/magasinReducer';
import Form from '../Form/Form';
import AddressAutocomplete from '../googleAutoComplete/AddressAutocomplete';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Form/Form.css';

const MagasinForm = ({
  newMagasin,
  handleChange,
  setShowForm,
  isEditMode,
}) => {
  const dispatch = useDispatch();
  const [addressData, setAddressData] = useState({
    address: newMagasin.address || '',
    codePostal: newMagasin.codePostal || ''
  });

  useEffect(() => {
    // Initialize addressData with the current values when editing
    if (isEditMode && newMagasin.address && newMagasin.codePostal) {
      setAddressData({
        address: newMagasin.address,
        codePostal: newMagasin.codePostal
      });
    }
  }, [isEditMode, newMagasin]);

  const fields = [
    { name: 'first_name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
    { name: 'last_name', label: 'Prenom', type: 'text', placeholder: 'Prenom', colSpan: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 2 },
    !isEditMode && { name: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Mot de passe', colSpan: 2 },
    { name: 'address', label: 'Adresse', type: 'autocomplete', placeholder: 'Adresse', colSpan: 2 },
    { name: 'numberMa', label: 'Nombre des commandes du matin', type: 'number', placeholder: 'Nombre des commandes du matin', colSpan: 2 },
    { name: 'numberMi', label: 'Nombre des commandes du midi', type: 'number', placeholder: 'Nombre des commandes du midi', colSpan: 2 },
  ].filter(Boolean);

  const handleAddressChange = (addressData) => {
    if (addressData && addressData.address && addressData.codePostal) {
      setAddressData({
        address: addressData.address,
        codePostal: addressData.codePostal
      });
      handleChange({
        target: {
          name: 'address',
          value: addressData.address,
        }
      });
    } else {
      toast.error('Please select an address with a postal code.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const magasinData = {
      ...newMagasin,
      address: addressData.address,
      codePostal: addressData.codePostal
    };

    if (isEditMode) {
      await dispatch(modifyMagasin({ id: newMagasin._id, data: magasinData }));
      toast.success('Magasin modifié avec succès!');
    } else {
      const resultAction = await dispatch(addMagasin(magasinData));
      if (addMagasin.fulfilled.match(resultAction)) {
        toast.success('Magasin ajouté avec succès!');
      }
    }
    setShowForm(false);
  };

  return (
    <Form
      formData={newMagasin}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setShowForm={setShowForm}
      fields={fields}
      title={isEditMode ? 'Modifier le Magasin' : 'Ajouter un Magasin'}
      renderField={(field) => {
        if (field.type === 'autocomplete') {
          return (
            <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <AddressAutocomplete
                value={addressData.address}
                onChange={handleAddressChange}
              />
            </div>
          );
        }
        return (
          <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={newMagasin[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete='off'
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            />
          </div>
        );
      }}
    />
  );
};

export default MagasinForm;
