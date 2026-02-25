// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to <span className="hero-title-accent">EasyCart</span>
                    </h1>

                    <p className="hero-subtitle">
                        Your one-stop destination for effortless shopping. Discover amazing products
                        at unbeatable prices with fast delivery right to your doorstep.
                    </p>

                    <div className="hero-cta">
                        <Link to="/products" className="cta-button cta-primary">
                            Shop Now
                            <svg className="cta-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                            </svg>
                        </Link>

                        <Link to="/categories" className="cta-button cta-secondary">
                            Browse Categories
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">10k+</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">5k+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="image-wrapper">
                        {/* Decorative elements */}
                        <div className="decor-circle circle-1"></div>
                        <div className="decor-circle circle-2"></div>
                        <div className="decor-circle circle-3"></div>

                        {/* Shopping illustration/grid */}
                        <div className="shopping-grid">
                            <div className="grid-item item-1">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="var(--color-text-large)" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </div>
                            <div className="grid-item item-2">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="var(--color-text-medium)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                </svg>
                            </div>
                            <div className="grid-item item-3">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="var(--color-text-small)" d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </div>
                            <div className="grid-item item-4">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                    <path fill="var(--color-text-large)" d="M21 6h-2v3h-2V6h-3V4h3V1h2v3h3v2zm-6-4v2h-2V2h2zm0 8h-2v2h2v-2zm-2-4h2v2h-2V6zm-4-4h2v2h-2V2zm0 8h2v2h-2v-2zm-2 4h2v2H7v-2zm2-8h2v2H9V6zm0 8h2v2H9v-2zm-4-4h2v2H5v-2zm12 8h2v2h-2v-2zm-8 4h2v2H9v-2zm8-12h2v2h-2v-2zm0 8h2v2h-2v-2zm-4 4h2v2h-2v-2zm0-8h2v2h-2v-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave decoration at bottom */}
            <div className="hero-wave">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path d="M0,50 C300,100 600,0 1440,50 L1440,100 L0,100 Z" fill="var(--color-background)"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;