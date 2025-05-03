import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [bidsByCrop, setBidsByCrop] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [newCrop, setNewCrop] = useState({
    cropName: '',
    quantity: '',
    basePrice: '',
    location: '',
    expectedHarvestDate: '',
  });
  const [activeSection, setActiveSection] = useState('crops');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const cropsPerPage = 6;

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchCrops = async () => {
    try {
      const res = await axios.get('http://localhost:8080/farmer/crops', { headers });
      setCrops(res.data);
    } catch (err) {
      console.error('Error fetching crops:', err);
    }
  };

  const fetchBidsForCrop = async (cropId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/bids/crop/${cropId}`, { headers });
      setBidsByCrop((prev) => ({ ...prev, [cropId]: res.data }));
    } catch (err) {
      console.error(`Error fetching bids for crop ${cropId}:`, err);
    }
  };

  const handleAddCrop = async () => {
    try {
      await axios.post('http://localhost:8080/farmer/crops', newCrop, { headers });
      setNewCrop({
        cropName: '',
        quantity: '',
        basePrice: '',
        location: '',
        expectedHarvestDate: '',
      });
      fetchCrops();
    } catch (err) {
      console.error('Error adding crop:', err);
    }
  };

  const handleAcceptBid = async (bidId, cropId) => {
    try {
      await axios.post(`http://localhost:8080/farmer/accept-bid/${bidId}`, {}, { headers });
      alert('Bid accepted and transaction created!');
      fetchCrops();
      fetchBidsForCrop(cropId);
      fetchTransactions();
    } catch (err) {
      console.error('Error accepting bid:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/transactions/farmer', { headers });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleDeliveryStatus = async (txnId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/transactions/${txnId}/delivery-status?status=${status}`,
        {},
        { headers }
      );
      alert(`Delivery status updated to ${status}`);
      fetchTransactions();
    } catch (err) {
      console.error('Error updating delivery status:', err);
    }
  };

  useEffect(() => {
    fetchCrops();
    fetchTransactions();
  }, []);

  // Pagination Logic
  const indexOfLastCrop = currentPage * cropsPerPage;
  const indexOfFirstCrop = indexOfLastCrop - cropsPerPage;
  const currentCrops = crops.slice(indexOfFirstCrop, indexOfLastCrop);
  const totalPages = Math.ceil(crops.length / cropsPerPage);

  return (
    <div className="container p-4 mt-4" style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginTop: '20px' }}>
      <h2 style={{ marginTop: '10px', marginBottom: '10px' }}>Farmer Dashboard</h2>

      {/* Navigation Buttons */}
      <div className="mb-4">
        <button
          className="btn btn-primary me-2" style={{ marginRight: "5px",border: '2px solid #007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}
          onClick={() => setActiveSection('crops')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Add Crops
        </button>
        <button
          className="btn btn-primary me-2"style={{ marginRight: "5px",border: '2px solid #007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}
          onClick={() => setActiveSection('bids')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Your Crops & Bids
        </button>
        <button
          className="btn btn-primary" style={{ marginRight: "5px",border: '2px solid #007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}
          onClick={() => setActiveSection('transactions')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Your Transactions
        </button>
      </div>

      {/* Add New Crop Section */}
      {activeSection === 'crops' && (
        <div className="p-3 mb-4 card">
          <h4>Add New Crop</h4>
          <input
            type="text"
            placeholder="Crop Name"
            value={newCrop.cropName}
            onChange={(e) => setNewCrop({ ...newCrop, cropName: e.target.value })}
            className="mb-2 form-control"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newCrop.quantity}
            onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
            className="mb-2 form-control"
          />
          <input
            type="number"
            placeholder="Base Price"
            value={newCrop.basePrice}
            onChange={(e) => setNewCrop({ ...newCrop, basePrice: e.target.value })}
            className="mb-2 form-control"
          />
          <input
            type="text"
            placeholder="Location"
            value={newCrop.location}
            onChange={(e) => setNewCrop({ ...newCrop, location: e.target.value })}
            className="mb-2 form-control"
          />
          <input
            type="date"
            value={newCrop.expectedHarvestDate}
            onChange={(e) =>
              setNewCrop({ ...newCrop, expectedHarvestDate: e.target.value })
            }
            className="mb-2 form-control"
          />
          <button className="btn btn-primary" onClick={handleAddCrop}>
            Add Crop
          </button>
        </div>
      )}

      {/* Crops & Bids Section with Pagination */}
      {activeSection === 'bids' && (
        <div className="p-3">
          <h4 className="mb-3">Your Crops</h4>
          {crops.length === 0 ? (
            <p>No crops posted yet.</p>
          ) : (
            <>
              <div
                className="crop-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                }}
              >
                {currentCrops.map((crop) => (
                  <div
                    key={crop.id}
                    style={{
                      background: '#fdfdfd',
                      borderRadius: '15px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      padding: '20px',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <h4
                      style={{
                        color: '#2e7d32',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '10px',
                        marginBottom: '15px',
                      }}
                    >
                      {crop.cropName}
                    </h4>
                    <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '20px' }}>
                      <li><strong>Quantity:</strong> {crop.quantity} kg</li>
                      <li><strong>Base Price:</strong> <span style={{ color: '#388e3c' }}>₹{crop.basePrice}</span></li>
                      <li><strong>Location:</strong> {crop.location}</li>
                      <li><strong>Harvest Date:</strong> {crop.expectedHarvestDate}</li>
                    </ul>

                    <div className="mt-3">
                      <button
                        className="btn btn-info w-100"
                        style={{
                          borderRadius: '8px',
                          padding: '8px',
                          marginBottom: '15px',
                        }}
                        onClick={() => fetchBidsForCrop(crop.id)}
                      >
                        View Bids
                      </button>

                      {bidsByCrop[crop.id] && bidsByCrop[crop.id].length > 0 ? (
                        <div className="mt-3">
                          <h6 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Bids:</h6>
                          <ul className="list-group mt-2">
                            {bidsByCrop[crop.id].map((bid) => (
                              <li key={bid.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{bid.buyer.name}</strong><br />
                                  <span>₹{bid.bidAmount}</span>
                                </div>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleAcceptBid(bid.id, crop.id)}
                                >
                                  Accept Bid
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : bidsByCrop[crop.id] ? (
                        <div className="alert alert-info mt-3">No bids received yet</div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="mt-4 d-flex justify-content-center">
    <nav>
      <ul className="pagination" style={{ listStyleType: 'none', display: 'flex', marginTop: '10px',
    marginBottom: '10px'}}>
        {[...Array(totalPages)].map((_, index) => {
          const number = index + 1;
          return (
            <li key={index} style={{ margin: '0 5px' }}>
              <button
                onClick={() => setCurrentPage(number)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '5px',
                  padding: '5px 12px',
                  backgroundColor: currentPage === number ? '#007bff' : 'transparent',
                  color: currentPage === number ? 'white' : '#007bff',
                  border: '1px solid #007bff',
                }}
              >
                {number}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  </div>
)}

            </>
          )}
        </div>
      )}

      {/* Transactions Section */}
      {activeSection === 'transactions' && (
        <div className="p-3 mb-5 card">
          <h4>Your Transactions</h4>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Crop</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.crop?.cropName || 'N/A'}</td>
                    <td>{txn.buyer?.name || 'N/A'}</td>
                    <td>₹{txn.amount}</td>
                    <td>{txn.paymentStatus}</td>
                    <td>
                      {txn.paymentStatus === 'PAID' && txn.deliveryStatus === 'PENDING' ? (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleDeliveryStatus(txn.id, 'SHIPPED')}
                        >
                          Mark Shipped
                        </button>
                      ) : (
                        txn.deliveryStatus
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
