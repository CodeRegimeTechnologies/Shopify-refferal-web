import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/endpoints';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';

function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.detail(slug);
        setProduct(res.data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const referralCode = localStorage.getItem('referral_code') || '';
  const shopifyUrl = import.meta.env.VITE_SHOPIFY_STORE_URL || '';

  if (loading) {
    return <div className="page"><div className="container"><div className="spinner" /></div></div>;
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: 64 }}>
          <h2 style={{ marginBottom: 16 }}>Product not found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error}</p>
          <Link to="/products" className="btn btn-secondary">
            <FiArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link to="/products" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FiArrowLeft /> Back
          </Link>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="product-image" style={{ height: 400, background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '5rem', color: 'var(--text-muted)' }}>{product.title?.charAt(0)}</span>
            )}
          </div>
          
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 16 }}>{product.title}</h1>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 24 }}>
              Rs. {product.price}
            </div>
            
            <div style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem', lineHeight: 1.8 }}>
              {product.description || 'No description available for this product.'}
            </div>
            
            <a 
              href={`https://${shopifyUrl}/products/${product.shopify_handle}${referralCode ? `?ref=${referralCode}` : ''}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-primary" 
              style={{ padding: '16px 32px', fontSize: '1.1rem' }}
            >
              Buy on Shopify <FiExternalLink />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
