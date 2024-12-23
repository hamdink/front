import React, { useEffect, useState } from 'react';
import '../Form/Form.css';

const PlanForm = ({
  newPlan = {
    Date: '',
    secteurMatinal: [],
    secteurApresMidi: [],
    totalMatin: '',
    totalMidi: '',
    notes: ''
  },
  handleChange,
  handleAddPlan,
  handleEditPlan,
  handleDeletePlan,
  setShowForm,
  isEditMode,
  secteurs,
}) => {
  const [tempSecteurMatinal, setTempSecteurMatinal] = useState('');
  const [tempSecteurApresMidi, setTempSecteurApresMidi] = useState('');

  useEffect(() => {
    if (isEditMode && newPlan.Date) {
      const localDate = new Date(newPlan.Date);
      const timezoneOffset = localDate.getTimezoneOffset() * 60000;
      const formattedDate = new Date(localDate.getTime() - timezoneOffset).toISOString().split('T')[0];
      if (newPlan.Date !== formattedDate) {
        handleChange({ target: { name: 'Date', value: formattedDate } });
      }
    }
  }, [isEditMode, newPlan.Date, handleChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      (!newPlan.secteurMatinal || newPlan.secteurMatinal.length === 0) &&
      (!newPlan.secteurApresMidi || newPlan.secteurApresMidi.length === 0)
    ) {
      alert('Veuillez sélectionner au moins un Secteur Matinal ou Secteur Après Midi.');
      return;
    }

    if (!newPlan.Date) {
      alert('Veuillez sélectionner une date de livraison.');
      return;
    }

    // Validate totalMatin and totalMidi
    const totalMatin = parseInt(newPlan.totalMatin, 10);
    const totalMidi = parseInt(newPlan.totalMidi, 10);

    if (
      isNaN(totalMatin) ||
      totalMatin < 0 ||
      totalMatin > 99999 ||
      isNaN(totalMidi) ||
      totalMidi < 0 ||
      totalMidi > 99999
    ) {
      alert('Veuillez entrer des valeurs valides pour Total Matin et Total Après Midi (entre 0 et 99999).');
      return;
    }

    const localDate = new Date(newPlan.Date);
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate.getTime() - timezoneOffset).toISOString().split('T')[0];

    const updatedPlan = {
      ...newPlan,
      Date: adjustedDate,
      secteurMatinal:
        newPlan.secteurMatinal?.filter(Boolean).map((item) => item._id || item) || [],
      secteurApresMidi:
        newPlan.secteurApresMidi?.filter(Boolean).map((item) => item._id || item) || [],
      totalMatin,
      totalMidi,
      notes: newPlan.notes || '',
    };

    try {
      if (isEditMode) {
        await handleEditPlan(newPlan._id.toString(), updatedPlan);
      } else {
        await handleAddPlan(updatedPlan);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting plan:', error);
      alert('Une erreur est survenue lors de la soumission du plan. Veuillez réessayer.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      try {
        await handleDeletePlan(newPlan._id.toString());
        setShowForm(false);
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Une erreur est survenue lors de la suppression du plan. Veuillez réessayer.');
      }
    }
  };

  const handleClearField = (fieldName, index = null) => {
    if (Array.isArray(newPlan[fieldName])) {
      const newArray = [...newPlan[fieldName]];
      newArray.splice(index, 1);
      handleChange({ target: { name: fieldName, value: newArray } });
    } else {
      handleChange({ target: { name: fieldName, value: '' } });
    }
  };

  const handleAddField = (fieldName, valueToAdd) => {
    if (valueToAdd) {
      const updatedArray = [...(newPlan[fieldName] || []), valueToAdd];
      handleChange({ target: { name: fieldName, value: updatedArray } });
      if (fieldName === 'secteurMatinal') setTempSecteurMatinal('');
      else setTempSecteurApresMidi('');
    }
  };

  const filterOptions = (selectedValues) => {
    return secteurs.filter(
      (secteur) => !selectedValues.some((selected) => selected._id === secteur._id)
    );
  };

  const renderArrayField = (field) => {
    const selectedValues = newPlan[field.name] || [];
    const options = filterOptions(selectedValues);

    return (
      <div className={`form-group col-span-${field.colSpan || 1}`} key={field.name}>
        <label className="block text-blue-700 mb-1 text-sm">{field.label}</label>
        {selectedValues.map((item, idx) => (
          <div className="flex items-center mb-1" key={idx}>
            <select
              className="border rounded w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
              name={`${field.name}_${idx}`}
              value={item._id || ''}
              onChange={(e) => {
                const updatedArray = [...newPlan[field.name]];
                updatedArray[idx] = secteurs.find(
                  (secteur) => secteur._id === e.target.value
                );
                handleChange({ target: { name: field.name, value: updatedArray } });
              }}
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {[item, ...options].map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="ml-2 text-red-500"
              onClick={() => handleClearField(field.name, idx)}
            >
              &times;
            </button>
          </div>
        ))}
        <div className="flex items-center">
          <select
            className="border rounded w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            value={
              field.name === 'secteurMatinal' ? tempSecteurMatinal : tempSecteurApresMidi
            }
            onChange={(e) => {
              const selectedSecteur = secteurs.find(
                (secteur) => secteur._id === e.target.value
              );
              handleAddField(field.name, selectedSecteur);
            }}
          >
            <option value="" disabled>
              {field.placeholder}
            </option>
            {options.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const fields = [
    {
      name: 'Date',
      label: 'Date de la livraison *',
      type: 'date',
      placeholder: 'Date de la livraison',
      colSpan: 2, // Takes full row
      value: newPlan.Date || '',
    },
    {
      name: 'secteurMatinal',
      label: 'Secteurs Matinal *',
      type: 'arrayDropdown',
      placeholder: 'Sélectionnez un Secteur Matinal',
      colSpan: 1, // Takes half row
      options: secteurs.map((sector) => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteurMatinal || [],
    },
    {
      name: 'secteurApresMidi',
      label: 'Secteurs Après Midi *',
      type: 'arrayDropdown',
      placeholder: 'Sélectionnez un Secteur Après Midi',
      colSpan: 1, // Takes half row
      options: secteurs.map((sector) => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteurApresMidi || [],
    },
    {
      name: 'totalMatin',
      label: 'Total Matin *',
      type: 'number',
      placeholder: 'Total Matin',
      colSpan: 1, // Takes half row
      value: newPlan.totalMatin ?? '',
      min: 0,
      max: 99999,
    },
    {
      name: 'totalMidi',
      label: 'Total Après Midi *',
      type: 'number',
      placeholder: 'Total Après Midi',
      colSpan: 1, // Takes half row
      value: newPlan.totalMidi ?? '',
      min: 0,
      max: 99999,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Ajoutez vos notes ici...',
      colSpan: 2, // Takes full row
      value: newPlan.notes || '',
    },
  ];

  const renderField = (field, index) => {
    if (field.type === 'arrayDropdown') {
      return renderArrayField(field, index);
    }

    return (
      <div className={`form-group col-span-${field.colSpan || 2}`} key={index}>
        <label className="block text-blue-700 mb-1 text-sm" htmlFor={field.name}>
          {field.label}
        </label>
        {field.type === 'textarea' ? (
          <textarea
            className="border rounded w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            name={field.name}
            value={newPlan[field.name] || ''}
            onChange={(e) => handleChange(e)}
            placeholder={field.placeholder}
            style={{ height: '60px' }}
          ></textarea>
        ) : (
          <div className="flex items-center">
            <input
              className="border rounded w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
              type={field.type}
              name={field.name}
              value={newPlan[field.name] ?? ''}
              onChange={(e) => handleChange(e)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              style={{ fontSize: '14px' }}
            />
            {newPlan[field.name] !== '' && (
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleClearField(field.name)}
              >
                &times;
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-lg w-full max-w-5xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600">
            {isEditMode ? 'Modifier le Plan' : 'Ajouter un Plan'}
          </h2>
          <button
            className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl"
            onClick={() => setShowForm(false)}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(renderField)}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white px-8 py-2 rounded-full shadow hover:bg-blue-600 transition text-sm"
              type="submit"
            >
              {isEditMode ? 'Modifier' : 'Créer'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-full ml-4 shadow hover:bg-red-600 transition text-sm"
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;
