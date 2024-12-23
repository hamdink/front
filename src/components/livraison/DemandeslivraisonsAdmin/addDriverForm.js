import React, { useState, useEffect, useCallback } from 'react';
import { fetchDrivers } from '../../../api/driverService';
import Form from '../../Form/Form';
import { toast } from 'react-toastify';

const AddDriverForm = ({ livraisonId, handleChange, handleSubmit, setShowForm }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ driver: '' });

    const getDrivers = useCallback(async () => {
        try {
            const data = await fetchDrivers();
            setDrivers(data.drivers);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDrivers();
    }, [getDrivers]);

    const handleLocalChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        handleChange(e);
    };

    const fields = [
        {
            name: 'driver',
            label: 'Driver',
            type: 'dropdown',
            options: drivers.map(driver => ({ value: driver._id, label: driver.first_name })),
            placeholder: 'Select a driver',
            value: formData.driver 
        }
    ];

    const handleSubmitLocal = async (e) => {
        e.preventDefault();
        try {
            await handleSubmit();
            setShowForm(false);
        } catch (error) {
            console.error('Error updating livraison:', error);
        }
    };

    return (
        <Form
            formData={formData}
            handleChange={handleLocalChange}
            handleSubmit={handleSubmitLocal}
            setShowForm={setShowForm}
            title="Assign Driver"
            fields={fields}
            loading={loading}
            error={error}
        />
    );
};

export default AddDriverForm;
