import { useState } from 'react';
import api from '../services/api';

export default function EditVehicleForm({
  vehicle,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    make: vehicle.make || '',
    model: vehicle.model || '',
    year: vehicle.year || '',
    vehicleType: vehicle.vehicleType || '',
    color: vehicle.color || '',
    vin: vehicle.vin || '',
    mileage: vehicle.mileage || '',
    fuelType: vehicle.fuelType || '',
    status: vehicle.status || '',
    price: vehicle.price || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/vehicles/${vehicle._id}`,
        formData
      );

      alert('Vehicle updated successfully');

      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Update failed');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Edit Vehicle</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="Make"
          />

          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
          />

          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
          />

          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Color"
          />

          <input
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            placeholder="Vehicle Type"
          />

          <input
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            placeholder="VIN"
          />

          <input
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="Mileage"
          />

          <input
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            placeholder="Fuel Type"
          />

          <input
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Status"
          />

          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />

          <div style={{ marginTop: '15px' }}>
            <button type="submit">
              Update
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '500px',
  },
};