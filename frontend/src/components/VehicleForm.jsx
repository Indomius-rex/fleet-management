import { useState } from 'react';
import api from '../services/api';

// VehicleForm component for creating new vehicles
export default function VehicleForm({ onSuccess }) {
  // State to manage form data
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vehicleType: '',
    color: '',
    vin: '',
    mileage: '',
    fuelType: '',
    status: 'Available',
    price: '',
  });

  // State to manage success/error messages
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // POST request to create new vehicle
        await api.post('/vehicles', formData);

        setMessage('Vehicle created successfully');
        setIsError(false);

        // Refresh page to update vehicle list
        window.location.reload();

      // Clear form data after successful creation
      setFormData({
        make: '',
        model: '',
        year: '',
        vehicleType: '',
        color: '',
        vin: '',
        mileage: '',
        fuelType: '',
        status: 'Available',
        price: '',
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (error) {
      // Show error message from backend or generic error
      const errorMessage =
        error.response?.data?.message || 'Failed to create vehicle. Please try again.';
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Add New Vehicle</h1>
        <p style={styles.subtitle}>Fill in the vehicle details below</p>

        {/* Display success or error message */}
        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: isError ? '#fee' : '#efe',
              color: isError ? '#c33' : '#3c3',
            }}
          >
            {message}
          </div>
        )}

        {/* Vehicle form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Make input */}
          <div style={styles.formGroup}>
            <label htmlFor="make" style={styles.label}>
              Make
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Enter vehicle make (e.g., Toyota)"
              required
              style={styles.input}
            />
          </div>

          {/* Model input */}
          <div style={styles.formGroup}>
            <label htmlFor="model" style={styles.label}>
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter vehicle model (e.g., Camry)"
              required
              style={styles.input}
            />
          </div>

          {/* Year input */}
          <div style={styles.formGroup}>
            <label htmlFor="year" style={styles.label}>
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter manufacturing year (e.g., 2023)"
              required
              style={styles.input}
            />
          </div>

          {/* Color input */}
          <div style={styles.formGroup}>
            <label htmlFor="color" style={styles.label}>
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter vehicle color (e.g., Blue)"
              required
              style={styles.input}
            />
          </div>

          {/* VIN input */}
          <div style={styles.formGroup}>
            <label htmlFor="vin" style={styles.label}>
              VIN
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="Enter VIN (Vehicle Identification Number)"
              required
              style={styles.input}
            />
          </div>

          {/* Vehicle Type input */}
          <div style={styles.formGroup}>
            <label htmlFor="vehicleType" style={styles.label}>
              Vehicle Type
            </label>
            <input
              type="text"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="Enter vehicle type (e.g., SUV, Sedan)"
              required
              style={styles.input}
            />
          </div>

          {/* Mileage input */}
          <div style={styles.formGroup}>
            <label htmlFor="mileage" style={styles.label}>
              Mileage
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="Enter mileage (in miles/km)"
              required
              style={styles.input}
            />
          </div>

          {/* Fuel Type input */}
          <div style={styles.formGroup}>
            <label htmlFor="fuelType" style={styles.label}>
              Fuel Type
            </label>
            <input
              type="text"
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              placeholder="Enter fuel type (e.g., Gasoline, Diesel)"
              required
              style={styles.input}
            />
          </div>

          {/* Status select */}
          <div style={styles.formGroup}>
            <label htmlFor="status" style={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          {/* Price input */}
          <div style={styles.formGroup}>
            <label htmlFor="price" style={styles.label}>
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter vehicle price"
              required
              style={styles.input}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Creating Vehicle...' : 'Create Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Simple CSS styling using inline styles
const styles = {
  container: {
    padding: '0',
    backgroundColor: 'transparent',
    minHeight: 'auto',
    display: 'block',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: '0',
    boxShadow: 'none',
    padding: '0',
    width: '100%',
    maxWidth: 'none',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'left',
    marginBottom: '0',
  },
  message: {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    marginBottom: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  formGroup: {
    marginBottom: '0',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    gridColumn: '1 / -1',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};
