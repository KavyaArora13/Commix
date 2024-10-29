import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { API_URL } from '../../config/api';
import '../../Assets/Css/Admin/Dashboard.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardContent() {
  const [dashboardData, setDashboardData] = useState({
    userCount: 0,
    orderCount: 0,
    totalRevenue: 0,
    topProducts: []
  });
  const [salesData, setSalesData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
    fetchSalesData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again later.');
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/sales`);
      setSalesData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to fetch sales data. Please try again later.');
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${chartPeriod.charAt(0).toUpperCase() + chartPeriod.slice(1)} Sales`,
      },
    },
  };

  const chartData = {
    labels: salesData[chartPeriod].map(item => item.date || item.week || item.month),
    datasets: [
      {
        label: 'Sales',
        data: salesData[chartPeriod].map(item => item.amount),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="dashboard-cards">
          <div className="card">
            <h2>Total Users</h2>
            <div className="card-content">
              <div className="card-value">{dashboardData.userCount || 0}</div>
            </div>
          </div>
          <div className="card">
            <h2>Total Orders</h2>
            <div className="card-content">
              <div className="card-value">{dashboardData.orderCount || 0}</div>
            </div>
          </div>
          <div className="card">
            <h2>Total Revenue</h2>
            <div className="card-content">
              <div className="card-value">${(dashboardData.totalRevenue || 0).toFixed(2)}</div>
            </div>
          </div>
          <div className="card">
            <h2>Average Order Value</h2>
            <div className="card-content">
              <div className="card-value">
                ${dashboardData.orderCount ? (dashboardData.totalRevenue / dashboardData.orderCount).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="top-products-card">
          <h2>Top Products</h2>
          <div className="top-products-list">
            {(dashboardData.topProducts || []).map((product, index) => (
              <div key={product._id} className="top-product-item">
                <img src={product.image_url || 'placeholder-image-url.jpg'} alt={product.name} className="product-image" />
                <div className="product-info">
                  <span className="product-name">{index + 1}. {product.name}</span>
                  <span className="product-sales">Sales: {product.totalQuantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <h2>Sales Overview</h2>
        <div className="chart-controls">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button 
              key={period}
              onClick={() => setChartPeriod(period)} 
              className={`chart-control-btn ${chartPeriod === period ? 'active' : ''}`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        {salesData[chartPeriod].length > 0 && (
          <Line options={chartOptions} data={chartData} />
        )}
      </div>
    </div>
  );
}
