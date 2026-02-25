// src/pages/AddProduct.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axiosInstance';
import './AddProduct.css';
import Navbar from '../components/Navbar';

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    barcode: '',
    sku: '',
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // per-field errors from backend
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Protect route – only owners
  if (!user || user.role !== 'owner') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Only shop owners can add products.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a number greater than 0';
      isValid = false;
    }

    if (!formData.stock_quantity.trim()) {
      newErrors.stock_quantity = 'Stock quantity is required';
      isValid = false;
    } else if (isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Stock must be a number ≥ 0';
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      setError('Please fix the errors in the form.');
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();

      // Append all fields (convert numbers to strings)
      formPayload.append('name', formData.name.trim());
      formPayload.append('description', formData.description.trim() || '');
      formPayload.append('price', formData.price.trim());
      formPayload.append('stock_quantity', formData.stock_quantity.trim());
      formPayload.append('barcode', formData.barcode.trim() || '');
      formPayload.append('sku', formData.sku.trim() || '');

      if (image) {
        formPayload.append('image', image);
      }

      // Debug: log exactly what is being sent
      console.log('=== SENDING PRODUCT DATA ===');
      for (let [key, val] of formPayload.entries()) {
        console.log(
          `${key}:`,
          val instanceof File ? `File: ${val.name} (${val.size} bytes)` : val
        );
      }

      const response = await API.post('/products/add/', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Success response:', response.data);

      setSuccessMessage('Product added successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        barcode: '',
        sku: '',
      });
      setImage(null);

      // Optional: go to product list after short delay
      setTimeout(() => navigate('/products'), 1800);
    } catch (err) {
      console.error('Add product failed:', err);

      let displayError = 'Failed to add product. Please try again.';

      if (err.response?.status === 400) {
        const serverErrors = err.response.data;

        // Show detailed field errors
        if (typeof serverErrors === 'object' && serverErrors !== null) {
          const newFieldErrors = {};

          Object.entries(serverErrors).forEach(([field, messages]) => {
            newFieldErrors[field] = Array.isArray(messages)
              ? messages.join(' • ')
              : messages;
          });

          setFieldErrors(newFieldErrors);

          // Build main error message
          displayError = Object.values(newFieldErrors).join(' | ') || displayError;
        } else if (serverErrors?.detail) {
          displayError = serverErrors.detail;
        } else if (serverErrors?.non_field_errors) {
          displayError = serverErrors.non_field_errors.join(' • ');
        }
      } else if (err.response?.status === 403) {
        displayError = 'Permission denied. You must be a shop owner.';
      } else if (err.response?.status === 401) {
        displayError = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.message.includes('Network')) {
        displayError = 'Cannot reach the server. Check your internet connection.';
      }

      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="add-product-container">
      <div className="add-product-card">
        <h2>Add New Product</h2>
        <p className="subtitle">Fill in the details to list your product</p>

        {error && <div className="error-message global">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fresh Sukuma Wiki"
              className={fieldErrors.name ? 'input-error' : ''}
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the product..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="price">Price (KSh) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="e.g. 50.00"
                className={fieldErrors.price ? 'input-error' : ''}
              />
              {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
            </div>

            <div className="form-group half">
              <label htmlFor="stock_quantity">Stock Quantity *</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 100"
                className={fieldErrors.stock_quantity ? 'input-error' : ''}
              />
              {fieldErrors.stock_quantity && (
                <span className="field-error">{fieldErrors.stock_quantity}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="barcode">Barcode (optional)</label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="e.g. 123456789012"
              />
            </div>

            <div className="form-group half">
              <label htmlFor="sku">SKU (optional)</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. SW-001"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image (optional)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && <p className="file-name">Selected: {image.name}</p>}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}