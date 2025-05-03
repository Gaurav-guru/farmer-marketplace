import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('users'); // Default to users

  const token = localStorage.getItem('token');
  const axiosAuth = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchUsers();
    fetchCrops();
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  // Data fetching functions
  const fetchUsers = async () => {
    try {
      const response = await axiosAuth.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await axiosAuth.get('/api/crops');
      setCrops(response.data);
    } catch (err) {
      setError('Failed to fetch crops');
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axiosAuth.get('/api/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    }
  };

  // Delete handlers
  const deleteUser = async (userId) => {
    try {
      await axiosAuth.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const deleteCrop = async (cropId) => {
    try {
      await axiosAuth.delete(`/api/crops/${cropId}`);
      setCrops(crops.filter(crop => crop.id !== cropId));
    } catch (err) {
      setError('Failed to delete crop');
      console.error(err);
    }
  };

  // Export handlers
  const exportCSV = async () => {
    try {
      const response = await axiosAuth.get('/api/transactions/export/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export CSV');
      console.error(err);
    }
  };

  // const exportPDF = async () => {
  //   try {
  //     const response = await axiosAuth.get('/api/transactions/export/pdf', {
  //       responseType: 'blob'
  //     });
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'transactions.pdf');
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (err) {
  //     setError('Failed to export PDF');
  //     console.error(err);
  //   }
  // };

  return (
    <div className="admin-dashboard">
      <div className="px-4 py-3 container-fluid">
        {/* Enhanced Welcome Banner */}
        <div
          className="p-4 shadow rounded-top d-flex flex-column align-items-center"
          style={{
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            color: 'white',
            minHeight: '120px',
            marginBottom: '0px'
          }}
        >
          <h2 className="mb-2" style={{ fontWeight: 700, letterSpacing: '1px' }}>
            <i className="bi bi-person-badge me-2"></i>
            Welcome, Admin
          </h2>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Manage users, crops, and transactions from one place.
          </div>
        </div>

        {/* Static Navigation Buttons */}
        <div className="gap-3 py-3 admin-nav d-flex justify-content-center" style={{ background: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <button
            className={`btn btn-lg ${activeSection === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveSection('users')}
            style={{ minWidth: '160px', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <i className="bi bi-people-fill me-2"></i>Users
          </button>
          <button
            className={`btn btn-lg ${activeSection === 'crops' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActiveSection('crops')}
            style={{ minWidth: '160px', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <i className="bi bi-tree-fill me-2"></i>Crops
          </button>
          <button
            className={`btn btn-lg ${activeSection === 'transactions' ? 'btn-info text-white' : 'btn-outline-info'}`}
            onClick={() => setActiveSection('transactions')}
            style={{ minWidth: '200px', fontWeight: 600, transition: 'all 0.2s' }}
          >
            <i className="bi bi-cash-stack me-2"></i>Transactions
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-4 bg-white shadow-sm rounded-bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="mb-4 d-flex flex-column align-items-center">
              <div className="mb-3 d-flex justify-content-between align-items-center w-100">
                <h3 className="mb-0 text-primary">
                  <i className="bi bi-people-fill me-2"></i> User Management
                </h3>
              </div>
              <div className="table-responsive" >
                <table className="table mb-0 table-bordered table-hover" style={{ border: '2px solid #dee2e6'  }}>
                  <thead className="table-primary" style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                    <tr>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Name</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Email</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Role</th>
                      <th className="p-3 text-center align-middle" style={{ border: '1px solid #dee2e6' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ backgroundColor: '#f8f9fa' }}>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{u.name}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{u.email}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>
                          <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'farmer' ? 'bg-success' : 'bg-info'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-center align-middle" style={{ border: '1px solid #dee2e6' }}>
                          <button 
                            className="transition-all btn btn-sm btn-outline-danger" 
                            onClick={() => deleteUser(u.id)}
                            title="Delete User"
                            style={{ transition: 'all 0.3s ease' }}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Crops Section */}
          {activeSection === 'crops' && (
            <div className="mb-4 d-flex flex-column align-items-center">
              <div className="mb-3 d-flex justify-content-between align-items-center w-100">
                <h3 className="mb-0 text-success">
                  <i className="bi bi-tree-fill me-2"></i> Crop Management
                </h3>
              </div>
              <div className="table-responsive">
                <table className="table mb-0 table-bordered table-hover" style={{ border: '2px solid #dee2e6' }}>
                  <thead className="table-success" style={{ backgroundColor: '#198754', color: 'white' }}>
                    <tr>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Crop Name</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Quantity</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Price</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Farmer</th>
                      <th className="p-3 text-center align-middle" style={{ border: '1px solid #dee2e6' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crops.map(crop => (
                      <tr key={crop.id} style={{ backgroundColor: '#f8f9fa' }}>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{crop.cropName}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{crop.quantity} kg</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>₹{crop.basePrice}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{crop.farmer.name}</td>
                        <td className="p-3 text-center align-middle" style={{ border: '1px solid #dee2e6' }}>
                          <button 
                            className="transition-all btn btn-sm btn-outline-danger" 
                            onClick={() => deleteCrop(crop.id)}
                            title="Delete Crop"
                            style={{ transition: 'all 0.3s ease' }}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions Section */}
          {activeSection === 'transactions' && (
            <div className="mb-4 d-flex flex-column align-items-center">
              <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center w-100">
                <h3 className="mb-3 text-info mb-md-0">
                  <i className="bi bi-cash-stack me-2"></i> Transaction Records
                </h3>
                {/* <div className="gap-2 d-flex">
                  <button 
                    className="transition-all btn btn-success" 
                    onClick={exportCSV}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <i className="bi bi-file-earmark-excel me-2"></i> Export CSV
                  </button>
                  <button 
                    className="transition-all btn btn-danger" 
                    onClick={exportPDF}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <i className="bi bi-file-earmark-pdf me-2"></i> Export PDF
                  </button>
                </div> */}
              </div>
              <div className="table-responsive">
                <table className="table mb-0 table-bordered table-hover" style={{ border: '2px solid #dee2e6' ,width:'100%', paddingLeft:'10px'}}>
                  <thead className="table-info" style={{ backgroundColor: '#0dcaf0', color: 'white' }}>
                    <tr>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>ID</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Amount</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Payment Status</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Delivery Status</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Buyer</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Farmer</th>
                      <th className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>Crop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id} style={{ backgroundColor: '#f8f9fa' }}>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>#{tx.id}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>₹{tx.amount}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>
                          <span className={`badge ${tx.paymentStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                            {tx.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>
                          <span className={`badge ${tx.deliveryStatus === 'delivered' ? 'bg-success' : 'bg-warning'}`}>
                            {tx.deliveryStatus}
                          </span>
                        </td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{tx.buyer?.name || 'N/A'}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{tx.farmer?.name || 'N/A'}</td>
                        <td className="p-3 align-middle" style={{ border: '1px solid #dee2e6' }}>{tx.crop?.name || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .admin-dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .btn-outline-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .btn-primary:hover, .btn-success:hover, .btn-info:hover, .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .table th {
          font-weight: 600;
        }
        .badge {
          font-size: 0.85em;
          padding: 0.35em 0.65em;
        }
        .admin-nav .btn:focus {
          outline: 2px solid #333;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;