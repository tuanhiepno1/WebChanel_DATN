import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { restoreUserFromLocalStorage } from "@features/authSlice";
import { fetchCart } from "@redux/cartSlice";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import UserProfile from "@pages/Profile/userProfile";
import ForgotPasswordPage from "@components/ForgotPasswordPage";
import VerifyCodePage from "@components/VerifyCodePage";
import ResetPasswordPage from "@components/ResetPasswordPage";
import CategoryPage from "@pages/Category/CategoryPage";
import ProductDetailPage from "@pages/ProductDetail/ProductDetailPage";
import CartPage from "@pages/Cart/CartPage";
import OrderDetailPage from "@pages/OrderDetail/OrderDetailPage";
import NewsPage from "@pages/NewsPage/NewsPage";
import ContactPage from "@pages/ContactPage/ContactPage";
import endPoints from "@routes/router";
import RequireAdminAuth from "@admin/routes/RequireAdminAuth";
import AdminRoutes from "@admin/routes/AdminRoutes";
import MainLayout from "@pages/MainLayout";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(restoreUserFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user]);

  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <RequireAdminAuth>
              <AdminRoutes />
            </RequireAdminAuth>
          }
        />
        <Route
          path={endPoints.ALL}
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.LOGIN}
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.REGISTER}
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.PROFILE}
          element={
            <MainLayout>
              <UserProfile />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.FORGOT_PASSWORD_EMAIL}
          element={
            <MainLayout>
              <ForgotPasswordPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.FORGOT_PASSWORD_CODE}
          element={
            <MainLayout>
              <VerifyCodePage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.FORGOT_PASSWORD_RESET}
          element={
            <MainLayout>
              <ResetPasswordPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.CATEGORY}
          element={
            <MainLayout>
              <CategoryPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.PRODUCT_DETAIL}
          element={
            <MainLayout>
              <ProductDetailPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.GIOHANG}
          element={
            <MainLayout>
              <CartPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.ORDER_DETAIL}
          element={
            <MainLayout>
              <OrderDetailPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.TINTUC}
          element={
            <MainLayout>
              <NewsPage />
            </MainLayout>
          }
        />
        <Route
          path={endPoints.LIENHE}
          element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
