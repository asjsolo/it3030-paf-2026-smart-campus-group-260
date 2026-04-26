import React, { useState } from 'react';
import { useResources } from './ResourceContext';

const ALL_CATEGORIES = [
    'Academic Spaces', 'Study & Library Spaces', 'Sports & Fitness',
    'Student Medical Services', 'Events & Auditorium', 'Equipment',
];
const ALL_TAGS = ['AC', 'Wifi', 'PC', 'Whiteboard', '4K', 'HD', 'Stage', 'Sound System', 'HDMI', 'VGA', 'Projector'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUSES = ['Active', 'Out of Service', 'Under Maintenance'];

const emptyForm = {
    name: '', category: 'Academic Spaces', type: '', campus: 'Malabe',
    building: '', floor: '', cap: '', specs: '', tags: [],
    availabilityWindows: [{ day: 'Monday', start: '08:00', end: '18:00' }],
    status: 'Active',
};

const StatusBadge = ({ status }) => {
    const colors = {
        'Active': { bg: '#e8f5e9', color: '#27ae60' },
        'Out of Service': { bg: '#fdecea', color: '#c0392b' },
        'Under Maintenance': { bg: '#fff3e0', color: '#e67e22' },
    };
    const style = colors[status] || { bg: '#f0f2f5', color: '#666' };
    return (
        <span style={{ background: style.bg, color: style.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, display: 'inline-block' }}>
            {status}
        </span>
    );
};

export default function AdminResourceManagement() {
    const { resources, addResource, updateResource, deleteResource } = useResources();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [message, setMessage] = useState('');

    const setField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
    const toggleFormTag = (tag) =>
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
        }));

    const addWindow = () =>
        setField('availabilityWindows', [...formData.availabilityWindows, { day: 'Monday', start: '08:00', end: '18:00' }]);

    const removeWindow = (i) =>
        setField('availabilityWindows', formData.availabilityWindows.filter((_, idx) => idx !== i));

    const updateWindow = (i, field, val) =>
        setField('availabilityWindows', formData.availabilityWindows.map((w, idx) => idx === i ? { ...w, [field]: val } : w));

    const openCreate = () => { setFormData(emptyForm); setEditingId(null); setIsModalOpen(true); };
    const openEdit = (res) => {
        setFormData({
            name: res.name, category: res.category, type: res.type,
            campus: res.campus || 'Malabe', building: res.building || '',
            floor: res.floor || '', cap: res.cap ?? '',
            specs: res.specs || '', tags: [...(res.tags || [])],
            availabilityWindows: res.availabilityWindows ? [...res.availabilityWindows] : [],
            status: res.status,
        });
        setEditingId(res.id);
        setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(emptyForm); };

    const handleSubmit = () => {
        if (!formData.name.trim()) { alert('Resource name is required.'); return; }
        const payload = { ...formData, cap: formData.cap !== '' ? parseInt(formData.cap) : null };
        if (editingId) updateResource(editingId, payload);
        else addResource(payload);
        closeModal();
        setMessage(editingId ? 'Resource updated.' : 'Resource created.');
        setTimeout(() => setMessage(''), 3500);
    };

    const handleDelete = (id) => {
        if (window.confirm('Permanently delete this resource?')) {
            deleteResource(id);
            setMessage('Resource deleted.');
            setTimeout(() => setMessage(''), 3500);
        }
    };

    const visibleResources = resources.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>Resource Catalogue Management</h2>

                {message && (
                    <div style={{ background: '#d4edda', color: '#155724', padding: '10px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
                    <input
                        type="text"
                        placeholder="Search by name, type, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 7, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    />
                    <button
                        onClick={openCreate}
                        style={{ padding: '10px 16px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                        ➕ New Resource
                    </button>
                </div>

                <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Resources ({visibleResources.length})</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f2f5' }}>
                                {['Name', 'Category', 'Location', 'Capacity', 'Status', 'Actions'].map((h, i) => (
                                    <th key={h} style={{ textAlign: i === 3 ? 'center' : i === 5 ? 'right' : 'left', padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleResources.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: 14 }}>No resources found.</td>
                                </tr>
                            ) : (
                                visibleResources.map((res) => (
                                    <tr key={res.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                                            <div style={{ fontWeight: 600 }}>{res.name}</div>
                                            {res.tags && res.tags.length > 0 && (
                                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                                                    {res.tags.slice(0, 2).map(t => (
                                                        <span key={t} style={{ fontSize: '10px', background: '#e8f0fe', color: '#1a73e8', padding: '2px 6px', borderRadius: '3px' }}>{t}</span>
                                                    ))}
                                                    {res.tags.length > 2 && <span style={{ fontSize: '10px', color: '#888' }}>+{res.tags.length - 2}</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>{res.category}</td>
                                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                                            {res.campus}{res.building && ` — ${res.building}`}
                                        </td>
                                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#333', textAlign: 'center' }}>{res.cap || '—'}</td>
                                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                                            <StatusBadge status={res.status} />
                                        </td>
                                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#333', textAlign: 'right' }}>
                                            <button
                                                onClick={() => openEdit(res)}
                                                style={{ padding: '5px 10px', background: '#fff3e0', color: '#e67e22', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginRight: '6px' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                style={{ padding: '5px 10px', background: '#fdecea', color: '#c0392b', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={closeModal}>
                    <div style={{ background: '#fff', borderRadius: 12, width: '90%', maxWidth: 600, padding: '24px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>
                                {editingId ? 'Edit Resource' : 'New Resource'}
                            </h3>
                            <button style={{ background: 'transparent', border: 'none', fontSize: 18, color: '#888', cursor: 'pointer' }} onClick={closeModal}>✕</button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={labelStyle}>Name *</label>
                            <input style={inputStyle} type="text" value={formData.name} onChange={(e) => setField('name', e.target.value)} />

                            <label style={labelStyle}>Category *</label>
                            <select style={inputStyle} value={formData.category} onChange={(e) => setField('category', e.target.value)}>
                                {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>

                            <label style={labelStyle}>Type</label>
                            <input style={inputStyle} type="text" value={formData.type} onChange={(e) => setField('type', e.target.value)} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Campus</label>
                                    <input style={inputStyle} type="text" value={formData.campus} onChange={(e) => setField('campus', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Building</label>
                                    <input style={inputStyle} type="text" value={formData.building} onChange={(e) => setField('building', e.target.value)} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Floor</label>
                                    <input style={inputStyle} type="text" value={formData.floor} onChange={(e) => setField('floor', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Capacity</label>
                                    <input style={inputStyle} type="number" value={formData.cap} onChange={(e) => setField('cap', e.target.value)} />
                                </div>
                            </div>

                            <label style={labelStyle}>Specifications</label>
                            <textarea style={{ ...inputStyle, minHeight: '80px' }} value={formData.specs} onChange={(e) => setField('specs', e.target.value)} />

                            <label style={labelStyle}>Tags</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {ALL_TAGS.map(tag => (
                                    <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.tags.includes(tag)} onChange={() => toggleFormTag(tag)} style={{ cursor: 'pointer' }} />
                                        <span style={{ fontSize: 12 }}>{tag}</span>
                                    </label>
                                ))}
                            </div>

                            <label style={labelStyle}>Status</label>
                            <select style={inputStyle} value={formData.status} onChange={(e) => setField('status', e.target.value)}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>

                            <div style={{ marginTop: 16 }}>
                                <label style={labelStyle}>Availability</label>
                                {formData.availabilityWindows.map((window, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginTop: 8 }}>
                                        <select style={inputStyle} value={window.day} onChange={(e) => updateWindow(i, 'day', e.target.value)}>
                                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <input style={inputStyle} type="time" value={window.start} onChange={(e) => updateWindow(i, 'start', e.target.value)} />
                                        <input style={inputStyle} type="time" value={window.end} onChange={(e) => updateWindow(i, 'end', e.target.value)} />
                                        <button type="button" onClick={() => removeWindow(i)} style={{ padding: '8px 12px', background: '#fdecea', color: '#c0392b', border: 'none', borderRadius: 5, cursor: 'pointer' }}>✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addWindow} style={{ marginTop: 8, padding: '8px 12px', background: '#f0f2f5', color: '#1a1a2e', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                    + Add Time Slot
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                                <button type="button" style={{ padding: '9px 16px', background: '#f0f2f5', color: '#555', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={closeModal}>Cancel</button>
                                <button type="submit" style={{ padding: '9px 16px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                    {editingId ? 'Update' : 'Create'} Resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

const inputStyle = { padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 7, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', width: '100%' };
const labelStyle = { fontSize: 12, color: '#888', fontWeight: 600, marginTop: 6 };
