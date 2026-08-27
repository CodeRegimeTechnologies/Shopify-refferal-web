import { useState, useEffect } from 'react';
import { agentService, referralService, commissionService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { FiLink, FiCopy, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';

function AgentDashboard() {
  const [stats, setStats] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, codesRes] = await Promise.all([
        agentService.getStats(),
        referralService.myCodes(),
      ]);
      setStats(statsRes.data);
      setCodes(codesRes.data.results || codesRes.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateCode = async () => {
    try {
      await referralService.generate({});
      toast.success('New referral code generated!');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate code');
    }
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${code}`);
    toast.success('Link copied!');
  };

  if (loading) return <div className="dashboard-layout"><Sidebar /><div className="dashboard-content"><div className="spinner" /></div></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content fade-in">
        <div className="page-header">
          <h1>Agent Dashboard</h1>
          <p>Welcome back! Here's your referral overview.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}><FiUsers /></div>
            <div className="stat-value">{stats?.referral_count || 0}</div>
            <div className="stat-label">Total Referrals</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}><FiDollarSign /></div>
            <div className="stat-value">Rs.{stats?.total_earnings || 0}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}><FiTrendingUp /></div>
            <div className="stat-value">{stats?.order_count || 0}</div>
            <div className="stat-label">Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}><FiLink /></div>
            <div className="stat-value">{codes.length}</div>
            <div className="stat-label">Active Codes</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your Referral Codes</h3>
            <button className="btn btn-primary btn-sm" onClick={generateCode}><FiLink /> Generate New</button>
          </div>

          {codes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>
              {stats?.status === 'approved' ? 'No codes yet. Generate your first one!' : 'Your account is pending approval.'}
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead><tr><th>Code</th><th>Type</th><th>Uses</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {codes.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.code}</strong></td>
                      <td>{c.use_type}</td>
                      <td>{c.current_uses}{c.max_uses > 0 ? `/${c.max_uses}` : ''}</td>
                      <td><span className={`badge ${c.is_active ? 'badge-success' : 'badge-danger'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button className="btn-icon" onClick={() => copyLink(c.code)} title="Copy link"><FiCopy /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
