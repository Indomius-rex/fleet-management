import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import VehicleForm from '../components/VehicleForm';
import VehicleList from '../components/VehicleList';

// Dashboard page component for Fleet Management Application
export default function Dashboard() {
  // State to manage user data
  const [user, setUser] = useState(null);

  // State for vehicles statistics
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    reserved: 0,
  });


  // State for search, sort, and pagination
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showForm, setShowForm] = useState(false);

  // Hook to navigate to different routes
  const navigate = useNavigate();

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        fetchStats();
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch vehicle statistics
  const fetchStats = async () => {
    try {
      const response = await api.get('/vehicles?limit=10000');
      const vehicles = response.data.vehicles || [];

      const statsData = {
        total: vehicles.length,
        available: vehicles.filter((v) => v.status === 'Available').length,
        sold: vehicles.filter((v) => v.status === 'Sold').length,
        reserved: vehicles.filter((v) => v.status === 'Reserved').length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Show loading state while user data is being loaded
  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.navTitle}>Fleet Management System</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome back, {user.name}!</h2>
            <p style={styles.welcomeSubtitle}>Manage your fleet efficiently</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div
                style={{
                    ...styles.statIcon,
                    backgroundColor: '#98aebd',
                }}
                >
              📊
            </div>
            <div>
              <p style={styles.statLabel}>Total Vehicles</p>
              <h3 style={styles.statValue}>{stats.total}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
                style={{
                    ...styles.statIcon,
                    backgroundColor: '#05162c',
                }}
                >
              ✓
            </div>
            <div>
              <p style={styles.statLabel}>Available</p>
              <h3 style={{ ...styles.statValue, color: '#4caf50' }}>
                {stats.available}
              </h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
                style={{
                    ...styles.statIcon,
                    backgroundColor: '#98aebd',
                }}
                >
              ⏱️
            </div>
            <div>
              <p style={styles.statLabel}>Reserved</p>
              <h3 style={{ ...styles.statValue, color: '#ff9800' }}>
                {stats.reserved}
              </h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
                style={{
                    ...styles.statIcon,
                    backgroundColor: '#05162c',
                }}
                >
              ✗
            </div>
            <div>
              <p style={styles.statLabel}>Sold</p>
              <h3 style={{ ...styles.statValue, color: '#e91e63' }}>
                {stats.sold}
              </h3>
            </div>
          </div>
        </div>

        {/* Add Vehicle Section */}
        {showForm && (
          <div style={styles.formSection}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>Add New Vehicle</h3>
              <button
                onClick={() => setShowForm(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <VehicleForm onSuccess={() => {
              setShowForm(false);
              fetchStats();
            }} />
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={styles.addVehicleButton}
          >
            + Add New Vehicle
          </button>
        )}

        {/* Vehicle List Section */}
        <div style={styles.listSection}>
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>Vehicle Fleet</h3>
            <div style={styles.controlsContainer}>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by make or model..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={styles.searchInput}
              />

              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="">Sort by...</option>
                <option value="year">Year (Low to High)</option>
                <option value="-year">Year (High to Low)</option>
                <option value="price">Price (Low to High)</option>
                <option value="-price">Price (High to Low)</option>
                <option value="make">Make (A-Z)</option>
              </select>

              {/* Limit Dropdown */}
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                style={styles.sortSelect}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Vehicle List Component */}
          <VehicleList
            search={search}
            sort={sort}
            page={page}
            limit={limit}
            onStatsUpdate={fetchStats}
          />

          {/* Pagination Controls */}
          <div style={styles.paginationContainer}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                ...styles.paginationButton,
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              ← Previous
            </button>
            <span style={styles.pageInfo}>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              style={styles.paginationButton}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modern CSS styling using inline styles
const styles = {
  dashboard: {
      minHeight: '100vh',
    background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: '0',
    boxShadow: '0px 2px 8px #1a1a2e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  welcomeSection: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 5px 0',
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statLabel: {
    margin: '0 0 5px 0',
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    marginBottom: '30px',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  formTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  addVehicleButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'background-color 0.3s',
  },
  listSection: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  listHeader: {
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  listTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  controlsContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '200px',
  },
  sortSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  paginationButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#666',
  },
};
