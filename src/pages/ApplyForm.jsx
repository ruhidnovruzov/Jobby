import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { post } from '../api/service';
import { Upload, ArrowLeft, AlertCircle, Loader } from 'lucide-react';

const ApplyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const job = location.state?.job;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cvFile: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, cvFile: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setError('Bütün məcburi sahələri doldurun.');
            return;
        }

        if (!formData.cvFile) {
            setError('Zəhmət olmasa CV faylını seçin.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Zəhmət olmasa düzgün email ünvanı daxil edin.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formDataObj = new FormData();
            // Backend camelCase bekliyor ve VacancyId integer olmalı
            formDataObj.append('vacancyId', parseInt(id));
            formDataObj.append('firstName', formData.firstName.trim());
            formDataObj.append('lastName', formData.lastName.trim());
            formDataObj.append('email', formData.email.trim());
            formDataObj.append('phone', formData.phone.trim());

            // CV File kontrolü
            if (formData.cvFile && formData.cvFile instanceof File) {
                formDataObj.append('cvFile', formData.cvFile);
            } else {
                setError('CV faylı seçilməyib. Zəhmət olmasa yenidən cəhd edin.');
                setLoading(false);
                return;
            }

            // Debug: FormData içeriğini kontrol et
            console.log('FormData entries:', Array.from(formDataObj.entries()));

            const response = await post('/applicants', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            // Backend response'undan applicant ID'sini al
            const applicantId = response.data?.data?.id || response.data?.id || id;
            // Redirect to quiz page after 2 seconds
            setTimeout(() => {
                navigate(`/quiz/${applicantId}`);
            }, 2000);
        } catch (err) {
            console.error('Müraciət Göndərilərkən xəta:', err);
            setError(err.response?.data?.message || 'Müraciət Göndərilə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-3xl">✓</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Müraciət Qəbul Edildi!</h2>
                    <p className="text-gray-600 mb-6">Quiz səhifəsinə yönləndirilirsiniz...</p>
                    <Loader className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Geri Qayıt</span>
                </button>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-12 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Müraciət Et</h1>
                        {job && (
                            <p className="text-blue-100">
                                <span className='font-semibold'>"{job.title}"</span> üçün müraciət edirsiniz
                            </p>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ad *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Adınızı daxil edin"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Soyad *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Soyadınızı daxil edin"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="emailiniz@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+994 50 XXX XX XX"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* CV File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CV Faylı (PDF, DOC, DOCX) *
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    id="cvFile"
                                    disabled={loading}
                                    required
                                />
                                <label
                                    htmlFor="cvFile"
                                    className={`flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-200 ${formData.cvFile
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'hover:border-gray-400 hover:bg-gray-50'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Upload className="w-5 h-5 text-gray-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-700">
                                            {formData.cvFile
                                                ? formData.cvFile.name
                                                : 'Fayl seçin və ya sürükləyin'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            PDF(Maksimum 5MB)
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full cursor-pointer py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl transform hover:scale-105'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Müraciət Göndərilir...</span>
                                    </>
                                ) : (
                                    <span>Müraciət Göndər</span>
                                )}
                            </button>
                        </div>

                        {/* Info Text */}
                        <p className="text-sm text-gray-600 text-center">
                            * Bütün sahələr məcburidir
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyForm;
