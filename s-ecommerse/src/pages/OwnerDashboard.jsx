// src/pages/OwnerDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './OwnerDashboard.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faChartLine,
    faBox,
    faShoppingCart,
    faUsers,
    faSignOutAlt,
    faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import API from '../api/axiosInstance';
import './OwnerDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function OwnerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        lowStockProducts: 0,
        totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    // Redirect if not owner
    useEffect(() => {
        if (!user || user.role !== 'owner') {
            navigate('/login');
        }
    }, [user, navigate]);

    // Mock data for charts (replace with real API later)
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales (KSh)',
                data: [120000, 190000, 150000, 220000, 300000, 280000],
                borderColor: '#00a896',
                backgroundColor: 'rgba(0, 168, 150, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const stockData = {
        labels: ['Sukuma Wiki', 'Avocado', 'Tomatoes', 'Cooking Oil', 'Maize Flour'],
        datasets: [
            {
                label: 'Stock Level',
                data: [150, 80, 45, 200, 120],
                backgroundColor: [
                    '#00a896',
                    '#00a896',
                    '#ff6b6b',
                    '#00a896',
                    '#00a896',
                ],
            },
        ],
    };

    // Fetch real stats (example - adapt to your API)
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Example endpoints - replace with your actual ones
                const [productsRes, ordersRes] = await Promise.all([
                    API.get('/products/'),
                    API.get('/orders/'),
                ]);

                const products = productsRes.data;
                const lowStock = products.filter(p => p.stock_quantity <= 10).length;

                setStats({
                    totalProducts: products.length,
                    lowStockProducts: lowStock,
                    totalOrders: ordersRes.data.length,
                    totalSales: ordersRes.data.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
                });
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'owner') {
            fetchDashboardData();
        }
    }, [user]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    if (!user || user.role !== 'owner') return null;

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>ShopKE Owner</h3>
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="active">
                            <FontAwesomeIcon icon={faChartLine} /> Dashboard
                        </li>
                        <li onClick={() => navigate('/products')}>
                            <FontAwesomeIcon icon={faBox} /> Products
                        </li>
                        <li onClick={() => navigate('/products/new')}>
                            <FontAwesomeIcon icon={faBox} /> Add Product
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faShoppingCart} /> Orders
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faUsers} /> Customers
                        </li>
                        <li className="logout-item" onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}>
                            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Mobile menu toggle */}
                {!sidebarOpen && (
                    <button className="mobile-menu-btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                )}

                <header className="dashboard-header">
                    <h1>Welcome back, {user.username}</h1>
                    <p className="subtitle">Here's what's happening with your shop</p>
                </header>

                {loading ? (
                    <div className="loading">Loading dashboard data...</div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Sales</h3>
                                <p className="stat-value">KSh {stats.totalSales.toLocaleString()}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Orders</h3>
                                <p className="stat-value">{stats.totalOrders}</p>
                            </div>
                            <div className="stat-card warning">
                                <h3>Low Stock Items</h3>
                                <p className="stat-value">{stats.lowStockProducts}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Products</h3>
                                <p className="stat-value">{stats.totalProducts}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3>Sales Trend (Last 6 Months)</h3>
                                <Line data={salesData} options={{ responsive: true }} />
                            </div>

                            <div className="chart-card">
                                <h3>Stock Levels</h3>
                                <Bar data={stockData} options={{ responsive: true }} />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}