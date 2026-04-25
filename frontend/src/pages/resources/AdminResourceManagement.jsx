import React, { useState } from 'react';
import {
    LayoutDashboard, Box, Calendar, Wrench, Bell, Search, Plus,
    Edit2, Trash2, Filter, X, ChevronDown, Settings, LogOut,
    ShieldCheck, Activity, AlertTriangle
} from 'lucide-react';

// --- Initial Mock Data ---
const initialResources = [
    { id: 1, name: "Lecture Hall LH301", type: "Lecture Hall", cap: 120, loc: "Malabe - Floor 3", status: "Active" },
    { id: 2, name: "Computing Lab 202", type: "Lab", cap: 50, loc: "IT Building", status: "Active" },
    { id: 3, name: "Projector Pro-X", type: "Equipment", cap: null, loc: "Main Library", status: "Out of Service" },
    { id: 4, name: "Conference Room B", type: "Meeting Room", cap: 15, loc: "Admin Block", status: "Maintenance" },
];

export default function AdminResourceManagement() {
    const [resources, setResources] = useState(initialResources);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleStatusChange = (id, newStatus) => {
        setResources(resources.map(res => res.id === id ? { ...res, status: newStatus } : res));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this resource?")) {
            setResources(resources.filter(res => res.id !== id));
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 text-xl font-bold text-blue-700 flex items-center gap-2 border-b border-slate-50">
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs shadow-lg shadow-blue-100">SH</div>
                    Smart Campus
                </div>

                {/* Main Navigation */}
                <nav className="p-4 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Management</p>
                    {[
                        { icon: <LayoutDashboard size={18} />, label: "Admin Overview" },
                        { icon: <Box size={18} />, label: "Resource Catalogue", active: true },
                        { icon: <Calendar size={18} />, label: "Booking Approvals" },
                        { icon: <Wrench size={18} />, label: "Maintenance Tickets" },
                        { icon: <Bell size={18} />, label: "System Logs" },
                    ].map((item, idx) => (
                        <a key={idx} href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {item.icon} {item.label}
                        </a>
                    ))}
                </nav>

                {/* Admin Quick Stats Panel */}
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

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 overflow-y-auto">
                {/* Navbar */}
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
                                placeholder="Find a resource..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all"
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
                        <div className="flex gap-2">
                            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                                <Box size={14} /> Total: {resources.length}
                            </span>
                            <span className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg text-xs font-bold text-green-600 flex items-center gap-2">
                                <Activity size={14} /> Online: {resources.filter(r => r.status === 'Active').length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <Plus size={20} /> New Resource
                        </button>
                    </div>

                    {/* Table Container */}
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
                                    {resources.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((res) => (
                                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <p className="font-bold text-slate-800 leading-tight">{res.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">RID-{res.id}0024</p>
                                            </td>
                                            <td className="p-5"><span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{res.type}</span></td>
                                            <td className="p-5 text-sm text-slate-600 font-medium">{res.loc}</td>
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
                                                    <option value="Maintenance">Maintenance</option>
                                                </select>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(res.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal - Add Resource */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">New Resource</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block px-1">Resource Name</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="e.g. IT Lab 04" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block px-1">Type</label>
                                    <select className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50">
                                        <option>Lecture Hall</option>
                                        <option>Lab</option>
                                        <option>Equipment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block px-1">Capacity</label>
                                    <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50" placeholder="0" />
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-200 mt-4 transition-all active:scale-95"
                            >
                                Register Resource
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}