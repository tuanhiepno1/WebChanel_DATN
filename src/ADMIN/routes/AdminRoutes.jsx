// src/ADMIN/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@adminPages/AdminLayout'; // layout tổng cho admin
import CategoryManagement from '@adminPages/CategoryManagement'; // trang quản lý danh mục
import ProductManagement from '@adminPages/ProductManagement';
import UserManagement from '@adminPages/UserManagement';
import VoucherManagement from '@adminPages/VoucherManagement';
import OrderManagement from '@adminPages/OrderManagement'; 
import Dashboard from '@adminPages/Dashboard'; // nếu có


const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category" element={<CategoryManagement />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="user" element={<UserManagement />} />
        <Route path="voucher" element={<VoucherManagement />} />
        <Route path="order" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
