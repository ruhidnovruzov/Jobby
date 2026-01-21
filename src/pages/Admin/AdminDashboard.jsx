import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../api/service';
import { User } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // User info-nu API-dən çəkir
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await get('/auth/user-info');
        setUserInfo(response.data);
      } catch (error) {
        console.error('User info çəkilərkən xəta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <nav className="bg-white shadow-md">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-600">Hoş gəldiniz, {user?.displayName}</p>
            </div>

            {/* User Info - Sağ Yuxarı */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {loading ? 'Yüklənir...' : userInfo?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Ümumi İstifadəçilər</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">--</p>
                </div>
                <svg className="w-12 h-12 text-blue-600 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Şirkətlər</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">--</p>
                </div>
                <svg className="w-12 h-12 text-green-600 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">İş Elanları</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">--</p>
                </div>
                <svg className="w-12 h-12 text-purple-600 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h2>
            <p className="text-gray-600 mb-6">
              Bu Admin Paneli hazırlanmaqdadır. Tezliklə tamamlanmış funksionallar əlavə olunacaq.
            </p>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Şəxsi Məlumatlar:</strong> {user?.displayName} ({user?.role})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;