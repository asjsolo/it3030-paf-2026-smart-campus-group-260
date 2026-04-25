import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Backend properties
const API_URL = 'http://localhost:8082/api/resources';

const ResourceContext = createContext(null);

// Mapper: Frontend -> Backend
const toBackend = (frontendData) => {
    // Determine Backend Enum Type based on Category
    let backendType = 'LECTURE_HALL';
    if (frontendData.category === 'Study & Library Spaces') backendType = 'STUDY_AREA';
    else if (frontendData.category === 'Sports & Fitness') backendType = 'FITNESS';
    else if (frontendData.category === 'Student Medical Services') backendType = 'MEDICAL';
    else if (frontendData.category === 'Events & Auditorium') backendType = 'AUDITORIUM';
    else if (frontendData.category === 'Equipment') backendType = 'EQUIPMENT';

    // Pack extra fields into JSON description
    const extraData = {
        category: frontendData.category,
        typeStr: frontendData.type,
        specs: frontendData.specs || '',
        tags: frontendData.tags || [],
        archived: frontendData.archived || false
    };

    // Location string (Campus, Building, Floor)
    const locArr = [frontendData.campus, frontendData.building, frontendData.floor].filter(Boolean);

    // Normalize Status
    let backendStatus = 'ACTIVE';
    if (frontendData.status === 'Out of Service') backendStatus = 'OUT_OF_SERVICE';
    if (frontendData.status === 'Under Maintenance' || frontendData.status === 'Maintenance') backendStatus = 'UNDER_MAINTENANCE';

    return {
        name: frontendData.name,
        type: backendType,
        capacity: frontendData.cap || null,
        location: locArr.join('|'), // Using pipe for easy splitting
        description: JSON.stringify(extraData),
        availabilityWindows: JSON.stringify(frontendData.availabilityWindows || []),
        status: backendStatus // Sent for PUT/PATCH
    };
};

// Mapper: Backend -> Frontend
const toFrontend = (backendData) => {
    // Parse extra fields from Description
    let extra = {};
    try {
        if (backendData.description && backendData.description.startsWith('{')) {
            extra = JSON.parse(backendData.description);
        }
    } catch (e) {
        console.error("Failed to parse description JSON", e);
    }

    // Parse location parts
    const locParts = (backendData.location || '').split('|');
    const campus = locParts[0] || '';
    const building = locParts[1] || '';
    const floor = locParts[2] || '';

    // Constructed location display string (e.g. "IT Building, Floor 2")
    const locDisplay = [building, floor].filter(Boolean).join(', ');

    // Parse availability
    let parsedWindows = [];
    try {
        parsedWindows = backendData.availabilityWindows ? JSON.parse(backendData.availabilityWindows) : [];
    } catch (e) {}

    // Map status back
    let displayStatus = 'Active';
    if (backendData.status === 'OUT_OF_SERVICE') displayStatus = 'Out of Service';
    if (backendData.status === 'UNDER_MAINTENANCE') displayStatus = 'Under Maintenance';

    return {
        id: String(backendData.id),
        name: backendData.name,
        category: extra.category || 'Academic Spaces',
        type: extra.typeStr || 'Room',
        campus: campus,
        building: building,
        floor: floor,
        loc: locDisplay || campus || 'Unknown',
        cap: backendData.capacity || null,
        status: displayStatus,
        specs: extra.specs || '',
        tags: extra.tags || [],
        availabilityWindows: parsedWindows,
        archived: extra.archived || false,
    };
};

export function ResourceProvider({ children }) {
    const [resources, setResources] = useState([]);

    // Fetch on Mount
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            // Using size=100 for now to get all items without pagination logic on frontend frontend yet
            const res = await axios.get(`${API_URL}?size=100`);
            const mapped = res.data.content.map(toFrontend);
            setResources(mapped);
        } catch (err) {
            console.error("Failed to fetch resources:", err);
        }
    };

    const addResource = async (newRes) => {
        try {
            const payload = toBackend(newRes);
            const res = await axios.post(API_URL, payload);
            
            // If the status isn't ACTIVE, we must patch it immediately since POST forces ACTIVE in backend
            if (payload.status !== 'ACTIVE') {
                 await axios.patch(`${API_URL}/${res.data.id}/status?status=${payload.status}`);
            }

            fetchAll(); // Reload to get true server state
        } catch (err) {
            console.error("Failed to add resource:", err);
            alert("Error adding resource check console.");
        }
    };

    const updateResource = async (id, updatedData) => {
        try {
            // Find existing to merge context (for instance, we need to send name/location even if updating just one field)
            const existing = resources.find(r => r.id === id);
            const merged = { ...existing, ...updatedData };
            const payload = toBackend(merged);

            // PUT updates data
            await axios.put(`${API_URL}/${id}`, payload);
            
            // If status changed, PATCH it
            if (updatedData.status && existing.status !== updatedData.status) {
                await axios.patch(`${API_URL}/${id}/status?status=${payload.status}`);
            }

            fetchAll();
        } catch (err) {
            console.error("Failed to update resource:", err);
        }
    };

    const archiveResource = async (id) => {
        try {
            const existing = resources.find(r => r.id === id);
            const merged = { ...existing, archived: true };
            const payload = toBackend(merged);
            await axios.put(`${API_URL}/${id}`, payload);
            fetchAll();
        } catch (err) {
            console.error("Failed to archive:", err);
        }
    };

    const deleteResource = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchAll();
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    };

    return (
        <ResourceContext.Provider value={{ resources, addResource, updateResource, archiveResource, deleteResource, refreshData: fetchAll }}>
            {children}
        </ResourceContext.Provider>
    );
}

export function useResources() {
    const ctx = useContext(ResourceContext);
    if (!ctx) throw new Error('useResources must be used within a ResourceProvider');
    return ctx;
}

