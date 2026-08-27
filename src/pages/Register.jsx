import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { documentService, familyService, customFieldService, agentService } from '../services/endpoints';
import toast from 'react-hot-toast';
import { FiUpload, FiPlus, FiX, FiCheck } from 'react-icons/fi';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '', phone: '', date_of_birth: '',
    role: 'customer',
  });

  const [docs, setDocs] = useState({ pan: null, aadhaar: null, voter_id: null });
  const [family, setFamily] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleStep1 = (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error("Passwords don't match"); return; }
    setStep(2);
  };

  const handleStep2 = () => setStep(form.role === 'agent' ? 3 : 4);

  const handleDocUpload = async (type, file) => {
    setDocs({ ...docs, [type]: file });
  };

  const addFamily = () => setFamily([...family, { name: '', relation: 'spouse', phone: '', date_of_birth: '' }]);
  const removeFamily = (i) => setFamily(family.filter((_, idx) => idx !== i));
  const updateFamily = (i, field, value) => {
    const updated = [...family];
    updated[i][field] = value;
    setFamily(updated);
  };

  const addCustomField = () => setCustomFields([...customFields, { field_name: '', field_value: '' }]);
  const removeCustomField = (i) => setCustomFields(customFields.filter((_, idx) => idx !== i));
  const updateCustomField = (i, field, value) => {
    const updated = [...customFields];
    updated[i][field] = value;
    setCustomFields(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await register(form);

      // Upload documents if agent
      if (form.role === 'agent') {
        for (const [type, file] of Object.entries(docs)) {
          if (file) {
            const fd = new FormData();
            fd.append('doc_type', type);
            fd.append('file', file);
            await documentService.upload(fd);
          }
        }
        for (const f of family) {
          if (f.name) await familyService.create(f);
        }
        for (const c of customFields) {
          if (c.field_name && c.field_value) await customFieldService.create(c);
        }
        if (excelFile) {
          const fd = new FormData();
          fd.append('file', excelFile);
          await agentService.bulkUpload(fd);
        }
      }

      toast.success('Registration successful!');
      navigate(form.role === 'agent' ? '/dashboard' : '/products');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const msg = typeof errors === 'object' ? Object.values(errors).flat().join(', ') : errors;
        toast.error(msg);
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 560, paddingTop: 40 }}>
        <div className="steps">
          {(form.role === 'agent' ? [1, 2, 3, 4, 5, 6] : [1, 2]).map(s => (
            <div key={s} className={`step ${step === s ? 'active' : step > s ? 'completed' : ''}`}>
              {step > s ? <FiCheck /> : s}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 40 }}>
          {step === 1 && (
            <>
              <h2 style={{ marginBottom: 24 }}>Create Account</h2>
              <form onSubmit={handleStep1}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>First Name</label>
                    <input className="form-input" name="first_name" value={form.first_name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input className="form-input" name="last_name" value={form.last_name} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input className="form-input" name="username" value={form.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Phone</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input className="form-input" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Password</label>
                    <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input className="form-input" type="password" name="password2" value={form.password2} onChange={handleChange} required />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Next</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ marginBottom: 24 }}>Choose Your Role</h2>
              <div className="grid-2" style={{ marginBottom: 24 }}>
                {['customer', 'agent'].map(role => (
                  <div key={role} onClick={() => setForm({ ...form, role })}
                    className="card" style={{
                      cursor: 'pointer', textAlign: 'center', padding: 32,
                      borderColor: form.role === role ? 'var(--accent)' : undefined,
                      background: form.role === role ? 'var(--accent-glow)' : undefined,
                    }}>
                    <h3 style={{ marginBottom: 8 }}>{role === 'customer' ? 'Customer' : 'Referral Agent'}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem' }}>
                      {role === 'customer' ? 'Browse and shop products' : 'Earn by referring customers'}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                {form.role === 'customer' ? (
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>Next</button>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ marginBottom: 24 }}>Document Submission</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '.9rem' }}>Upload your KYC documents for verification</p>
              {['pan', 'aadhaar', 'voter_id'].map(type => (
                <div key={type} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    {type === 'pan' ? 'PAN Card' : type === 'aadhaar' ? 'Aadhaar Card' : 'Voter ID'}
                  </label>
                  <div className="file-upload" onClick={() => document.getElementById(`doc-${type}`).click()}>
                    <FiUpload style={{ fontSize: '1.5rem', marginBottom: 8 }} />
                    <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                      {docs[type] ? docs[type].name : 'Click to upload'}
                    </p>
                    <input id={`doc-${type}`} type="file" accept="image/*,.pdf" onChange={e => handleDocUpload(type, e.target.files[0])} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(4)} style={{ flex: 1, justifyContent: 'center' }}>Next</button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 style={{ marginBottom: 24 }}>Family Details</h2>
              {family.map((f, i) => (
                <div key={i} className="card" style={{ marginBottom: 12, padding: 16, position: 'relative' }}>
                  <button className="btn-icon" onClick={() => removeFamily(i)} style={{ position: 'absolute', top: 8, right: 8 }}><FiX /></button>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Name</label>
                      <input className="form-input" value={f.name} onChange={e => updateFamily(i, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Relation</label>
                      <select className="form-select" value={f.relation} onChange={e => updateFamily(i, 'relation', e.target.value)}>
                        {['spouse','father','mother','son','daughter','brother','sister','other'].map(r => (
                          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-input" value={f.phone} onChange={e => updateFamily(i, 'phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>DOB</label>
                      <input className="form-input" type="date" value={f.date_of_birth} onChange={e => updateFamily(i, 'date_of_birth', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addFamily} style={{ marginBottom: 24 }}><FiPlus /> Add Family Member</button>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(5)} style={{ flex: 1, justifyContent: 'center' }}>Next</button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 style={{ marginBottom: 24 }}>Custom Fields</h2>
              {customFields.map((c, i) => (
                <div key={i} className="card" style={{ marginBottom: 12, padding: 16, position: 'relative' }}>
                  <button className="btn-icon" onClick={() => removeCustomField(i)} style={{ position: 'absolute', top: 8, right: 8 }}><FiX /></button>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Field Name</label>
                      <input className="form-input" value={c.field_name} onChange={e => updateCustomField(i, 'field_name', e.target.value)} placeholder="e.g. GST Number" />
                    </div>
                    <div className="form-group">
                      <label>Field Value</label>
                      <input className="form-input" value={c.field_value} onChange={e => updateCustomField(i, 'field_value', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addCustomField} style={{ marginBottom: 24 }}><FiPlus /> Add Custom Field</button>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setStep(4)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(6)} style={{ flex: 1, justifyContent: 'center' }}>Next</button>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <h2 style={{ marginBottom: 24 }}>Excel Client Upload</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '.9rem' }}>Upload Client_Details.xlsx to bulk import your clients.</p>
              <div className="file-upload" onClick={() => document.getElementById('excel-upload').click()}>
                <FiUpload style={{ fontSize: '1.5rem', marginBottom: 8 }} />
                <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                  {excelFile ? excelFile.name : 'Click to upload Excel file'}
                </p>
                <input id="excel-upload" type="file" accept=".xlsx,.xls" onChange={e => setExcelFile(e.target.files[0])} style={{ display: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setStep(5)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </>
          )}
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '.9rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
