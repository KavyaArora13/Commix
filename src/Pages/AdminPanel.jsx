// src/Pages/AdminPanel.jsx
import React, { useState } from "react";
import { BarChart, Users, Package, Grid, Image, Tag, LogOut, ShoppingCart } from "lucide-react";
import "../Assets/Css/Admin/AdminPanel.scss";
import DashboardContent from '../Components/Admin/DashboardContent';
import UsersContent from '../Components/Admin/UsersContent';
import OrderContent from '../Components/Admin/OrderContent';
import ProductsContent from '../Components/Admin/ProductsContent';
import CategoriesContent from '../Components/Admin/CategoriesContent';
import BannerContent from '../Components/Admin/BannerContent';
import OffersContent from "../Components/Admin/OffersContent";
import EditProductForm from "../Components/Admin/EditProductForm";
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authActions';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Dashboard", icon: BarChart },
    { name: "Users", icon: Users },
    { name: "Products", icon: Package },
    { name: "Categories", icon: Grid },
    { name: "Banner", icon: Image },
    { name: "Orders", icon: ShoppingCart },
    { name: "Offers", icon: Tag },
  ];

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    console.log("Product updated:", updatedProduct);
    setIsEditProductModalOpen(false);
    setRefreshProducts(prev => !prev); // Toggle this state to trigger a refresh
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "products":
        return <ProductsContent onEditProduct={handleEditProduct} refreshTrigger={refreshProducts} />;
      case "categories":
        return <CategoriesContent />;
      case "banner":
        return <BannerContent />;
      case "orders":
        return <OrderContent />;
      case "offers":
        return <OffersContent />;
      default:
        return <div>Select a section</div>;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      localStorage.removeItem('admin');
      console.log("Logged out successfully");
      navigate('/adminlogin');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="admin-panel">
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div>
          <h1>Comix</h1>
        </div>
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.name.toLowerCase()}
              className={`${
                currentSection === item.name.toLowerCase() ? "active" : ""
              } custom-button`}
              onClick={() => {
                setCurrentSection(item.name.toLowerCase());
                setIsSidebarOpen(false);
              }}
            >
              <item.icon />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="logout-item" onClick={handleLogout}>
          <LogOut />
          Log Out
        </div>
      </aside>
      <main>
        <button className="toggle-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "Hide Menu" : "Show Menu"}
        </button>
        {renderContent()}
      </main>
      {isEditProductModalOpen && (
        <EditProductForm
          product={selectedProduct}
          onClose={() => setIsEditProductModalOpen(false)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
}