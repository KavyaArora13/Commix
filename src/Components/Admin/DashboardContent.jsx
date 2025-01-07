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

  const processOrderData = (orders) => {
    // Process daily data
    const dailyData = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { amount: 0, count: 0 };
      }
      acc[date].amount += order.total_amount;
      acc[date].count += 1;
      return acc;
    }, {});

    // Process weekly data
    const weeklyData = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!acc[weekKey]) {
        acc[weekKey] = { amount: 0, count: 0 };
      }
      acc[weekKey].amount += order.total_amount;
      acc[weekKey].count += 1;
      return acc;
    }, {});

    // Process monthly data
    const monthlyData = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { amount: 0, count: 0 };
      }
      acc[monthKey].amount += order.total_amount;
      acc[monthKey].count += 1;
      return acc;
    }, {});

    // Convert to arrays and sort
    const formatData = (data, format) => {
      return Object.entries(data)
        .map(([date, values]) => ({
          date: format === 'monthly' 
            ? new Date(date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
            : format === 'weekly'
              ? `Week of ${new Date(date).toLocaleDateString()}`
              : new Date(date).toLocaleDateString(),
          amount: values.amount,
          count: values.count
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    return {
      daily: formatData(dailyData, 'daily'),
      weekly: formatData(weeklyData, 'weekly'),
      monthly: formatData(monthlyData, 'monthly')
    };
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const [dashboardResponse, ordersResponse] = await Promise.all([
          axios.get(`${API_URL}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (dashboardResponse.data && dashboardResponse.data.data) {
          setDashboardData(dashboardResponse.data.data);
        }

        if (ordersResponse.data && ordersResponse.data.orders) {
          const processedData = processOrderData(ordersResponse.data.orders);
          setSalesData(processedData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${chartPeriod.charAt(0).toUpperCase() + chartPeriod.slice(1)} Sales & Orders`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Revenue') {
              return `${label}: ₹${value.toLocaleString()}`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue (₹)'
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const prepareChartData = () => {
    const data = salesData[chartPeriod] || [];
    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(item => item.amount),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Orders',
          data: data.map(item => item.count),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-cards">
          <div className="card">
            <h2>Total Users</h2>
            <div className="card-content">
              <div className="card-value">{dashboardData.userCount?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="card">
            <h2>Total Orders</h2>
            <div className="card-content">
              <div className="card-value">{dashboardData.orderCount?.toLocaleString() || 0}</div>
            </div>
          </div>
          
          <div className="card">
            <h2>Total Revenue</h2>
            <div className="card-content">
              <div className="card-value">
                ₹{(dashboardData.totalRevenue || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2>Average Order Value</h2>
            <div className="card-content">
              <div className="card-value">
                ₹{dashboardData.orderCount 
                  ? (dashboardData.totalRevenue / dashboardData.orderCount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  : '0.00'
                }
              </div>
            </div>
          </div>
        </div>

        {dashboardData.topProducts?.length > 0 && (
          <div className="top-products-card">
            <h2>Top Products</h2>
            <div className="top-products-list">
              {dashboardData.topProducts.map((product, index) => (
                <div key={product._id || index} className="top-product-item">
                  <img 
                    src={product.image_url || '/placeholder.png'} 
                    alt={product.name}
                    onError={(e) => e.target.src = '/placeholder.png'}
                    className="product-image" 
                  />
                  <div className="product-info">
                    <span className="product-name">{index + 1}. {product.name}</span>
                    <span className="product-sales">Sales: {product.totalQuantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chart-section">
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
        
        <div className="chart-container">
          {salesData[chartPeriod]?.length > 0 ? (
            <Line options={chartOptions} data={prepareChartData()} height={300} />
          ) : (
            <p className="no-data">No sales data available for this period</p>
          )}
        </div>
      </div>
    </div>
  );
}
