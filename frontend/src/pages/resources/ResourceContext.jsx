import React, { createContext, useContext, useState } from 'react';

const weekdayHours = [
    { day: 'Monday', start: '08:00', end: '18:00' },
    { day: 'Tuesday', start: '08:00', end: '18:00' },
    { day: 'Wednesday', start: '08:00', end: '18:00' },
    { day: 'Thursday', start: '08:00', end: '18:00' },
    { day: 'Friday', start: '08:00', end: '17:00' },
];

const initialResources = [
    // ── Academic Spaces ────────────────────────────────────────────────
    {
        id: 'LH301', name: 'Lecture Hall LH301', category: 'Academic Spaces',
        type: 'Lecture Hall', campus: 'Malabe', building: 'Main Block', floor: 'Floor 3',
        loc: 'Main Block, Floor 3', cap: 120, status: 'Active', tags: ['AC', 'Wifi'],
        specs: 'Smart board, overhead projector, tiered seating for 120 students.',
        availabilityWindows: weekdayHours, archived: false,
    },
    {
        id: 'LAB202', name: 'Computing Lab 202', category: 'Academic Spaces',
        type: 'Lab', campus: 'Malabe', building: 'IT Building', floor: 'Floor 2',
        loc: 'IT Building, Floor 2', cap: 50, status: 'Active', tags: ['PC', 'Wifi', 'AC'],
        specs: '50 Windows PCs with dual monitors, high-speed internet access.',
        availabilityWindows: weekdayHours, archived: false,
    },
    {
        id: 'MR_A101', name: 'Meeting Room A101', category: 'Academic Spaces',
        type: 'Meeting Room', campus: 'Malabe', building: 'Admin Block', floor: 'Floor 1',
        loc: 'Admin Block, Floor 1', cap: 20, status: 'Active', tags: ['Wifi', 'Whiteboard', 'AC'],
        specs: 'Video conferencing unit, interactive whiteboard, projector screen.',
        availabilityWindows: weekdayHours, archived: false,
    },
    // ── Study & Library Spaces ─────────────────────────────────────────
    {
        id: 'LIB_MAIN', name: 'Main Library', category: 'Study & Library Spaces',
        type: 'Study Area', campus: 'Malabe', building: 'Library Block', floor: 'Floor 2',
        loc: 'Library Block, Floor 2', cap: 300, status: 'Active', tags: ['Wifi', 'AC'],
        specs: '300 silent reading seats, reference section, printing services.',
        noise: 'Silent',
        availabilityWindows: [
            { day: 'Monday', start: '07:30', end: '21:00' },
            { day: 'Tuesday', start: '07:30', end: '21:00' },
            { day: 'Wednesday', start: '07:30', end: '21:00' },
            { day: 'Thursday', start: '07:30', end: '21:00' },
            { day: 'Friday', start: '07:30', end: '20:00' },
            { day: 'Saturday', start: '09:00', end: '17:00' },
        ],
        archived: false,
    },
    {
        id: 'GSR401', name: 'Group Study Room 401', category: 'Study & Library Spaces',
        type: 'Meeting Room', campus: 'Malabe', building: 'Library Block', floor: 'Floor 4',
        loc: 'Library Block, Floor 4', cap: 8, status: 'Active', tags: ['Whiteboard', 'Wifi'],
        specs: 'Whiteboard, wall-mounted TV screen, marker set.',
        availabilityWindows: weekdayHours, archived: false,
    },
    // ── Sports & Fitness ──────────────────────────────────────────────
    {
        id: 'GYM01', name: 'Student Gym', category: 'Sports & Fitness',
        type: 'Fitness', campus: 'Malabe', building: 'Sports Complex', floor: 'Ground',
        loc: 'Sports Complex', cap: null, status: 'Active', tags: ['AC'],
        specs: 'Cardio machines, free weights, resistance training equipment.',
        crowd: 'Medium',
        availabilityWindows: [
            { day: 'Monday', start: '06:00', end: '21:00' },
            { day: 'Tuesday', start: '06:00', end: '21:00' },
            { day: 'Wednesday', start: '06:00', end: '21:00' },
            { day: 'Thursday', start: '06:00', end: '21:00' },
            { day: 'Friday', start: '06:00', end: '20:00' },
            { day: 'Saturday', start: '08:00', end: '18:00' },
            { day: 'Sunday', start: '08:00', end: '14:00' },
        ],
        archived: false,
    },
    {
        id: 'TC02', name: 'Tennis Court 02', category: 'Sports & Fitness',
        type: 'Sports Court', campus: 'Malabe', building: 'Sports Complex', floor: 'Outdoor',
        loc: 'Sports Complex, Outdoor', cap: 4, status: 'Active', tags: [],
        specs: 'Outdoor floodlit hard court, equipment rental available at counter.',
        availabilityWindows: weekdayHours, archived: false,
    },
    // ── Student Medical Services ───────────────────────────────────────
    {
        id: 'MED01', name: 'University Health Center', category: 'Student Medical Services',
        type: 'Medical', campus: 'Malabe', building: 'Admin Block', floor: 'Ground Floor',
        loc: 'Admin Block, Ground Floor', cap: 10, status: 'Active', tags: ['AC'],
        specs: 'General consultation, first aid, pharmacy counter.',
        availabilityWindows: [
            { day: 'Monday', start: '09:00', end: '16:00' },
            { day: 'Tuesday', start: '09:00', end: '16:00' },
            { day: 'Wednesday', start: '09:00', end: '16:00' },
            { day: 'Thursday', start: '09:00', end: '16:00' },
            { day: 'Friday', start: '09:00', end: '15:00' },
        ],
        archived: false,
    },
    // ── Events & Auditorium ────────────────────────────────────────────
    {
        id: 'AUD_MAIN', name: 'Main Auditorium SLIIT', category: 'Events & Auditorium',
        type: 'Auditorium', campus: 'Malabe', building: 'Main Building', floor: 'Ground Floor',
        loc: 'Main Building, Ground Floor', cap: 1000, status: 'Active',
        tags: ['AC', 'Wifi', 'Stage', 'Sound System'],
        specs: 'Pro-grade stage, surround sound, 1000+ seats, live streaming capable.',
        availabilityWindows: weekdayHours, archived: false,
    },
    // ── Equipment ─────────────────────────────────────────────────────
    {
        id: 'EQ_PROJ01', name: 'Projector Pro-X', category: 'Equipment',
        type: 'Equipment', campus: 'Malabe', building: 'Main Library', floor: 'Floor 1',
        loc: 'Main Library, Equipment Room', cap: null, status: 'Out of Service',
        tags: ['4K', 'HDMI'], specs: '4K UHD, HDMI/VGA input, 5000 lumens, carry bag included.',
        availabilityWindows: weekdayHours, archived: false,
    },
    {
        id: 'EQ_CAM01', name: 'Canon DSLR Camera', category: 'Equipment',
        type: 'Equipment', campus: 'Malabe', building: 'Media Lab', floor: 'Floor 2',
        loc: 'Media Lab, Floor 2', cap: null, status: 'Active',
        tags: ['4K', 'HD'], specs: '24.2MP, 4K video, 18-55mm kit lens, tripod included.',
        availabilityWindows: weekdayHours, archived: false,
    },
    {
        id: 'EQ_LAP01', name: 'Dell Laptop L04', category: 'Equipment',
        type: 'Equipment', campus: 'Malabe', building: 'IT Building', floor: 'Floor 1',
        loc: 'IT Building, Equipment Room', cap: null, status: 'Active',
        tags: ['Wifi'], specs: 'Intel i7 12th Gen, 16GB RAM, 512GB NVMe SSD, Windows 11.',
        availabilityWindows: weekdayHours, archived: false,
    },
];

