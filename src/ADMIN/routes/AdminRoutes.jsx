// src/ADMIN/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@adminPages/AdminLayout'; // layout tổng cho admin
import CategoryManagement from '@adminPages/CategoryManagement'; // trang quản lý danh mục
import ProductManagement from '@adminPages/ProductManagement';
import UserManagement from '@adminPages/UserManagement';
import Dashboard from '@adminPages/Dashboard'; // nếu có


const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category" element={<CategoryManagement />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="user" element={<UserManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
