import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { referralService } from '../services/endpoints';
import { FiArrowRight } from 'react-icons/fi';

function ReferralLanding() {
  const { code } = useParams();

  useEffect(() => {
    if (code) {
      localStorage.setItem('referral_code', code);
      referralService.track(code).catch(() => {});
    }
  }, [code]);

  return (
    <div className="page fade-in" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="card" style={{ maxWidth:500, textAlign:'center', padding:48 }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>🎉</div>
        <h1 style={{ fontSize:'1.8rem', marginBottom:12 }}>You've been referred!</h1>
        <p style={{ color:'var(--text-secondary)', marginBottom:24 }}>
          Your referral code <strong style={{ color:'var(--accent)' }}>{code}</strong> has been saved. Browse our products and enjoy exclusive benefits!
        </p>
        <Link to="/products"><button className="btn btn-primary">Browse Products <FiArrowRight /></button></Link>
      </div>
    </div>
  );
}

export default ReferralLanding;
