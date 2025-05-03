import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BuyerDashboard() {
  const [availableCrops, setAvailableCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [myBids, setMyBids] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [myTransactions, setMyTransactions] = useState([]);
  const [selectedSection, setSelectedSection] = useState('availableCrops');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchAvailableCrops = async () => {
    try {
      const res = await axios.get('http://localhost:8080/buyer/crops', { headers });
      setAvailableCrops(res.data);
      setFilteredCrops(res.data);
    } catch (err) {
      console.error('Error fetching crops:', err);
    }
  };

  const fetchMyBids = async () => {
    try {
      const res = await axios.get('http://localhost:8080/buyer/bids', { headers });
      setMyBids(res.data);
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

  const fetchMyTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/transactions/buyer', { headers });
      setMyTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handlePlaceBid = async (cropId) => {
    try {
      const bidData = { bidAmount: bidAmounts[cropId] };
      await axios.post(`http://localhost:8080/buyer/bids/${cropId}`, bidData, { headers });
      alert('Bid placed!');
      setBidAmounts((prev) => ({ ...prev, [cropId]: '' }));
      fetchMyBids();
      fetchMyTransactions();
    } catch (err) {
      console.error('Error placing bid:', err);
    }
  };

  const handlePayment = async (txnId, amount) => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }
  
      // Create order on backend
      const orderResponse = await axios.post(
        `http://localhost:8080/api/transactions/razorpay/create-order/${txnId}`,
        {},
        { headers }
      );
  
      const { amount: orderAmount, currency, id: order_id } = orderResponse.data;
  
      const options = {
        key: 'your_razerpay_key', // Replace with your actual key
        amount: orderAmount,
        currency,
        name: 'Farmer Marketplace',
        description: 'Crop Purchase Payment',
        order_id,
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying payment:", response);
            
            // Verify payment on backend and update status
            const verificationResponse = await axios.post(
              `http://localhost:8080/api/payment/verify`,
              null,
              { 
                params: {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  transactionId: txnId
                },
                headers 
              }
            );
            
            console.log("Verification response:", verificationResponse);
            
            if (verificationResponse.status === 200) {
              setShowPaymentSuccess(true);
              setTimeout(() => setShowPaymentSuccess(false), 2000);
              fetchMyTransactions(); // Refresh the transactions list
            } else {
              console.error('Failed to verify payment:', verificationResponse);
              alert('Payment succeeded but verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Failed to verify payment:', err);
            alert('Payment succeeded but verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Buyer',
          email: 'buyer@example.com',
          contact: '9999999999',
        },
        notes: {
          txnId,
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error in Razorpay payment flow:', err);
      alert('Something went wrong during payment.');
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
      fetchMyTransactions();
    } catch (err) {
      console.error('Error updating delivery status:', err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = availableCrops.filter(crop =>
      crop.cropName.toLowerCase().includes(term)
    );
    setFilteredCrops(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get current crops for pagination
  const indexOfLastCrop = currentPage * cardsPerPage;
  const indexOfFirstCrop = indexOfLastCrop - cardsPerPage;
  const currentCrops = filteredCrops.slice(indexOfFirstCrop, indexOfLastCrop);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchAvailableCrops();
    fetchMyBids();
    fetchMyTransactions();
    // eslint-disable-next-line
  }, []);

  // Pagination component
  const Pagination = ({ cardsPerPage, totalCards, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Crops pagination" className="mt-4">
        <ul className="pagination justify-content-center " style={{display:'flex', gap:'10px', listStyleType:"none",marginTop: '10px',
    marginBottom: '10px'}}>
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button
                onClick={() => paginate(number)}
                className="page-link"
                style={{
                  cursor: 'pointer',
                  borderRadius: '5px', // Add border radius
                  padding: '5px 12px', // Adjust padding for button size
                  backgroundColor: currentPage === number ? '#007bff' : 'transparent', // Active page background
                  color: currentPage === number ? 'white' : '#007bff', // Active page text color
                  border: '1px solid #007bff', // Button border
                }}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className="container p-4 mt-4" style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {showPaymentSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#28a745', color: 'white', padding: '32px 48px',
            borderRadius: '16px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="white" opacity="0.2" />
              <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '16px' }}>
              Payment Successful
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-3">Buyer Dashboard</h2>

      <div className="mb-4">
        <button className="btn btn-primary me-2" style={{ marginRight: "5px",border: '2px solid #007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }} onClick={() => setSelectedSection('availableCrops')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
          >Available Crops</button>
        <button className="btn btn-primary me-2" style={{ marginRight: "5px",border: '2px solid #007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }} onClick={() => setSelectedSection('myBids')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
          >My Bids</button>
        <button className="btn btn-primary" style={{ marginRight: "5px",border: '2px solid #007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }} onClick={() => setSelectedSection('myTransactions')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
          >My Transactions</button>
      </div>

      {selectedSection === 'availableCrops' && (
        <div className="p-3">
          <h4 className="mb-3">Available Crops</h4>
          <input
            type="text"
            placeholder="Search crop by name..."
            className="form-control mb-4 shadow-sm"
            value={searchTerm}
            onChange={handleSearch}
            style={{ maxWidth: '400px', borderRadius: '10px', border: '1px solid #ced4da' }}
          />

          {filteredCrops.length === 0 ? (
            <p>No crops found.</p>
          ) : (
            <>
             <div
  className="row"
  style={{
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gap: '20px',
  }}
>
                {currentCrops.map(crop => (
                  <div key={crop.id} className="col-md-4 mb-4">
                    <div
                      style={{
                        height: '100%',
                        background: '#fdfdfd',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <h4 style={{ 
                        color: '#2e7d32', 
                        borderBottom: '1px solid #ccc', 
                        paddingBottom: '10px',
                        marginBottom: '15px'
                      }}>
                        {crop.cropName}
                      </h4>
                      <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '20px' }}>
                        <li><strong>Quantity:</strong> {crop.quantity} kg</li>
                        <li><strong>Base Price:</strong> <span style={{ color: '#388e3c' }}>₹{crop.basePrice}</span></li>
                        <li><strong>Location:</strong> {crop.location}</li>
                        <li><strong>Harvest Date:</strong> {crop.expectedHarvestDate}</li>
                      </ul>
                      <input
                        type="number"
                        placeholder="Enter your bid"
                        className="form-control mb-3"
                        value={bidAmounts[crop.id] || ''}
                        onChange={(e) => setBidAmounts({ ...bidAmounts, [crop.id]: e.target.value })}
                        style={{ 
                          borderRadius: '8px', 
                          padding: '8px 12px', 
                          border: '1px solid #ccc', 
                          marginBottom: '10px' 
                        }}
                      />
                      <button
                        className="btn btn-success w-100"
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#43a047',
                          border: 'none',
                          padding: '10px ',
                          fontWeight: 'bold',
                          color: 'white'
                        }}
                        onClick={() => handlePlaceBid(crop.id)}
                      >
                        Place Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <Pagination 
                cardsPerPage={cardsPerPage} 
                totalCards={filteredCrops.length} 
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      )}
      
      {selectedSection === 'myBids' && (
        <div className="card p-3">
          <h4>My Bids</h4>
          {myBids.length === 0 ? (
            <p>You haven't placed any bids yet.</p>
          ) : (
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Crop Name</th>
                  <th>Quantity</th>
                  <th>Base Price</th>
                  <th>Your Bid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myBids.map(bid => (
                  <tr key={bid.id}>
                    <td>{bid.crop?.cropName || 'N/A'}</td>
                    <td>{bid.crop?.quantity || 'N/A'} kg</td>
                    <td>₹{bid.crop?.basePrice || 'N/A'}</td>
                    <td>₹{bid.bidAmount}</td>
                    <td>
                      <span
                        style={{
                          color:
                            bid.bidStatus === 'ACCEPTED'
                              ? 'green'
                              : bid.bidStatus === 'REJECTED'
                              ? 'red'
                              : 'black',
                          fontWeight: 600
                        }}
                      >
                        {bid.bidStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedSection === 'myTransactions' && (
        <div className="card p-3">
          <h4>My Transactions</h4>
          {myTransactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Crop</th>
                  <th>Farmer</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {myTransactions.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.crop?.cropName || 'N/A'}</td>
                    <td>{txn.farmer?.name || 'N/A'}</td>
                    <td>₹{txn.amount}</td>
                    <td>
                      {txn.paymentStatus === 'PENDING' ? (
                        <button className="btn btn-primary btn-sm" onClick={() => handlePayment(txn.id, txn.amount)}>
                          Pay
                        </button>
                      ) : (
                        txn.paymentStatus
                      )}
                    </td>
                    <td>
                      {txn.deliveryStatus === 'SHIPPED' ? (
                        <button className="btn btn-success btn-sm" onClick={() => handleDeliveryStatus(txn.id, 'DELIVERED')}>
                          Mark Delivered
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
