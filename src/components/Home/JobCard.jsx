import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, Clock } from 'lucide-react';

const JobCard = ({ job, getCategoryName = null }) => {
    const navigate = useNavigate();
    const getCategoryName_ = getCategoryName || ((id) => `ID: ${id}`);
    
    return (




    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden hover:border-blue-200 hover:-translate-y-1">
        {/* Card Header */}
        <div className="p-6 pb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{job.createdDate || 'Tarix mövcud deyil'}</span>
            </div>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-6 space-y-4">
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {job.description || 'Təsvir mövcud deyil'}
                </p>
            </div>

            {/* Category */}
            <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-600">Kateqoriya:</span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {getCategoryName_(job.categoryId) || 'Qeyd edilməyib'}
                </span>
            </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 pb-6">
            <button className="group/btn cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                onClick={() => navigate(`/jobs/${job.id}`)}
            >
                <div className="flex items-center justify-center space-x-2">
                    <span>Ətraflı Məlumat</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </div>
            </button>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
    );
};

export default JobCard;