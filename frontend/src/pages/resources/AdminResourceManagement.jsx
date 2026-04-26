import React, { useState } from 'react';
import {
    LayoutDashboard, Box, Calendar, Wrench, Bell, Search, Plus,
    Edit2, Trash2, X, ChevronDown, Settings, LogOut,
    ShieldCheck, Activity, AlertTriangle, Archive
} from 'lucide-react';
import { useResources } from './ResourceContext';

const ALL_CATEGORIES = [
    'Academic Spaces', 'Study & Library Spaces', 'Sports & Fitness',
    'Student Medical Services', 'Events & Auditorium', 'Equipment',
];
const ALL_TAGS   = ['AC', 'Wifi', 'PC', 'Whiteboard', '4K', 'HD', 'Stage', 'Sound System', 'HDMI', 'VGA', 'Projector'];
const DAYS       = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUSES   = ['Active', 'Out of Service', 'Under Maintenance'];

const emptyForm = {
    name: '', category: 'Academic Spaces', type: '', campus: 'Malabe',
    building: '', floor: '', cap: '', specs: '', tags: [],
    availabilityWindows: [{ day: 'Monday', start: '08:00', end: '18:00' }],
    status: 'Active',
};

const StatusBadge = ({ status }) => {
    const cls = {
        Active: 'bg-green-100 text-green-700 ring-green-200',
        'Out of Service': 'bg-red-100 text-red-700 ring-red-200',
        Maintenance: 'bg-amber-100 text-amber-700 ring-amber-200',
        'Under Maintenance': 'bg-amber-100 text-amber-700 ring-amber-200',
    };
    return (
        <span className={`text-xs font-bold rounded-xl px-3 py-1.5 ring-1 ${cls[status] || 'bg-gray-100 text-gray-600 ring-gray-200'}`}>
            {status}
        </span>
    );
};

