// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Index from './pages';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './pages/AddProduct';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Products from './pages/products';
import Cart from './pages/Cart';

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-wrapper">
      <main className="content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/Owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/Customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/cart" element={<Cart />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;