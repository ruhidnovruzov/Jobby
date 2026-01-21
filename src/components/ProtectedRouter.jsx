import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Shield, Lock, UserX } from 'lucide-react';

const ProtectedRoute = ({
    children,
    allowedRoles = [],
    requireAuth = true,
    redirectTo = '/auth'
}) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Loading zamanı heç bir yönləndirmə etmə, loading göstəricisi göstər
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    // Əgər authentication tələb olunursa və user login olmayıbsa
    if (requireAuth && (!user || !user.token)) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Əgər müəyyən rollar tələb olunursa və user-in rolu uyğun deyilsə
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                                <Shield className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-4 border-white">
                                <Lock className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="text-center max-w-md space-y-4">
                            <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
                                <AlertCircle className="w-6 h-6" />
                                <span className="text-lg font-semibold">403 - Giriş Qadağandır</span>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Bu Səhifəyə Giriş İcazəniz Yoxdur
                            </h2>

                            <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                                <div className="flex items-start space-x-3">
                                    <UserX className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-gray-700 font-medium mb-2">
                                            Sizin rolunuz: <span className="text-blue-600 font-semibold capitalize">{user?.role || 'Naməlum'}</span>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Bu səhifə yalnız aşağıdakı rollar üçün əlçatandır:
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {allowedRoles.map((role, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                                                >
                                                    {role === 'admin' ? 'Admin' :
                                                        role === 'company' ? 'Şirkət' :
                                                            role === 'applicant' ? 'İş Axtaran' : role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Geri Qayıt
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Ana Səhifə
                                </button>
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

    // Əgər hər şey qaydasındadırsa, children-i render et
    return <>{children}</>;
};

export default ProtectedRoute;