import { useState, useEffect } from 'react';
import api from '../services/api';
import EditVehicleForm from './EditVehicleForm';


// VehicleList component for displaying all vehicles with search, sort, and pagination
export default function VehicleList({ search = '', sort = '', page = 1, limit = 10, onStatsUpdate }) {
  // State to manage vehicles data
  const [vehicles, setVehicles] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);

  // State to manage error state
  const [error, setError] = useState('');

  // State for pagination info
  const [paginationInfo, setPaginationInfo] = useState({
    totalVehicles: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // Fetch vehicles whenever search, sort, page, or limit changes
  useEffect(() => {
    fetchVehicles();
  }, [search, sort, page, limit]);

  // Function to fetch vehicles from API with filters
  const fetchVehicles = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Build query parameters
      let query = `/vehicles?page=${page}&limit=${limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (sort) query += `&sort=${sort}`;

      // GET request to fetch vehicles with filters
      const response = await api.get(query);
      setVehicles(response.data.vehicles);
      setPaginationInfo({
        totalVehicles: response.data.totalVehicles,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
    } catch (err) {
      // Handle error
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch vehicles. Please try again.';
      setError(errorMessage);
      console.error('Fetch vehicles error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badgeStyles = {
      Available: { backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: '600' },
      Sold: { backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: '600' },
      Reserved: { backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', fontWeight: '600' },
    };
    return badgeStyles[status] || badgeStyles.Available;
  };

  // Handle edit vehicle
    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

  // Handle delete vehicle
  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        // DELETE request to delete vehicle
        await api.delete(`/vehicles/${vehicleId}`);
        // Refresh vehicle list after deletion
        fetchVehicles();
        // Update statistics
        if (onStatsUpdate) onStatsUpdate();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to delete vehicle. Please try again.';
        setError(errorMessage);
        console.error('Delete vehicle error:', err.message);
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>{error}</div>
        <button onClick={fetchVehicles} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {vehicles.length === 0 ? (
        <p style={styles.noDataMessage}>No vehicles found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.headerCell}>Make</th>
                <th style={styles.headerCell}>Model</th>
                <th style={styles.headerCell}>Year</th>
                <th style={styles.headerCell}>Type</th>
                <th style={styles.headerCell}>Color</th>
                <th style={styles.headerCell}>VIN</th>
                <th style={styles.headerCell}>Mileage</th>
                <th style={styles.headerCell}>Fuel</th>
                <th style={styles.headerCell}>Price</th>
                <th style={styles.headerCell}>Status</th>
                <th style={styles.headerCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id} style={styles.bodyRow}>
                  <td style={styles.cell}>{vehicle.make}</td>
                  <td style={styles.cell}>{vehicle.model}</td>
                  <td style={styles.cell}>{vehicle.year}</td>
                  <td style={styles.cell}>{vehicle.vehicleType}</td>
                  <td style={styles.cell}>{vehicle.color}</td>
                  <td style={styles.cell}>{vehicle.vin}</td>
                  <td style={styles.cell}>{vehicle.mileage}</td>
                  <td style={styles.cell}>{vehicle.fuelType}</td>
                  <td style={styles.cell}>${vehicle.price ? vehicle.price.toLocaleString(): 'N/A'}</td>
                  <td style={styles.cell}>
                    <span style={getStatusBadge(vehicle.status)}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td style={styles.actionsCell}>
                    <button 
                      onClick={() => handleEdit(vehicle)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
            {selectedVehicle && (
        <EditVehicleForm
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            onUpdate={fetchVehicles}
        />
        )}
    </div>
  );
}

// Modern CSS styling using inline styles
const styles = {
  container: {
    width: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  headerRow: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #e0e0e0',
  },
  headerCell: {
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#1a1a2e',
    fontSize: '13px',
    textTransform: 'uppercase',
  },
  bodyRow: {
    borderBottom: '1px solid #e0e0e0',
    transition: 'background-color 0.2s',
  },
  cell: {
    padding: '12px 15px',
    color: '#555',
    fontSize: '14px',
  },
  actionsCell: {
    padding: '12px 15px',
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    padding: '20px',
  },
  errorMessage: {
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    fontSize: '14px',
    marginBottom: '15px',
  },
  retryButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '14px',
    color: '#999',
  },
};
        
