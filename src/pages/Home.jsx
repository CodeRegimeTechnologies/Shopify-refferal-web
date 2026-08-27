import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiDollarSign, FiShield, FiTrendingUp } from 'react-icons/fi';

function Home() {
  const features = [
    { icon: <FiUsers />, title: 'Referral Network', desc: 'Build your network and earn from every referral purchase.' },
    { icon: <FiDollarSign />, title: 'Earn Commissions', desc: 'Get rewarded with automatic commission on referred sales.' },
    { icon: <FiShield />, title: 'Verified Agents', desc: 'Admin-verified agents with KYC document submission.' },
    { icon: <FiTrendingUp />, title: 'Real-time Tracking', desc: 'Track clicks, referrals, and earnings in real time.' },
  ];

  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Register as a referral agent and submit your documents.' },
    { num: '02', title: 'Get Approved', desc: 'Admin reviews and approves your application.' },
    { num: '03', title: 'Share & Earn', desc: 'Share your unique referral link and earn commissions.' },
  ];

  return (
    <div className="fade-in">
      <section className="hero">
        <div className="container">
          <h1>Grow Your Income with Referrals</h1>
          <p>Join our referral program, share products with your network, and earn commissions on every purchase made through your link.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Become an Agent <FiArrowRight /></Link>
            <Link to="/products" className="btn btn-secondary">Browse Products</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '64px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 48 }}>How It Works</h2>
        <div className="grid-3">
          {steps.map(step => (
            <div key={step.num} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
                {step.num}
              </div>
              <h3 style={{ marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 48 }}>Why Join Us?</h2>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
