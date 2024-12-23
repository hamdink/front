import React, { useState, useEffect } from 'react';
import './Form.css';
import img from '../../images/Group3.png';

const Form = ({
  formData,
  handleChange,
  handleSubmit,
  setShowForm,
  isEditMode,
  title,
  fields = [], 
  renderField,
  handleDelete
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isEditMode && formData) {
      fields.forEach(field => {
        if (field.type !== 'file' && formData[field.name] !== undefined) {
          if (formData[field.name] !== (formData[field.name] || '')) {
            console.log(`Updating field ${field.name} with value ${formData[field.name]}`);
            handleChange({ target: { name: field.name, value: formData[field.name] || '' } });
          }
        }
      });
    }
  }, [isEditMode, formData, fields, handleChange]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleChange({ target: { name: 'image', value: base64String } });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      handleDelete();
    }
  };

  const closeModal = () => {
    setShowForm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-white p-10 rounded-2xl shadow-lg w-1/2 h-auto max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-600 font-custom">
            {title}
          </h2>
          <button
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {fields.map((field, index) => {
              if (renderField) {
                return renderField(field, index);
              }
              return (
                <div
                  className={`form-group col-span-${field.colSpan || 2}`}
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                >
                  <label className="block text-blue-700 mb-2" htmlFor={field.name}>{field.label}</label>
                  {field.type === 'file' ? (
                    <div className={`file-upload-container ${isDragging ? 'dragging' : ''}`}>
                      <label htmlFor="file-upload" className="file-upload-label">
                        <div className="file-upload-placeholder">
                          <img src={img} alt="Upload" />
                          <p>Choose a file or drag & drop it here</p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          name={field.name}
                          onChange={handleFileChange}
                        />
                      </label>
                      {imagePreview && (
                        <div className="image-preview-container">
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                        </div>
                      )}
                      <p className="file-upload-hint">JPEG, PNG, PDF, and MP4 formats</p>
                    </div>
                  ) : field.type === 'dropdown' && field.options ? (
                    <select
                      className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                    >
                      <option value="" disabled>{field.placeholder}</option>
                      {field.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-12 py-3 rounded-full shadow hover:bg-blue-600 transition"
              type="submit"
            >
              {isEditMode ? 'Modifier' : 'Créer'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="bg-red-500 text-white px-6 py-3 rounded-full ml-4 shadow hover:bg-red-600 transition"
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

export default Form;
