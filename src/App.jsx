import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import UserProfile from '@pages/Profile/userProfile';
import PerfumeShop from '@pages/Shop/nuocHoaShop';
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
        <Route path={endPoints.NUOCHOA} element={<PerfumeShop />} />
        <Route path={endPoints.NUOCHOA_CHI_TIET} element={<NuocHoaDetail />} />
        <Route path={endPoints.GIOHANG} element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
