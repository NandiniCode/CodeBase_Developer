import React from 'react';
import RentalStationList from './RentalStationList';
import './AdminDashboard.css'; // Make sure to import the CSS file

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <RentalStationList />
    </div>
  );
};

export default AdminDashboard;
