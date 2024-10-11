import { useState } from "react";
import { BarChart, Users, Package, Grid, Image, Tag, LogOut, ShoppingCart } from "lucide-react"; // Import ShoppingCart icon
import "../Assets/Css/Admin/AdminPanel.scss"; // Import the SCSS file
import DashboardContent from '../Components/Admin/DashboardContent';
import UsersContent from '../Components/Admin/UsersContent';
import OrderContent from '../Components/Admin/OrderContent';
import ProductsContent from '../Components/Admin/ProductsContent';
import CategoriesContent from '../Components/Admin/CategoriesContent';
import BannerContent from '../Components/Admin/BannerContent';
import CouponsContent from '../Components/Admin/CouponsContent';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { logout } from '../features/auth/authActions'; // Import logout action
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function AdminPanel() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Initialize navigate

  const sidebarItems = [
    { name: "Dashboard", icon: BarChart },
    { name: "Users", icon: Users },
    { name: "Products", icon: Package },
    { name: "Categories", icon: Grid },
    { name: "Banner", icon: Image },
    { name: "Orders", icon: ShoppingCart }, // Changed icon for Orders section
    { name: "Coupons", icon: Tag },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "products":
        return <ProductsContent />;
      case "categories":
        return <CategoriesContent />;
      case "banner":
        return <BannerContent />;
      case "orders":
        return <OrderContent />; // Render Orders content
      case "coupons":
        return <CouponsContent />;
      default:
        return <div>Select a section</div>;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()); // Dispatch the logout action
      console.log("Logged out successfully");
      navigate('/adminlogin'); // Redirect to the admin login page
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
                setIsSidebarOpen(false); // Close sidebar on item click
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
    </div>
  );
}