const ResourceContext = createContext(null);

export function ResourceProvider({ children }) {
    const [resources, setResources] = useState(initialResources);

    const addResource = (newRes) => {
        const id = `RES-${Date.now().toString(36).toUpperCase()}`;
        const loc = `${newRes.building}${newRes.floor ? ', ' + newRes.floor : ''}`;
        setResources(prev => [...prev, { ...newRes, id, loc, archived: false }]);
    };

    const updateResource = (id, updatedData) => {
        setResources(prev => prev.map(r => {
            if (r.id !== id) return r;
            const loc = `${updatedData.building || r.building}${(updatedData.floor || r.floor) ? ', ' + (updatedData.floor || r.floor) : ''}`;
            return { ...r, ...updatedData, loc };
        }));
    };

    const archiveResource = (id) => {
        setResources(prev => prev.map(r => r.id === id ? { ...r, archived: true } : r));
    };

    const deleteResource = (id) => {
        setResources(prev => prev.filter(r => r.id !== id));
    };

    return (
        <ResourceContext.Provider value={{ resources, addResource, updateResource, archiveResource, deleteResource }}>
            {children}
        </ResourceContext.Provider>
    );
}

export function useResources() {
    const ctx = useContext(ResourceContext);
    if (!ctx) throw new Error('useResources must be used within a ResourceProvider');
    return ctx;
}
