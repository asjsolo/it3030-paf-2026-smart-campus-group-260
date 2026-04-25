import React from 'react';
import { X, MapPin, Users, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const colors = {
        Active: 'bg-green-100 text-green-700',
        'Out of Service': 'bg-red-100 text-red-700',
        'Under Maintenance': 'bg-amber-100 text-amber-700',
        Maintenance: 'bg-amber-100 text-amber-700',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

export default function ResourceDetailModal({ resource, onClose }) {
    if (!resource) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1">{resource.category}</p>
                            <h2 className="text-xl font-black leading-tight">{resource.name}</h2>
                            <p className="text-blue-300 text-[10px] font-mono mt-1">ID: {resource.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Status + Type */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={resource.status} />
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{resource.type}</span>
                    </div>

                    {/* Location + Capacity */}
                    <div className={`grid gap-4 ${resource.cap ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location</p>
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                <MapPin size={13} className="text-blue-500 shrink-0" /> {resource.campus}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 pl-5">{resource.building}, {resource.floor}</p>
                        </div>
                        {resource.cap && (
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Capacity</p>
                                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                    <Users size={13} className="text-blue-500" /> {resource.cap} persons
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Features & Amenities</p>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specs */}
                    {resource.specs && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Specifications</p>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl p-4 leading-relaxed">{resource.specs}</p>
                        </div>
                    )}

                    {/* Availability Windows (FR-A10) */}
                    {resource.availabilityWindows && resource.availabilityWindows.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Clock size={10} /> Availability Windows
                            </p>
                            <div className="space-y-1.5">
                                {resource.availabilityWindows.map((w, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm bg-gray-50 hover:bg-blue-50 rounded-xl px-4 py-2 transition-colors">
                                        <span className="font-semibold text-gray-700 w-28">{w.day}</span>
                                        <span className="text-gray-400 text-xs">{w.start} – {w.end}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                    >
                        Close
                    </button>
                    <button className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}
