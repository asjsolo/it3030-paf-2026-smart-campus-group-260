import React from 'react';
import { X, MapPin, Users, Clock } from 'lucide-react';
import './CampusDashboard.css';

function StatusBadge({ status }) {
    const key = status?.toLowerCase().replace(/\s+/g, '-');
    return <span className={`rdm-status-badge ${key}`}>{status}</span>;
}

export default function ResourceDetailModal({ resource, onClose }) {
    if (!resource) return null;

    return (
        <div className="rdm-overlay" onClick={onClose}>
            <div className="rdm-box" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="rdm-header">
                    <div className="rdm-header-row">
                        <div>
                            <p className="rdm-category">{resource.category}</p>
                            <h2 className="rdm-title">{resource.name}</h2>
                            <p className="rdm-id">ID: {resource.id}</p>
                        </div>
                        <button className="rdm-close-btn" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="rdm-body">

                    {/* Status + Type */}
                    <div className="rdm-badges">
                        <StatusBadge status={resource.status} />
                        <span className="rdm-type-badge">{resource.type}</span>
                    </div>

                    {/* Location + Capacity */}
                    <div className={`rdm-info-grid${resource.cap ? ' two-col' : ''}`}>
                        <div className="rdm-info-box">
                            <p className="rdm-info-box-label">Location</p>
                            <p className="rdm-info-box-value">
                                <MapPin size={13} style={{ color: '#3b82f6', flexShrink: 0 }} />
                                {resource.campus}
                            </p>
                            {(resource.building || resource.floor) && (
                                <p className="rdm-info-box-sub">{[resource.building, resource.floor].filter(Boolean).join(', ')}</p>
                            )}
                        </div>
                        {resource.cap && (
                            <div className="rdm-info-box">
                                <p className="rdm-info-box-label">Capacity</p>
                                <p className="rdm-info-box-value">
                                    <Users size={13} style={{ color: '#3b82f6' }} />
                                    {resource.cap} persons
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                        <div>
                            <p className="rdm-section-label">Features & Amenities</p>
                            <div className="rdm-tag-list">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="rdm-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specs */}
                    {resource.specs && (
                        <div>
                            <p className="rdm-section-label">Technical Specifications</p>
                            <p className="rdm-specs-box">{resource.specs}</p>
                        </div>
                    )}

                    {/* Availability */}
                    {resource.availabilityWindows && resource.availabilityWindows.length > 0 && (
                        <div>
                            <p className="rdm-section-label">
                                <Clock size={10} /> Availability Windows
                            </p>
                            <div className="rdm-avail-list">
                                {resource.availabilityWindows.map((w, i) => (
                                    <div key={i} className="rdm-avail-row">
                                        <span className="rdm-avail-day">{w.day}</span>
                                        <span className="rdm-avail-time">{w.start} – {w.end}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="rdm-footer">
                    <button className="rdm-btn-close" onClick={onClose}>Close</button>
                    <button className="rdm-btn-book">Book Now</button>
                </div>
            </div>
        </div>
    );
}
