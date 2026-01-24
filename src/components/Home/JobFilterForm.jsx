import React, { useState, useEffect } from 'react';
import { Search, Tag } from 'lucide-react';
import { get } from '../../api/service';

const JobFilterForm = ({ filters, onChange, onSubmit }) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await get('/categories');
                setCategories(response.data?.data || []);
            } catch (err) {
                console.error('Kateqoriyalar çəkilərkən xəta:', err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search Field */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    </div>
                    <input
                        name="filterValue"
                        value={filters.filterValue}
                        onChange={onChange}
                        placeholder="Başlıq və ya təsvir ilə axtarın..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Tag className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    </div>
                    <select
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={onChange}
                        disabled={loadingCategories}
                        className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-sm hover:shadow-md appearance-none cursor-pointer disabled:bg-gray-100"
                    >
                        <option value="">Hamısı</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center pt-4">
                <button 
                    type="submit" 
                    className="group relative cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
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
};

export default JobFilterForm;