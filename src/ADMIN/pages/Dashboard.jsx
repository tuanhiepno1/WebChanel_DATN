import React from 'react';

const Dashboard = () => {
  return (
    <div
      style={{
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src="/dashboard2.jpg"
        alt="Admin Dashboard"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
};

export default Dashboard;
