import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard, Box, Calendar, Wrench, Bell, Search, Users,
    Monitor, MapPin, Wifi, Wind, Stethoscope, Dumbbell, Library,
    Mic2, Filter, ChevronDown
} from 'lucide-react';
import { useResources } from './ResourceContext';
import ResourceDetailModal from './ResourceDetailModal';
import './CampusDashboard.css';

const CATEGORY_META = [
    { title: 'Academic Spaces',          icon: <Monitor   size={20} />, color: 'blue'   },
    { title: 'Study & Library Spaces',   icon: <Library   size={20} />, color: 'green'  },
    { title: 'Sports & Fitness',         icon: <Dumbbell  size={20} />, color: 'red'    },
    { title: 'Student Medical Services', icon: <Stethoscope size={20} />, color: 'pink' },
    { title: 'Events & Auditorium',      icon: <Mic2      size={20} />, color: 'orange' },
    { title: 'Equipment',                icon: <Box       size={20} />, color: 'purple' },
];

const NAV_ITEMS = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { icon: <Box             size={18} />, label: 'Resources', active: true },
    { icon: <Calendar        size={18} />, label: 'Bookings' },
    { icon: <Wrench          size={18} />, label: 'Maintenance' },
];

function StatusBadge({ status }) {
    const key = status?.toLowerCase().replace(/\s+/g, '-');
    return <span className={`cd-status-badge ${key}`}>{status}</span>;
}

function ResourceCard({ item, onViewDetails }) {
    const crowdClass = item.crowd === 'High' ? 'high' : item.crowd ? 'medium' : null;
    return (
        <div className="cd-resource-card">
            <div className="cd-resource-card-top">
                <span className="cd-resource-name">{item.name}</span>
                <StatusBadge status={item.status} />
            </div>
            <div className="cd-resource-meta">
                <div className="cd-resource-meta-item"><Box size={14} /> Type: {item.type}</div>
                <div className="cd-resource-meta-item"><MapPin size={14} /> {item.loc}</div>
                {item.cap && <div className="cd-resource-meta-item"><Users size={14} /> Capacity: {item.cap}</div>}
                {item.crowd && (
                    <div>
                        <div className="cd-crowd-label">Crowd Level:</div>
                        <div className="cd-crowd-bar-wrap">
                            <div className={`cd-crowd-bar ${crowdClass}`} />
                        </div>
                    </div>
                )}
            </div>
            <div className="cd-card-actions">
                <button className="cd-btn-view" onClick={() => onViewDetails(item.id)}>View Details</button>
                <button className="cd-btn-book">Book Now</button>
            </div>
        </div>
    );
}

