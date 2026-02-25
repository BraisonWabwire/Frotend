// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axiosInstance';
import './Products.css';


export default function Products() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartFeedback, setCartFeedback] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await API.get('/products/');

            // Handle different possible response shapes safely
            let productList = [];

            if (Array.isArray(res.data)) {
                productList = res.data;
            } else if (res.data?.results && Array.isArray(res.data.results)) {
                productList = res.data.results; // paginated response
            } else {
                console.warn('Unexpected products data format:', res.data);
                setError('Invalid data format received from server');
            }

            setProducts(productList);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError(
                err.response?.data?.detail ||
                err.message ||
                'Could not load products. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'customer') {
            alert('Only customers can add to cart');
            return;
        }

        try {
            await API.post('/cart/add/', {
                product_id: product.id,
                quantity: 1,
            });
            setCartFeedback(`Added ${product.name} to cart!`);
            setTimeout(() => setCartFeedback(''), 3000);
        } catch (err) {
            console.error(err);
            setCartFeedback('Failed to add to cart');
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await API.delete(`/products/${productId}/`); // assumes you have DELETE endpoint
            setProducts(prev => prev.filter(p => p.id !== productId));
            alert('Product deleted successfully');
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete product');
        }
    };

    const handleEdit = (productId) => {
        navigate(`/products/edit/${productId}`);
        // You can create EditProduct page later
    };

    return (
        <>
            <div className="products-container">
                <div className="products-header">
                    <div>
                        <h1>Welcome back {user.username} </h1>
                        <br />
                        <h2>All Products</h2>
                    </div>

                    {user?.role === 'owner' && (
                        <button
                            className="add-new-btn"
                            onClick={() => navigate('/products/new')}
                        >
                            + Add New Product
                        </button>
                    )}
                </div>

                {cartFeedback && (
                    <div className="cart-feedback success">
                        {cartFeedback}
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">Loading products...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : products.length === 0 ? (
                    <div className="empty-state">No products available at the moment.</div>
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

                                <div className="product-content">
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-desc">
                                        {product.description?.substring(0, 80) || 'No description available'}
                                        {product.description?.length > 80 ? '...' : ''}
                                    </p>

                                    <div className="product-price">
                                        KSh {Number(product.price).toLocaleString()}
                                    </div>

                                    <div className="product-stock">
                                        In stock: {product.stock_quantity}
                                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                            <span className="low-stock"> (Low stock)</span>
                                        )}
                                        {product.stock_quantity === 0 && (
                                            <span className="out-of-stock"> (Out of stock)</span>
                                        )}
                                    </div>

                                    <div className="product-actions">
                                        {user?.role === 'customer' && (
                                            <button
                                                className="add-to-cart"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock_quantity === 0}
                                            >
                                                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        )}

                                        {user?.role === 'owner' && product.owner?.id === user.id && (
                                            <div className="owner-controls">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(product.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>

    );
}