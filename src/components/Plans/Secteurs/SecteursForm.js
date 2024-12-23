import React, { useState, useEffect } from 'react';

const SectureForm = ({ newSecture, handleSaveSecture, setShowForm, isEditMode }) => {
  const [secteur, setSecteur] = useState({ name: '', codesPostaux: [''] });

  useEffect(() => {
    if (isEditMode && newSecture) {
      setSecteur(newSecture);
    }
  }, [newSecture, isEditMode]);

  const addCodePostal = () => {
    setSecteur({
      ...secteur,
      codesPostaux: [...secteur.codesPostaux, ''],
    });
  };

  const removeCodePostal = (index) => {
    const newCodesPostaux = secteur.codesPostaux.filter((_, i) => i !== index);
    setSecteur({ ...secteur, codesPostaux: newCodesPostaux });
  };

  const handleChange = (field, value, index = null) => {
    if (field === 'codesPostaux' && index !== null) {
      const newCodesPostaux = [...secteur.codesPostaux];
      newCodesPostaux[index] = value;
      setSecteur({ ...secteur, codesPostaux: newCodesPostaux });
    } else {
      setSecteur({ ...secteur, [field]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveSecture(secteur);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-1/2 h-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-600 font-custom">
            {isEditMode ? 'Modifier Secteur' : 'Créer Secteur'}
          </h2>
          <button
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl"
            onClick={() => setShowForm(false)}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <input
              type="text"
              value={secteur.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nom de Secteur"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600 mb-2"
            />
            {secteur.codesPostaux.map((codePostal, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={codePostal}
                  onChange={(e) => handleChange('codesPostaux', e.target.value, index)}
                  placeholder="Code Postal"
                  className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                />
                {index === secteur.codesPostaux.length - 1 ? (
                  <button
                    type="button"
                    onClick={addCodePostal}
                    className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
                  >
                    +
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeCodePostal(index)}
                    className="ml-2 bg-red-500 text-white px-3 py-2 rounded-lg"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-12 py-3 rounded-full shadow hover:bg-blue-600 transition">
            {isEditMode ? 'Modifier' : 'Créer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SectureForm;
