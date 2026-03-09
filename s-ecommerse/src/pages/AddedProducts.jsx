// src/pages/AddedProducts.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axiosInstance';
import './AddedProducts.css'; // we'll create this below
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function () {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Redirect if not owner
  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch owner's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const res = await API.get('/products/');
        // If backend returns paginated data, extract results
        const productList = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        // Optional: filter to only show products owned by current user
        // (if your backend doesn't already filter)
        const myProducts = productList.filter(p => p.owner?.id === user.id);

        setProducts(myProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Could not load your products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setDeletingId(productId);

    try {
      await API.delete(`/products/${productId}/`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.detail || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
    // You can create EditProduct page later
  };

  return (
    <div className="added-products-page">
      <header className="page-header">
        <h1>My Added Products</h1>
        <button
          className="add-new-btn"
          onClick={() => navigate('/products/new')}
        >
          + Add New Product
        </button>
      </header>

      {loading ? (
        <div className="loading">Loading your products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any products yet.</p>
          <button onClick={() => navigate('/products/new')}>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="no-image">No image</div>
              )}

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  KSh {Number(product.price).toLocaleString()}
                </p>
                <p className="product-stock">
                  Stock: {product.stock_quantity}
                  {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                    <span className="low-stock"> (Low stock)</span>
                  )}
                  {product.stock_quantity === 0 && (
                    <span className="out-of-stock"> (Out of stock)</span>
                  )}
                </p>

                <div className="product-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {deletingId === product.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}