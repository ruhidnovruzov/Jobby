import React from 'react';
import { Search, Building2, MapPin, Clock, Award, DollarSign, Tag } from 'lucide-react';

const JobFilterForm = ({ filters, onChange, onSubmit }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        {/* First Row - Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                    name="title"
                    value={filters.title}
                    onChange={onChange}
                    placeholder="İş başlığı axtarın..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
            </div>
            
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                    name="companyName"
                    value={filters.companyName}
                    onChange={onChange}
                    placeholder="Şirkət adı..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
            </div>
            
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                    name="location"
                    value={filters.location}
                    onChange={onChange}
                    placeholder="Şəhər və ya region..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
            </div>
        </div>

        {/* Second Row - Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={onChange}
                    className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                    <option value="">İş növü seçin</option>
                    <option value="Tam İş Günü">Tam İş Günü</option>
                    <option value="Yarım İş Günü">Yarım İş Günü</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Award className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <select
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={onChange}
                    className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                    <option value="">Təcrübə səviyyəsi</option>
                    <option value="Təcrübəsiz">Təcrübəsiz</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <select
                    name="salaryRange"
                    value={filters.salaryRange}
                    onChange={onChange}
                    className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                    <option value="">Maaş aralığı</option>
                    <option value="1-500 AZN">1-500 AZN</option>
                    <option value="501-1000 AZN">501-1000 AZN</option>
                    <option value="1001-2000 AZN">1001-2000 AZN</option>
                    <option value="2001-3000 AZN">2001-3000 AZN</option>
                    <option value="3000+ AZN">3000+ AZN</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                    name="category"
                    value={filters.category}
                    onChange={onChange}
                    placeholder="Kateqoriya..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
            </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
            <button 
                type="submit" 
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
                <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5 group-hover:animate-pulse" />
                    <span>İş Elanlarını Axtar</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            </button>
        </div>
    </form>
);

export default JobFilterForm;