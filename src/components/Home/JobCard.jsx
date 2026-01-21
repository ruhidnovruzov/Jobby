import React from 'react';
import { Building2, MapPin, DollarSign, Tag, ArrowRight, Clock, Award } from 'lucide-react';

const defaultCompanyLogo = 'https://via.placeholder.com/150';

const JobCard = ({ job }) => (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden hover:border-blue-200 hover:-translate-y-1">
        {/* Card Header */}
        <div className="p-6 pb-4">
            <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-blue-300 transition-colors duration-300">
                        <img
                            src={job.company?.logoUrl && job.company.logoUrl !== defaultCompanyLogo
                                ? `https://job-server-tcq9.onrender.com${job.company.logoUrl}`
                                : defaultCompanyLogo}
                            alt={`${job.company?.companyName || 'Naməlum Şirkət'} Logosu`}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {job.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                            {job.company?.companyName || 'Naməlum Şirkət'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-6 space-y-4">
            {/* Job Details */}
            <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-500">Kateqoriya</span>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {job.category?.name || 'Naməlum'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-500">Yerləşmə</span>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {job.location}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-500">Maaş Aralığı</span>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {job.salaryRange || 'Qeyd edilməyib'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Info Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
                {job.jobType && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{job.jobType}</span>
                    </span>
                )}
                {job.experienceLevel && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        <Award className="w-3 h-3" />
                        <span>{job.experienceLevel}</span>
                    </span>
                )}
            </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 pb-6">
            <button className="group/btn w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                onClick={() => window.location.href = `/jobs/${job._id}`}
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

export default JobCard;