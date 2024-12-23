import React from 'react';
import Form from '../Form/Form';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the default style
import '../Form/Form.css';
import AddressAutocomplete from '../googleAutoComplete/AddressAutocomplete'; // Adjust the import path as needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientForm = ({
  newClient,
  handleChange,
  handleAddClient,
  handleEditClient,
  setShowForm,
  isEditMode,
}) => {
  const fields = [
    { name: 'first_name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
    { name: 'last_name', label: 'Prenom', type: 'text', placeholder: 'Prenom', colSpan: 1 },
    { name: 'address1', label: 'Adresse de la Livraison', type: 'autocomplete', placeholder: 'Adresse de la Livraison', colSpan: 2 },
    { name: 'address2', label: 'Adresse Alternative', type: 'autocomplete', placeholder: 'Adresse Alternative', colSpan: 2 },
    { name: 'phone', label: 'Phone', type: 'phone', placeholder: 'Phone', colSpan: 2 },
  ].filter(Boolean);

  const handlePhoneChange = (value) => {
    handleChange({ target: { name: 'phone', value } });
  };

  const handleAddressChange = (name, addressData) => {
    if (addressData && addressData.address && addressData.codePostal) {
      handleChange({ target: { name, value: addressData.address } });
      if (name === 'address1') {
        handleChange({ target: { name: 'code_postal', value: addressData.codePostal } });
      } else if (name === 'address2') {
        handleChange({ target: { name: 'code_postal2', value: addressData.codePostal } });
      }
    } else {
      console.error("Invalid address data:", addressData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(newClient.phone)) {
      toast.error("Invalid phone number");
      return;
    }
    if (isEditMode) {
      handleEditClient(e);
    } else {
      handleAddClient(e);
    }
  };

  return (
    <Form
      formData={newClient}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setShowForm={setShowForm}
      fields={fields}
      title={isEditMode ? 'Modifier le Client' : 'Ajouter un Client'}
      renderField={(field, index) => {
        if (field.type === 'phone') {
          return (
            <div className={`form-group col-span-${field.colSpan}`} key={index}>
              <label htmlFor={field.name} className="phone-input-label">{field.label}</label>
              <div className="phone-input-container">
                <PhoneInput
                  international
                  defaultCountry="FR"
                  value={newClient[field.name]}
                  onChange={handlePhoneChange}
                  className="phone-input"
                />
              </div>
            </div>
          );
        } else if (field.type === 'autocomplete') {
          return (
            <div className={`form-group col-span-${field.colSpan}`} key={index}>
              <label htmlFor={field.name} className="block text-blue-700 mb-2">{field.label}</label>
              <AddressAutocomplete
                value={newClient[field.name]}
                onChange={(addressData) => handleAddressChange(field.name, addressData)}
              />
            </div>
          );
        }
        return (
          <div className={`form-group col-span-${field.colSpan}`} key={index}>
            <label htmlFor={field.name} className="block text-blue-700 mb-2">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={newClient[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            />
          </div>
        );
      }}
    />
  );
};

export default ClientForm;
