import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../api/service';
import { Briefcase, Calendar, Tag, ArrowLeft, AlertCircle, Loader } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Bilinməyən';
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await get(`/vacancies/${id}`);
                // Backend direkt veriyi döndürüyor, data.data değil
                const jobData = response.data?.data || response.data;
                if (jobData && jobData.id) {
                    setJob(jobData);
                } else {
                    setError('İş ayrıntıları tapılmadı.');
                }
            } catch (err) {
                console.error('İş detayları çəkilərkən xəta:', err);
                setError(err.response?.data?.message || 'İş ayrıntıları yüklənə bilmədi.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    useEffect(() => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700">Məlumatlar yüklənir...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="w-16 h-16 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Xəta Baş Verdi</h2>
                    <p className="text-center text-gray-600 mb-6">{error || 'İş ayrıntıları tapılmadı.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                        Geri Qayıt
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Geri Qayıt</span>
                </button>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-12 text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{job.title}</h1>
                        
                        {/* Meta Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="flex items-center space-x-3">
                                <Tag className="w-6 h-6 flex-shrink-0" />
                                <div>
                                    <p className="text-blue-100 text-sm">Kateqoriya</p>
                                    <p className="text-lg font-semibold">{getCategoryName(job.categoryId)}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-6 h-6 flex-shrink-0" />
                                <div>
                                    <p className="text-blue-100 text-sm">Yaranma Tarixi</p>
                                    <p className="text-lg font-semibold">{job.createdDate || 'Bilinməyən'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Briefcase className="w-6 h-6 flex-shrink-0" />
                                <div>
                                    <p className="text-blue-100 text-sm">Status</p>
                                    <p className="text-lg font-semibold">
                                        {job.isActive ? '✓ Aktiv' : '⊗ Qeyri-Aktiv'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="px-8 py-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">İş Təsviri</h2>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                                {job.description || 'Təsvir mövcud deyil'}
                            </p>
                        </div>

                        {/* Application Status Alert */}
                        {!job.isActive && (
                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 font-medium">
                                    ⚠️ Bu vakansiya artıq qeyri-aktivdir və müraciat qəbul etmir.
                                </p>
                            </div>
                        )}

                        {/* Apply Button */}
                        <div className="mt-8">
                            <button
                                onClick={() => navigate(`/jobs/${job.id}/apply`, { state: { job } })}
                                disabled={!job.isActive}
                                className={`w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg ${
                                    job.isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl transform hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {job.isActive ? 'Müraciet Et' : 'Vakansiya Bağlanıb'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JobDetails;
