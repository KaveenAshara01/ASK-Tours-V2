import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PackageForm from '../components/PackageForm';
import PackageList from '../components/PackageList';

function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPackages();
  }, [navigate]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPackages();
    } catch (error) {
      alert('Error deleting package');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPackage(null);
    fetchPackages();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPackage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Ameliya Safari Admin</h1>
            <div className="flex gap-4">
              <a
                href="/"
                target="_blank"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                + Add New Package
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <PackageList
                packages={packages}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        ) : (
          <PackageForm
            package={editingPackage}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;

