import React, { useState } from 'react';
import {
    LayoutDashboard,
    Box,
    Calendar,
    Wrench,
    Bell,
    Search,
    Users,
    Monitor,
    MapPin,
    Wifi,
    Wind,
    Stethoscope,
    Dumbbell,
    Library,
    Mic2,
    Filter,
    ChevronDown
} from 'lucide-react';

// --- Mock Data ---
const categoriesData = [
    {
        title: "Academic Spaces",
        icon: <Monitor className="w-5 h-5" />,
        color: "blue",
        items: [
            { id: 'LH301', name: "Lecture Hall LH301", type: "Lecture Hall", loc: "Malabe", cap: 120, status: "Active", tags: ['AC', 'Wifi'] },
            { id: 'LAB202', name: "Lab 202", type: "Lab", loc: "Computing Bld", cap: 50, status: "Active", tags: ['PC', 'Wifi'] },
        ]
    },
    {
        title: "Study & Library Spaces",
        icon: <Library className="w-5 h-5" />,
        color: "green",
        items: [
            { id: 'LIB_MAIN', name: "Main Library", type: "Study Area", loc: "Floor 2", cap: 300, status: "Active", noise: "Silent", seats: 0.65 },
            { id: 'GSR401', name: "Group Study Room", type: "Meeting Room", loc: "Floor 4", cap: 8, status: "Active", tags: ['Whiteboard'] },
        ]
    },
    {
        title: "Sports & Fitness",
        icon: <Dumbbell className="w-5 h-5" />,
        color: "red",
        items: [
            { id: 'GYM01', name: "Student Gym", type: "Fitness", loc: "Sports Complex", status: "Active", crowd: "Medium" },
        ]
    }
];

// --- Sub-Components ---

