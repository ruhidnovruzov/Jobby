import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

const Quiz = () => {
    const { applicantId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Geri Qayıt</span>
                </button>

                {/* Quiz Container */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-12 text-white">
                        <div className="flex items-center space-x-4 mb-4">
                            <BookOpen className="w-10 h-10" />
                            <h1 className="text-4xl font-bold">Quiz</h1>
                        </div>
                        <p className="text-blue-100 text-lg">
                            Sualları cavablandıraraq sözləşmənin üçüncü mərhələsinə keçin
                        </p>
                    </div>

                    {/* Quiz Content */}
                    <div className="p-8">
                        <div className="text-center py-16 space-y-6">
                            <div className="inline-block p-6 bg-blue-100 rounded-full">
                                <BookOpen className="w-12 h-12 text-blue-600" />
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Yüklənir</h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Quiz mərhələsi işlənilir. Zəhmət olmasa bir az gözləyin.
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                                <p className="text-blue-900 font-medium">
                                    Applicant ID: <span className="font-bold">{applicantId}</span>
                                </p>
                            </div>

                            {/* Loading Animation */}
                            <div className="flex justify-center space-x-2 mt-8">
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Suallar</h3>
                        <p className="text-gray-600 text-sm">
                            Müxtəlif mövzularda suallar cavablandırmalı olacaqsınız
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">⏱️</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Zaman</h3>
                        <p className="text-gray-600 text-sm">
                            Quiz cavablandırması üçün müəyyən zaman limitiniz olacaq
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Nəticə</h3>
                        <p className="text-gray-600 text-sm">
                            Nəticə dərhal hesablanacaq və sizə göstərilər
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
