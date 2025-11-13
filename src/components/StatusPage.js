import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const StatusPage = () => {
  const navigate = useNavigate();
  // Initialize state with an empty array to prevent map errors on first render
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStatus = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/dashboard/me', config);
        
        // ** THE FIX IS HERE **
        // Ensure that status is always an array, even if the user has no status field
        setStatus(res.data.status || []);
        
        const socket = io('http://localhost:5000');
        socket.emit('joinRoom', res.data._id); 

        socket.on('statusUpdate', (newStatus) => {
          console.log('Status update received!');
          setStatus(newStatus);
        });

        return () => socket.disconnect();
      } catch (err) {
        console.error('Failed to fetch status:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return <div className="status-container"><h2>Loading Application Status...</h2></div>;
  }

  return (
    <div className="status-container">
      <h1>Application Status</h1>
      <p>Your application progress is updated here in real-time.</p>
      <div className="status-timeline">
        {/* Add a check to ensure status exists and is an array before mapping */}
        {status && status.map((step, index) => (
          <div key={index} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>{step.name}</h3>
              <p>{step.completed ? `Completed on ${formatDate(step.date)}` : 'Pending'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPage;