const StatusBadge = ({ status }) => {
    const colors = {
        Active: "bg-green-100 text-green-700",
        "Out of Service": "bg-red-100 text-red-700",
        "Maintenance": "bg-yellow-100 text-yellow-700"
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>{status}</span>;
};

const ResourceCard = ({ item }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-gray-800">{item.name}</h4>
            <StatusBadge status={item.status} />
        </div>
        <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p className="flex items-center gap-2"><Box size={14} /> Type: {item.type}</p>
            <p className="flex items-center gap-2"><MapPin size={14} /> Location: {item.loc}</p>
            {item.cap && <p className="flex items-center gap-2"><Users size={14} /> Capacity: {item.cap}</p>}

            {item.crowd && (
                <div className="mt-2">
                    <span className="text-xs uppercase font-bold">Crowd Level: </span>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
                        <div className={`h-2 rounded-full ${item.crowd === 'High' ? 'bg-red-500 w-full' : 'bg-orange-400 w-1/2'}`} />
                    </div>
                </div>
            )}
        </div>
        <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">View Details</button>
            <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Book Now</button>
        </div>
    </div>
);

// --- Main Dashboard Component ---

export default function CampusDashboard() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [minCapacity, setMinCapacity] = useState(0);

    // Filter Logic
    const filteredCategories = categoriesData.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            (activeCategory === "All" || cat.title === activeCategory) &&
            (item.cap ? item.cap >= minCapacity : true)
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">

            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 text-xl font-bold text-blue-700 flex items-center gap-2 border-b border-gray-50">
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs">SH</div>
                    Smart Campus
                </div>

                {/* Main Navigation */}
                <nav className="p-4 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
                    {[
                        { icon: <LayoutDashboard size={18} />, label: "Dashboard" },
                        { icon: <Box size={18} />, label: "Resources", active: true },
                        { icon: <Calendar size={18} />, label: "Bookings" },
                        { icon: <Wrench size={18} />, label: "Maintenance" },
                    ].map((item, idx) => (
                        <a key={idx} href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                            {item.icon} {item.label}
                        </a>
                    ))}
                </nav>

                {/* Sidebar Filter Section */}
                <div className="p-4 border-t border-gray-100 space-y-6">
                    <div className="px-4 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filters</p>
                        <Filter size={12} className="text-gray-400" />
                    </div>

                    {/* Resource Type Filter */}
                    <div className="space-y-2 px-2">
                        <label className="text-xs font-semibold text-gray-700 px-2 flex items-center justify-between cursor-pointer group">
                            Resource Type <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-500" />
                        </label>
                        <div className="space-y-1">
                            {["All", "Academic Spaces", "Study & Library Spaces", "Sports & Fitness"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Capacity Slider Filter */}
                    <div className="space-y-3 px-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-gray-700">Min. Capacity</label>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">{minCapacity} pax</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={minCapacity}
                            onChange={(e) => setMinCapacity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Quick Tags Toggle */}
                    <div className="px-4 space-y-3">
                        <label className="text-xs font-semibold text-gray-700">Preferences</label>
                        <div className="space-y-2">
                            {[
                                { label: 'Air Conditioned', icon: <Wind size={12} /> },
                                { label: 'High-speed WiFi', icon: <Wifi size={12} /> },
                            ].map((tag, i) => (
                                <label key={i} className="flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="flex items-center gap-1.5">{tag.icon} {tag.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => { setActiveCategory("All"); setMinCapacity(0); }}
                        className="w-full py-2 text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search resources, labs, equipment..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium hidden sm:block">Admin User</span>
                            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Facilities & Assets Catalogue</h1>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: "Total Resources", val: "350", color: "text-blue-600" },
                            { label: "Available Now", val: "295", color: "text-green-600" },
                            { label: "Most Used", val: "Auditorium", color: "text-orange-600" },
                            { label: "Active Bookings", val: "45", color: "text-purple-600" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Featured Auditorium Section */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-3xl border border-orange-200 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div>
                                    <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit mb-4">
                                        <Mic2 size={12} /> EVENT ENABLED
                                    </span>
                                    <h2 className="text-3xl font-black text-orange-900 mb-2">Main Auditorium SLIIT</h2>
                                    <p className="text-orange-800/70 mb-4 max-w-md">State-of-the-art facility equipped with professional sound systems and 1000+ seating capacity.</p>
                                    <div className="flex gap-6 mb-6">
                                        <div className="text-center"><p className="text-xs text-orange-800 font-bold uppercase">Capacity</p><p className="text-xl font-bold">1000+</p></div>
                                        <div className="text-center"><p className="text-xs text-orange-800 font-bold uppercase">Stage</p><p className="text-xl font-bold">Pro-Grade</p></div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors">Create Event</button>
                                        <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold border border-orange-200 hover:bg-orange-50 transition-colors">View Schedule</button>
                                    </div>
                                </div>
                                <div className="hidden md:block w-64 h-40 bg-white/50 rounded-2xl border border-orange-200 p-4">
                                    <p className="text-xs font-bold text-orange-800 mb-2 underline">UPCOMING EVENT</p>
                                    <p className="font-bold">Global Hackathon 2026</p>
                                    <p className="text-xs text-orange-700 mt-1">Starts: Tomorrow, 09:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dynamic Filtered Categories */}
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat, idx) => (
                            <section key={idx} className="mb-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className={`p-2 rounded-lg bg-${cat.color}-100 text-${cat.color}-600`}>
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-lg font-bold">{cat.title}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {cat.items.map(item => <ResourceCard key={item.id} item={item} />)}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Box className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 font-medium">No resources match your current filters.</p>
                            <button onClick={() => { setActiveCategory("All"); setMinCapacity(0); }} className="mt-4 text-blue-600 font-bold text-sm">Clear all filters</button>
                        </div>
                    )}

                    {/* Student Services (Small Slots) */}
                    <section className="mb-10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Stethoscope className="text-pink-500" /> Student Medical Services
                        </h3>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="font-bold">University Health Center</p>
                                <p className="text-sm text-gray-500">Dr. Aruni Perera (Available Today)</p>
                            </div>
                            <div className="flex gap-2">
                                {['09:00', '10:30', '14:00', '15:30'].map(slot => (
                                    <button key={slot} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-500 hover:text-blue-500 transition-all">
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Quick Book</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}