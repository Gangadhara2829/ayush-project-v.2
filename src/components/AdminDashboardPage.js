import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  // Initialize state with an empty array to prevent render errors
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/admin/applications', config);
        // Ensure we set an array, even if the response is unexpected
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to fetch applications. Please log in again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [navigate]);

  const handleStatusUpdate = async (stepIndex) => {
    const token = localStorage.getItem('token');
    if (!selectedApp) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(`http://localhost:5000/api/admin/status/${selectedApp._id}/${stepIndex}`, {}, config);
      
      setSelectedApp(res.data);
      setApplications(apps => apps.map(app => app._id === res.data._id ? res.data : app));

    } catch (err) {
      setError('Failed to update status.');
      console.error('Failed to update status:', err);
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="admin-dashboard">
      <div className="app-list-panel">
        <h2>Submitted Applications ({(applications && applications.length) || 0})</h2>
        {/* Add a check to ensure 'applications' is an array before mapping */}
        {Array.isArray(applications) && applications.map(app => (
          <div key={app._id} className={`app-list-item ${selectedApp?._id === app._id ? 'selected' : ''}`} onClick={() => setSelectedApp(app)}>
            <strong>{app.startupName}</strong>
            <small>{new Date(app.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
      <div className="app-detail-panel">
        {error && <p className="form-error">{error}</p>}
        {selectedApp ? (
          <div>
            <h2>{selectedApp.startupName}</h2>
            <p><strong>Founder:</strong> {selectedApp.founderName}</p>
            <p><strong>Contact:</strong> {selectedApp.contactNumber}</p>
            <p><strong>Email:</strong> {selectedApp.email}</p>
            <p><strong>Sector:</strong> {selectedApp.sector}</p>
            
            <div className="document-section">
              <h3>Submitted Documents</h3>
              {selectedApp.documents?.registrationCertificate ? (
                <a href={`http://localhost:5000/${selectedApp.documents.registrationCertificate.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">View Registration Certificate</a>
              ) : <p>No Registration Certificate uploaded.</p>}
              
              {selectedApp.documents?.founderId ? (
                <a href={`http://localhost:5000/${selectedApp.documents.founderId.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">View Founder ID</a>
              ) : <p>No Founder ID uploaded.</p>}

              <h4>Compliance Documents:</h4>
              {selectedApp.documents?.complianceDocs && selectedApp.documents.complianceDocs.length > 0 ? (
                <ul>
                  {selectedApp.documents.complianceDocs.map((doc, index) => (
                    <li key={index}>
                      <a href={`http://localhost:5000/${doc.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">View Document {index + 1}</a>
                    </li>
                  ))}
                </ul>
              ) : <p>No compliance documents uploaded.</p>}
            </div>
            
            <hr />
            <h3>Verification Status</h3>
            <div className="verification-checklist">
              {/* THE FIX IS HERE: Add a check for selectedApp.status before mapping */}
              {selectedApp.status && selectedApp.status.map((step, index) => (
                <div key={index} className="checklist-item">
                  <input
                    type="checkbox"
                    id={`step-${index}`}
                    checked={step.completed}
                    onChange={() => handleStatusUpdate(index)}
                  />
                  <label htmlFor={`step-${index}`}>{step.name}</label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Select an application from the left to view details.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

