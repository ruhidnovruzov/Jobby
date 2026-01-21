import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Building2,
  Briefcase,
  Tag,
  TrendingUp,
  UserCheck,
  Calendar,
  Activity,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Eye,
  Clock
} from 'lucide-react';

const DashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalCategories: 0,
    recentUsers: [],
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Paralel sorğular göndər
      const [usersRes, jobsRes, categoriesRes] = await Promise.all([
        axios.get('https://job-server-tcq9.onrender.com/api/admin/users', config),
        axios.get('https://job-server-tcq9.onrender.com/api/jobs', config),
        axios.get('https://job-server-tcq9.onrender.com/api/categories', config)
      ]);

      const users = usersRes.data;
      const jobs = jobsRes.data.data;
      const categories = categoriesRes.data.data;

      // Şirkət sayını hesabla
      const companies = users.filter(user => user.role === 'company');
      const applicants = users.filter(user => user.role === 'applicant');

      // Son 5 istifadəçi
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Son 5 iş elanı
      const recentJobs = jobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalApplicants: applicants.length,
        totalCompanies: companies.length,
        totalJobs: jobs.length,
        totalCategories: categories.length,
        recentUsers,
        recentJobs
      });
    } catch (err) {
      console.error('Dashboard statistikaları gətirilərkən xəta:', err);
      setError('Statistikalar yüklənə bilmədi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
          <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-blue-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Statistikalar Yüklənir</h3>
          <p className="text-gray-600">Məlumatlar hazırlanır...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <div className="text-center max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Xəta Baş Verdi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Yenidən Cəhd Et
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Ümumi İstifadəçilər',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      change: '+12%',
      isPositive: true
    },
    {
      title: 'İş Axtaranlar',
      value: stats.totalApplicants,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      change: '+8%',
      isPositive: true
    },
    {
      title: 'Şirkətlər',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      change: '+15%',
      isPositive: true
    },
    {
      title: 'İş Elanları',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      change: '+23%',
      isPositive: true
    },
    {
      title: 'Kateqoriyalar',
      value: stats.totalCategories,
      icon: Tag,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      change: '+5%',
      isPositive: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`}></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-3 text-blue-600" />
              Son Qeydiyyatlar
            </h3>
          </div>
          <div className="p-6">
            {stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user, index) => (
                  <div key={user._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'applicant'
                      ? 'bg-green-100 text-green-600'
                      : user.role === 'company'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-blue-600'
                      }`}>
                      {user.role === 'applicant' ? (
                        <UserCheck className="w-5 h-5" />
                      ) : user.role === 'company' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Users className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {user.profile?.firstName && user.profile?.lastName
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : user.profile?.companyName || user.email
                        }
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Hələ heç bir istifadəçi yoxdur</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Briefcase className="w-5 h-5 mr-3 text-orange-600" />
              Son İş Elanları
            </h3>
          </div>
          <div className="p-6">
            {stats.recentJobs.length > 0 ? (
              <div className="space-y-4">
                {stats.recentJobs.map((job, index) => (
                  <div key={job._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.company?.companyName}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString('az-AZ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Hələ heç bir iş elanı yoxdur</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Activity className="w-5 h-5 mr-3 text-indigo-600" />
            Sürətli Əməliyyatlar
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Bütün İstifadəçilər</p>
                <p className="text-sm text-gray-500">Siyahıya bax</p>
              </div>
            </button>

            <button className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Yeni Kateqoriya</p>
                <p className="text-sm text-gray-500">Əlavə et</p>
              </div>
            </button>

            <button className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-200 border border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Şirkət Siyahısı</p>
                <p className="text-sm text-gray-500">İdarə et</p>
              </div>
            </button>

            <button className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all duration-200 border border-orange-200">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">İş Elanları</p>
                <p className="text-sm text-gray-500">Nəzarət et</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;