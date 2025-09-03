import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import ProductPage from "./page/product/ProductPage";
import LoginPage from "./page/auth/LoginPage";
import NotFoundPage from "./page/404/NotFoundPage";
import MainLayout from "./component/layout/MainLayout";
import AuthLayout from "./component/layout/AuthLayout";
import RegisterPage from "./page/auth/RegisterPage";
import RolePage from "./page/role/RolePage";
import BrandPage from "./page/brand/BrandPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