export default function AdminResourceManagement() {
    const { resources, addResource, updateResource, archiveResource, deleteResource } = useResources();

    const [searchTerm,   setSearchTerm]   = useState('');
    const [isModalOpen,  setIsModalOpen]  = useState(false);
    const [editingId,    setEditingId]    = useState(null);
    const [formData,     setFormData]     = useState(emptyForm);
    const [showArchived, setShowArchived] = useState(false);

    // ── Form helpers ─────────────────────────────────────────────────────
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

    // ── Modal open / close ────────────────────────────────────────────────
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

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = () => {
        if (!formData.name.trim()) return alert('Resource name is required.');
        const payload = { ...formData, cap: formData.cap !== '' ? parseInt(formData.cap) : null };
        editingId ? updateResource(editingId, payload) : addResource(payload);
        closeModal();
    };

    // ── Table actions ─────────────────────────────────────────────────────
    const handleStatusChange = (id, newStatus) => updateResource(id, { status: newStatus });

    const handleArchive = (id) => {
        if (window.confirm('Archive this resource? It will be hidden from the catalogue.')) archiveResource(id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Permanently delete this resource?')) deleteResource(id);
    };

    // ── Filtered table rows ───────────────────────────────────────────────
    const visibleResources = resources
        .filter(r => showArchived ? r.archived : !r.archived)
        .filter(r =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.loc || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    const activeCount = resources.filter(r => !r.archived && r.status === 'Active').length;

    // ── Input style ───────────────────────────────────────────────────────
    const inp = 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all';
    const lbl = 'text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block px-1';

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 text-xl font-bold text-blue-700 flex items-center gap-2 border-b border-slate-50">
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs shadow-lg shadow-blue-100">SH</div>
                    Smart Campus
                </div>
                <nav className="p-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Management</p>
                    {[
                        { icon: <LayoutDashboard size={18} />, label: 'Admin Overview' },
                        { icon: <Box size={18} />, label: 'Resource Catalogue', active: true },
                        { icon: <Calendar size={18} />, label: 'Booking Approvals' },
                        { icon: <Wrench size={18} />, label: 'Maintenance Tickets' },
                        { icon: <Bell size={18} />, label: 'System Logs' },
                    ].map((item, idx) => (
                        <a key={idx} href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {item.icon} {item.label}
                        </a>
                    ))}
                </nav>
                <div className="mt-auto p-4 space-y-4">
                    <div className="bg-slate-900 rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck size={16} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">System Status</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 flex items-center gap-1"><Activity size={12} /> Active Nodes</span>
                                <span className="font-bold text-green-400">99.8%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 flex items-center gap-1"><AlertTriangle size={12} /> Critical Issues</span>
                                <span className="font-bold text-amber-400">02</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-tight">Module A</h2>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Catalogue Management</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, type, location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-72 outline-none transition-all"
                            />
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden shadow-sm">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="admin" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">Admin Panel</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Action Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                                <Box size={14} /> Total: {resources.filter(r => !r.archived).length}
                            </span>
                            <span className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg text-xs font-bold text-green-600 flex items-center gap-2">
                                <Activity size={14} /> Online: {activeCount}
                            </span>
                            <button
                                onClick={() => setShowArchived(p => !p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-colors ${showArchived ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'}`}
                            >
                                <Archive size={14} /> {showArchived ? 'Show Active' : 'View Archived'}
                            </button>
                        </div>
                        <button
                            onClick={openCreate}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <Plus size={20} /> New Resource
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Name</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cap.</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {visibleResources.map((res) => (
                                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <p className="font-bold text-slate-800 leading-tight">{res.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{res.id}</p>
                                                {res.tags && res.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                                        {res.tags.slice(0, 3).map(t => (
                                                            <span key={t} className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md">{t}</span>
                                                        ))}
                                                        {res.tags.length > 3 && <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">+{res.tags.length - 3}</span>}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{res.type}</span>
                                                <p className="text-[10px] text-slate-400 mt-1">{res.category}</p>
                                            </td>
                                            <td className="p-5 text-sm text-slate-600 font-medium">
                                                <p>{res.campus}</p>
                                                <p className="text-[10px] text-slate-400">{res.building}{res.floor ? ', ' + res.floor : ''}</p>
                                            </td>
                                            <td className="p-5 text-sm text-slate-800 text-center font-black">{res.cap || '—'}</td>
                                            <td className="p-5">
                                                <select
                                                    value={res.status}
                                                    onChange={(e) => handleStatusChange(res.id, e.target.value)}
                                                    className={`text-xs font-bold rounded-xl px-3 py-1.5 border-none outline-none cursor-pointer transition-all
                                                        ${res.status === 'Active' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
                                                          res.status === 'Out of Service' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
                                                          'bg-amber-100 text-amber-700 ring-1 ring-amber-200'}`}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Out of Service">Out of Service</option>
                                                    <option value="Under Maintenance">Under Maintenance</option>
                                                </select>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => openEdit(res)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {!res.archived && (
                                                        <button onClick={() => handleArchive(res.id)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Archive">
                                                            <Archive size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(res.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {visibleResources.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                                                No resources found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center shrink-0">
                            <h3 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Resource' : 'New Resource'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body – scrollable */}
                        <div className="px-8 pb-4 overflow-y-auto space-y-5 flex-1">
                            {/* Name */}
                            <div>
                                <label className={lbl}>Resource Name *</label>
                                <input className={inp} placeholder="e.g. IT Lab 04" value={formData.name} onChange={e => setField('name', e.target.value)} />
                            </div>

                            {/* Category + Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={lbl}>Category</label>
                                    <select className={inp} value={formData.category} onChange={e => setField('category', e.target.value)}>
                                        {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={lbl}>Type</label>
                                    <input className={inp} placeholder="e.g. Lecture Hall, Lab, Equipment" value={formData.type} onChange={e => setField('type', e.target.value)} />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={lbl}>Campus</label>
                                    <input className={inp} placeholder="Malabe" value={formData.campus} onChange={e => setField('campus', e.target.value)} />
                                </div>
                                <div>
                                    <label className={lbl}>Building</label>
                                    <input className={inp} placeholder="IT Building" value={formData.building} onChange={e => setField('building', e.target.value)} />
                                </div>
                                <div>
                                    <label className={lbl}>Floor</label>
                                    <input className={inp} placeholder="Floor 2" value={formData.floor} onChange={e => setField('floor', e.target.value)} />
                                </div>
                            </div>

                            {/* Capacity + Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={lbl}>Capacity (leave blank for equipment)</label>
                                    <input type="number" className={inp} placeholder="0" value={formData.cap} onChange={e => setField('cap', e.target.value)} />
                                </div>
                                <div>
                                    <label className={lbl}>Status</label>
                                    <select className={inp} value={formData.status} onChange={e => setField('status', e.target.value)}>
                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Specs */}
                            <div>
                                <label className={lbl}>Technical Specifications</label>
                                <textarea
                                    rows={3}
                                    className={inp + ' resize-none'}
                                    placeholder="Describe features, equipment, and specifications..."
                                    value={formData.specs}
                                    onChange={e => setField('specs', e.target.value)}
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className={lbl}>Features & Amenities</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {ALL_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleFormTag(tag)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${formData.tags.includes(tag) ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Windows */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className={lbl + ' mb-0'}>Availability Windows</label>
                                    <button type="button" onClick={addWindow} className="text-xs font-bold text-blue-600 hover:text-blue-700">+ Add Window</button>
                                </div>
                                <div className="space-y-2">
                                    {formData.availabilityWindows.map((w, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2">
                                            <select
                                                value={w.day}
                                                onChange={e => updateWindow(i, 'day', e.target.value)}
                                                className="text-xs font-semibold bg-transparent outline-none cursor-pointer flex-1"
                                            >
                                                {DAYS.map(d => <option key={d}>{d}</option>)}
                                            </select>
                                            <input type="time" value={w.start} onChange={e => updateWindow(i, 'start', e.target.value)} className="text-xs bg-transparent outline-none cursor-pointer" />
                                            <span className="text-slate-400 text-xs">–</span>
                                            <input type="time" value={w.end} onChange={e => updateWindow(i, 'end', e.target.value)} className="text-xs bg-transparent outline-none cursor-pointer" />
                                            <button type="button" onClick={() => removeWindow(i)} className="text-slate-300 hover:text-red-500 transition-colors ml-1">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-slate-100 shrink-0">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all active:scale-95"
                            >
                                {editingId ? 'Save Changes' : 'Register Resource'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
