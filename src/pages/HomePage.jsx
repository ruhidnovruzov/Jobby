import React, { useState, useEffect, useRef } from 'react';
import { get } from '../api/service';
import { Briefcase, Search, AlertCircle } from 'lucide-react';
import JobFilterForm from '../components/Home/JobFilterForm';
import JobList from '../components/Home/JobList';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        filterValue: '',
        categoryId: '',
        columnName: 'createdDate',
        orderBy: 'desc'
    });
    const debounceTimer = useRef(null);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Bilinməyən';
    };

    const fetchJobs = async (filterValue = '', categoryId = '', sortColumn = 'createdDate', sortOrder = 'desc') => {
        try {
            setLoading(true);
            setError('');
            let url = '/vacancies?';
            const params = [];
            
            if (filterValue.trim()) {
                params.push(`FilterValue=${encodeURIComponent(filterValue.trim())}`);
            }
            if (categoryId) {
                params.push(`categoryId=${encodeURIComponent(categoryId)}`);
            }
            params.push(`ColumnName=${encodeURIComponent(sortColumn)}`);
            params.push(`OrderBy=${encodeURIComponent(sortOrder)}`);
            
            url += params.join('&');
            
            const response = await get(url);
            setJobs(response.data?.data || []);
            setError('');
        } catch (err) {
            console.error('İş elanları çəkilərkən xəta:', err);
            setError(err.response?.data?.message || 'İş elanları yüklənə bilmədi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Kategoriyaları yüklə
        const fetchCategories = async () => {
            try {
                const response = await get('/categories');
                setCategories(response.data?.data || []);
            } catch (err) {
                console.error('Kateqoriyalar çəkilərkən xəta:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Debounce the filter changes - wait 1 second after user stops typing
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        setLoading(true);

        debounceTimer.current = setTimeout(() => {
            fetchJobs(filters.filterValue, filters.categoryId, filters.columnName, filters.orderBy);
        }, 1000);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
        // eslint-disable-next-line
    }, [filters.filterValue, filters.categoryId, filters.columnName, filters.orderBy]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // İsə salma dərhal
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        fetchJobs(filters.filterValue, filters.categoryId, filters.columnName, filters.orderBy);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-transparent"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
                        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300/15 rounded-full blur-2xl"></div>
                    </div>

                    <div className="container mx-auto px-4 py-20 relative z-10">
                        <div className="text-center text-white space-y-6">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                    <Briefcase className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                                Mövcud İş Elanları
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                                Mükəmməl karyera imkanlarını kəşf edin və xəyallarınızdakı işi tapın
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-blue-200">
                                <Search className="w-5 h-5" />
                                <span className="text-lg">Axtarışa başlayın və uğura çatın</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-0 md:px-4 py-12 relative -mt-8">
                    {/* Filter Section */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-sm mb-12 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <Search className="w-6 h-6 mr-3 text-blue-600" />
                                Axtarış Filtri
                            </h2>
                            <p className="text-gray-600 mt-2">İstədiyiniz iş elanlarını tapmaq üçün filterləri istifadə edin</p>
                        </div>
                        <div className="md:p-8 p-4">
                            <JobFilterForm
                                filters={filters}
                                onChange={handleFilterChange}
                                onSubmit={handleFilterSubmit}
                            />
                        </div>
                    </div>

                    {/* Results Section - Loading */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <Briefcase className="w-6 h-6 mr-3 text-indigo-600" />
                                İş Elanları
                            </h2>
                        </div>
                        <div className="md:p-8 p-4">
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                                    <p className="text-xl font-semibold text-gray-700">Məlumatlar yüklənir...</p>
                                    <p className="text-sm text-gray-500 mt-2">Zəhmət olmasa gözləyin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="fixed inset-0 -z-10 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-transparent"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
                    <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300/15 rounded-full blur-2xl"></div>
                </div>

                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="text-center text-white space-y-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                <Briefcase className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                            Mövcud İş Elanları
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Mükəmməl karyera imkanlarını kəşf edin və xəyallarınızdakı işi tapın
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-blue-200">
                            <Search className="w-5 h-5" />
                            <span className="text-lg">Axtarışa başlayın və uğura çatın</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-0 md:px-4  py-12 relative -mt-8">
                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-sm mb-12 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Search className="w-6 h-6 mr-3 text-blue-600" />
                            Axtarış Filtri
                        </h2>
                        <p className="text-gray-600 mt-2">İstədiyiniz iş elanlarını tapmaq üçün filterləri istifadə edin</p>
                    </div>
                    <div className="md:p-8 p-4">
                        <JobFilterForm
                            filters={filters}
                            onChange={handleFilterChange}
                            onSubmit={handleFilterSubmit}
                        />
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <Briefcase className="w-6 h-6 mr-3 text-indigo-600" />
                                    İş Elanları
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    {jobs.length > 0 ? `${jobs.length} iş elanı tapıldı` : 'Heç bir iş elanı tapılmadı'}
                                </p>
                            </div>
                            
                            {/* Sorting Buttons */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setFilters({ ...filters, orderBy: 'desc' })}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        filters.orderBy === 'desc'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                    title="Ən yeni elanlar"
                                >
                                    Ən Yeni ↓
                                </button>
                                <button
                                    onClick={() => setFilters({ ...filters, orderBy: 'asc' })}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        filters.orderBy === 'asc'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                    title="Ən köhnə elanlar"
                                >
                                    Ən Köhnə ↑
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="md:p-8 p-4">
                        <JobList jobs={jobs} categories={categories} getCategoryName={getCategoryName} loading={loading} error={error} onRetry={() => fetchJobs(filters.filterValue, filters.categoryId, filters.columnName, filters.orderBy)} />
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>
        </div>
    );
};

export default HomePage;
