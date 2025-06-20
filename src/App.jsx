import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import UserProfile from '@pages/Profile/userProfile';
import ForgotPasswordPage from '@components/ForgotPasswordPage';
import VerifyCodePage from '@components/VerifyCodePage';
import ResetPasswordPage from '@components/ResetPasswordPage';
import CategoryPage from '@pages/Category/CategoryPage';
import ProductDetailPage from '@pages/ProductDetail/ProductDetailPage';
import CartPage from '@pages/Cart/CartPage';
import endPoints from '@routes/router';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={endPoints.ALL} element={<Home />} />
        <Route path={endPoints.LOGIN} element={<Login />} />
        <Route path={endPoints.REGISTER} element={<Register />} />
        <Route path={endPoints.PROFILE} element={<UserProfile />} />
        <Route path={endPoints.FORGOT_PASSWORD_EMAIL} element={<ForgotPasswordPage />} />
        <Route path={endPoints.FORGOT_PASSWORD_CODE} element={<VerifyCodePage />} />
        <Route path={endPoints.FORGOT_PASSWORD_RESET} element={<ResetPasswordPage />} />
        <Route path={endPoints.CATEGORY} element={<CategoryPage />} />
        <Route path={endPoints.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        <Route path={endPoints.GIOHANG} element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