export default function CampusDashboard() {
    const { resources } = useResources();

    const [activeCategory, setActiveCategory] = useState('All');
    const [minCapacity, setMinCapacity]         = useState(0);
    const [searchTerm, setSearchTerm]           = useState('');
    const [selectedCampus, setSelectedCampus]   = useState('All');
    const [activeTags, setActiveTags]           = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);

    const campuses = useMemo(
        () => ['All', ...new Set(resources.filter(r => !r.archived).map(r => r.campus))],
        [resources]
    );

    const categoriesData = useMemo(() =>
        CATEGORY_META.map(meta => ({
            ...meta,
            items: resources
                .filter(r => !r.archived && r.category === meta.title)
                .map(r => ({ id: r.id, name: r.name, type: r.type, loc: r.loc, cap: r.cap, status: r.status, tags: r.tags, crowd: r.crowd })),
        })),
        [resources]
    );

    const totalCount  = resources.filter(r => !r.archived).length;
    const activeCount = resources.filter(r => !r.archived && r.status === 'Active').length;
    const auditorium  = resources.find(r => r.id === 'AUD_MAIN') || {};
    const medCenter   = resources.find(r => r.id === 'MED01')    || {};

    const toggleTag = (tag) =>
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    const filteredCategories = categoriesData.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            (activeCategory === 'All' || cat.title === activeCategory) &&
            (item.cap ? item.cap >= minCapacity : true) &&
            (searchTerm === '' ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.type?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCampus === 'All' || resources.find(r => r.id === item.id)?.campus === selectedCampus) &&
            (activeTags.length === 0 || activeTags.every(tag => item.tags?.includes(tag)))
        ),
    })).filter(cat => cat.items.length > 0);

    const handleViewDetails = (id) => {
        const resource = resources.find(r => r.id === id);
        if (resource) setSelectedResource(resource);
    };

    const resetFilters = () => {
        setActiveCategory('All');
        setMinCapacity(0);
        setSearchTerm('');
        setSelectedCampus('All');
        setActiveTags([]);
    };

    return (
        <div className="cd-layout">

            {/* ── Sidebar ── */}
            <aside className="cd-sidebar">
                <div className="cd-sidebar-logo">
                    <div className="cd-logo-icon">SH</div>
                    Smart Campus
                </div>

                <nav className="cd-nav">
                    <p className="cd-nav-section-label">Main Menu</p>
                    {NAV_ITEMS.map((item, i) => (
                        <button key={i} className={`cd-nav-link${item.active ? ' active' : ''}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="cd-filters">
                    <div className="cd-filter-header">
                        Filters <Filter size={12} />
                    </div>

                    {/* Category filter */}
                    <div className="cd-filter-section">
                        <label className="cd-filter-label">
                            Resource Type <ChevronDown size={14} />
                        </label>
                        <div className="cd-filter-list">
                            {['All', ...CATEGORY_META.map(m => m.title)].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`cd-filter-btn${activeCategory === cat ? ' active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Capacity slider */}
                    <div>
                        <div className="cd-capacity-row">
                            <span className="cd-capacity-label">Min. Capacity</span>
                            <span className="cd-capacity-badge">{minCapacity} pax</span>
                        </div>
                        <input
                            type="range" min="0" max="500" step="10"
                            value={minCapacity}
                            onChange={(e) => setMinCapacity(parseInt(e.target.value))}
                            className="cd-range"
                        />
                    </div>

                    {/* Campus filter */}
                    <div className="cd-filter-section">
                        <label className="cd-filter-label">Campus / Location</label>
                        <select
                            value={selectedCampus}
                            onChange={(e) => setSelectedCampus(e.target.value)}
                            className="cd-select"
                        >
                            {campuses.map(c => (
                                <option key={c} value={c}>{c === 'All' ? 'All Campuses' : c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Preference tags */}
                    <div>
                        <label className="cd-filter-label" style={{ padding: '0 16px', marginBottom: 8 }}>Preferences</label>
                        <div className="cd-tag-list">
                            {[
                                { label: 'Air Conditioned', icon: <Wind size={12} />, value: 'AC' },
                                { label: 'High-speed WiFi', icon: <Wifi size={12} />, value: 'Wifi' },
                            ].map((tag, i) => (
                                <label key={i} className="cd-tag-item">
                                    <input
                                        type="checkbox"
                                        checked={activeTags.includes(tag.value)}
                                        onChange={() => toggleTag(tag.value)}
                                    />
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {tag.icon} {tag.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button className="cd-reset-btn" onClick={resetFilters}>Reset Filters</button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="cd-main">

                {/* Top navbar */}
                <header className="cd-topbar">
                    <div className="cd-search-wrap">
                        <span className="cd-search-icon"><Search size={18} /></span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search resources, labs, equipment..."
                            className="cd-search-input"
                        />
                    </div>
                    <div className="cd-topbar-actions">
                        <button className="cd-notif-btn">
                            <Bell size={20} />
                            <span className="cd-notif-dot" />
                        </button>
                        <div className="cd-user-chip">
                            <span className="cd-user-name">Campus User</span>
                            <div className="cd-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="cd-content">
                    <h1 className="cd-page-title">Facilities & Assets Catalogue</h1>

                    {/* Stat cards */}
                    <div className="cd-stat-grid">
                        {[
                            { label: 'Total Resources', val: String(totalCount),  color: 'blue'   },
                            { label: 'Available Now',   val: String(activeCount), color: 'green'  },
                            { label: 'Most Used',       val: 'Auditorium',        color: 'orange' },
                            { label: 'Active Bookings', val: '45',                color: 'purple' },
                        ].map((s, i) => (
                            <div key={i} className="cd-stat-card">
                                <p className="cd-stat-label">{s.label}</p>
                                <p className={`cd-stat-value ${s.color}`}>{s.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Featured auditorium */}
                    <section className="cd-featured">
                        <div className="cd-featured-box">
                            <div className="cd-featured-inner">
                                <div>
                                    <div className="cd-event-tag">
                                        <Mic2 size={12} /> EVENT ENABLED
                                    </div>
                                    <h2 className="cd-featured-title">
                                        {auditorium.name || 'Main Auditorium SLIIT'}
                                    </h2>
                                    <p className="cd-featured-desc">
                                        State-of-the-art facility equipped with professional sound systems and{' '}
                                        {auditorium.cap ? `${auditorium.cap}+` : '1000+'} seating capacity.
                                    </p>
                                    <div className="cd-featured-stats">
                                        <div>
                                            <div className="cd-featured-stat-label">Capacity</div>
                                            <div className="cd-featured-stat-val">{auditorium.cap ? `${auditorium.cap}+` : '1000+'}</div>
                                        </div>
                                        <div>
                                            <div className="cd-featured-stat-label">Stage</div>
                                            <div className="cd-featured-stat-val">Pro-Grade</div>
                                        </div>
                                    </div>
                                    <div className="cd-featured-actions">
                                        <button className="cd-btn-primary-orange">Create Event</button>
                                        <button className="cd-btn-outline-orange" onClick={() => handleViewDetails('AUD_MAIN')}>
                                            View Schedule
                                        </button>
                                    </div>
                                </div>
                                <div className="cd-upcoming-card">
                                    <div className="cd-upcoming-label">Upcoming Event</div>
                                    <div className="cd-upcoming-title">Global Hackathon 2026</div>
                                    <div className="cd-upcoming-time">Starts: Tomorrow, 09:00 AM</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filtered resource categories */}
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat, idx) => (
                            <section key={idx} className="cd-section">
                                <div className="cd-section-header">
                                    <div className={`cd-category-icon ${cat.color}`}>{cat.icon}</div>
                                    <h3 className="cd-section-title">{cat.title}</h3>
                                </div>
                                <div className="cd-resource-grid">
                                    {cat.items.map(item => (
                                        <ResourceCard key={item.id} item={item} onViewDetails={handleViewDetails} />
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="cd-empty">
                            <Box size={48} style={{ color: '#d1d5db', margin: '0 auto' }} />
                            <p className="cd-empty-text">No resources match your current filters.</p>
                            <button className="cd-empty-link" onClick={resetFilters}>Clear all filters</button>
                        </div>
                    )}

                    {/* Medical services */}
                    <section className="cd-section">
                        <div className="cd-section-header">
                            <div className="cd-category-icon pink"><Stethoscope size={20} /></div>
                            <h3 className="cd-section-title">Student Medical Services</h3>
                        </div>
                        <div className="cd-medical-card">
                            <div>
                                <div className="cd-medical-name">{medCenter.name || 'University Health Center'}</div>
                                <div className="cd-medical-sub">Dr. Aruni Perera (Available Today)</div>
                            </div>
                            <div className="cd-slot-row">
                                {['09:00', '10:30', '14:00', '15:30'].map(slot => (
                                    <button key={slot} className="cd-slot-btn">{slot}</button>
                                ))}
                            </div>
                            <button className="cd-btn-quick-book">Quick Book</button>
                        </div>
                    </section>
                </div>
            </main>

            {selectedResource && (
                <ResourceDetailModal
                    resource={selectedResource}
                    onClose={() => setSelectedResource(null)}
                />
            )}
        </div>
    );
}
