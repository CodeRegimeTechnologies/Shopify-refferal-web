import { NavLink } from 'react-router-dom';
import { FiHome, FiLink, FiUsers, FiDollarSign, FiBarChart2, FiFileText, FiUpload } from 'react-icons/fi';

function Sidebar() {
  const links = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/dashboard/referrals', icon: <FiLink />, label: 'My Referrals' },
    { to: '/dashboard/commissions', icon: <FiDollarSign />, label: 'Commissions' },
    { to: '/dashboard/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { to: '/dashboard/documents', icon: <FiFileText />, label: 'Documents' },
    { to: '/dashboard/family', icon: <FiUsers />, label: 'Family Details' },
    { to: '/dashboard/bulk-upload', icon: <FiUpload />, label: 'Bulk Upload' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
          Agent Panel
        </h3>
      </div>
      {links.map(link => (
        <NavLink key={link.to} to={link.to} end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;
