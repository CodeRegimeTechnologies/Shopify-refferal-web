import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/endpoints';
import { FiSearch, FiExternalLink } from 'react-icons/fi';

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await productService.list(params);
      setProducts(res.data.results || res.data || []);
    } catch {
      setProducts([
        {
          id: 1,
          title: 'Premium Wireless Headphones',
          price: '2999.00',
          slug: 'premium-wireless-headphones',
          shopify_handle: 'premium-wireless-headphones',
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        },
        {
          id: 2,
          title: 'Smart Fitness Watch',
          price: '1999.00',
          slug: 'smart-fitness-watch',
          shopify_handle: 'smart-fitness-watch',
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        },
        {
          id: 3,
          title: 'Ergonomic Office Chair',
          price: '8999.00',
          slug: 'ergonomic-office-chair',
          shopify_handle: 'ergonomic-office-chair',
          image_url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80',
        }
      ]);
    }
    setLoading(false);
  };

  const referralCode = localStorage.getItem('referral_code') || '';
  const shopifyUrl = import.meta.env.VITE_SHOPIFY_STORE_URL || '';
console.log("shopify",shopifyUrl)
  return (
    <div className="page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Products</h1>
          <p>Browse our collection and shop through Shopify</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); loadProducts({ search }); }} style={{ marginBottom: 32 }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
          </div>
        </form>
        {loading ? <div className="spinner" /> : (
          <div className="product-grid">
            {products.length === 0 ? (
              <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 64 }}>
                <p style={{ color: 'var(--text-muted)' }}>No products found on Shopify.</p>
              </div>
            ) : products.map((p, i) => (
              <div key={p.id} className="product-card">
                <div className="product-image" style={{ background: `linear-gradient(135deg, hsl(${(i*60)%360},40%,20%), hsl(${(i*60+30)%360},50%,15%))` }}>
                  {p.image_url ? <img src={p.image_url} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : p.title?.charAt(0)}
                </div>
                <div className="product-info">
                  <h3 className="product-title">{p.title}</h3>
                  <span className="product-price">Rs. {p.price}</span>
                  <div style={{ display:'flex', gap:8, marginTop:12 }}>
                    <Link to={`/products/${p.slug}`} className="btn btn-sm btn-secondary" style={{ flex:1, justifyContent:'center' }}>Details</Link>
                    <a href={`https://${shopifyUrl}/products/${p.shopify_handle}${referralCode ? `?ref=${referralCode}` : ''}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary" style={{ flex:1, justifyContent:'center' }}>Buy <FiExternalLink /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
