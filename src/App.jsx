import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import UserProfile from '@pages/Profile/userProfile';
import CategoryPage from '@pages/Category/CategoryPage';
import NuocHoaDetail from '@pages/ShopChiTiet/nuocHoaChiTiet';
import CartPage from '@pages/Cart/gioHang';
import endPoints from '@routes/router';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={endPoints.ALL} element={<Home />} />
        <Route path={endPoints.LOGIN} element={<Login />} />
        <Route path={endPoints.REGISTER} element={<Register />} />
        <Route path={endPoints.PROFILE} element={<UserProfile />} />
        <Route path={endPoints.CATEGORY} element={<CategoryPage />} />
        <Route path={endPoints.PRODUCT_DETAIL} element={<NuocHoaDetail />} />
        <Route path={endPoints.GIOHANG} element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
