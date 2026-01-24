import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../api/service';
import { User, Briefcase, TrendingUp, Users, Loader, AlertCircle, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Top Vacancies
  const [topVacancies, setTopVacancies] = useState([]);
  const [topVacanciesLoading, setTopVacanciesLoading] = useState(false);
  const [topVacanciesCount, setTopVacanciesCount] = useState(5);
  const [topVacanciesInput, setTopVacanciesInput] = useState('5');

  // Success Rates
  const [successRates, setSuccessRates] = useState([]);
  const [successRatesLoading, setSuccessRatesLoading] = useState(false);

  // Top Applicants
  const [topApplicants, setTopApplicants] = useState([]);
  const [topApplicantsLoading, setTopApplicantsLoading] = useState(false);
  const [topApplicantsCount, setTopApplicantsCount] = useState(5);
  const [topApplicantsInput, setTopApplicantsInput] = useState('5');

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

  // Fetch Top Vacancies
  const fetchTopVacancies = async (count = 5) => {
    try {
      setTopVacanciesLoading(true);
      const response = await get(`/vacancies/top?topCount=${count}`);
      const data = response.data?.data || response.data || [];
      setTopVacancies(data);
    } catch (error) {
      console.error('Top vacancies çəkilərkən xəta:', error);
      setTopVacancies([]);
    } finally {
      setTopVacanciesLoading(false);
    }
  };

  // Fetch Success Rates
  const fetchSuccessRates = async () => {
    try {
      setSuccessRatesLoading(true);
      const response = await get('/categories/success-rates');
      const data = response.data?.data || response.data || [];
      setSuccessRates(data);
    } catch (error) {
      console.error('Success rates çəkilərkən xəta:', error);
      setSuccessRates([]);
    } finally {
      setSuccessRatesLoading(false);
    }
  };

  // Fetch Top Applicants
  const fetchTopApplicants = async (count = 5) => {
    try {
      setTopApplicantsLoading(true);
      const response = await get(`/applicants/top?topCount=${count}`);
      const data = response.data?.data || response.data || [];
      setTopApplicants(data);
    } catch (error) {
      console.error('Top applicants çəkilərkən xəta:', error);
      setTopApplicants([]);
    } finally {
      setTopApplicantsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTopVacancies(topVacanciesCount);
    fetchSuccessRates();
    fetchTopApplicants(topApplicantsCount);
  }, []);

  // Handle Top Vacancies Count Change
  const handleTopVacanciesSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(topVacanciesInput) || 5;
    if (count > 0) {
      setTopVacanciesCount(count);
      fetchTopVacancies(count);
    }
  };

  // Handle Top Applicants Count Change
  const handleTopApplicantsSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(topApplicantsInput) || 5;
    if (count > 0) {
      setTopApplicantsCount(count);
      fetchTopApplicants(count);
    }
  };

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
              <p className="text-sm text-gray-600">Xoş gəldiniz, {user?.displayName}</p>
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

          {/* Section 1: Top Vakansiyalar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span>Top Vakansiyalar</span>
              </h2>
              <form onSubmit={handleTopVacanciesSubmit} className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={topVacanciesInput}
                  onChange={(e) => setTopVacanciesInput(e.target.value)}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Say"
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  Yenilə
                </button>
              </form>
            </div>

            {topVacanciesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Yüklənir...</span>
              </div>
            ) : topVacancies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Məlumat tapılmadı</div>
            ) : (
              <div className="space-y-4">
                {topVacancies.map((category) => (
                  <div key={category.categoryId} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <span className="text-blue-600">{category.categoryName}</span>
                    </h3>
                    <div className="space-y-2">
                      {category.vacancies && category.vacancies.length > 0 ? (
                        category.vacancies.map((vacancy) => (
                          <div
                            key={vacancy.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{vacancy.title}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-blue-600">{vacancy.applicantCount || 0}</p>
                              <p className="text-xs text-gray-500">Namizəd</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Bu kateqoriyada vakansiya yoxdur</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: En Yüksek Neticeli Kategori */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Ən Yüksək Nəticəli Kateqoriya</span>
              </h2>
            </div>

            {successRatesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Yüklənir...</span>
              </div>
            ) : successRates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Məlumat tapılmadı</div>
            ) : (
              <div>
                {/* Bar Chart */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={successRates.map(cat => ({
                        name: cat.name,
                        'Uğur Dərəcəsi (%)': parseFloat((cat.successRate || 0).toFixed(2)),
                        'Namizəd Sayı': cat.applicantCount || 0
                      }))}
                      margin={{ top: 20, right: 30, left: 100, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        width={60}
                        domain={[0, 100]}
                        label={{ 
                          value: 'Uğur Dərəcəsi (%)', 
                          angle: -90, 
                          position: 'left',
                          style: { textAnchor: 'middle' },
                          offset: -10
                        }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Uğur Dərəcəsi (%)') {
                            return [`${value}%`, 'Uğur Dərəcəsi'];
                          }
                          return [value, name];
                        }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="Uğur Dərəcəsi (%)" radius={[8, 8, 0, 0]}>
                        {successRates.map((entry, index) => {
                          const rate = entry.successRate || 0;
                          let color = '#ef4444'; // red
                          if (rate >= 70) {
                            color = '#10b981'; // green
                          } else if (rate >= 50) {
                            color = '#3b82f6'; // blue
                          }
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Stats Table */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Detallı Məlumatlar</h3>
                  <div className="space-y-2">
                    {successRates.map((category) => {
                      const rate = category.successRate || 0;
                      let badgeColor = 'bg-red-100 text-red-800';
                      if (rate >= 70) {
                        badgeColor = 'bg-green-100 text-green-800';
                      } else if (rate >= 50) {
                        badgeColor = 'bg-blue-100 text-blue-800';
                      }

                      return (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{category.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">Namizəd sayı: {category.applicantCount || 0}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block ${badgeColor} text-sm font-semibold px-3 py-1 rounded-full`}>
                              {rate.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Top Namizədlər */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span>Top Namizədlər</span>
              </h2>
              <form onSubmit={handleTopApplicantsSubmit} className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={topApplicantsInput}
                  onChange={(e) => setTopApplicantsInput(e.target.value)}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Say"
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                >
                  Yenilə
                </button>
              </form>
            </div>

            {topApplicantsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Yüklənir...</span>
              </div>
            ) : topApplicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Məlumat tapılmadı</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sıra</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ad Soyad</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vakansiya</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kateqoriya</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nəticə</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tamamlanma Tarixi</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topApplicants.map((applicant, index) => {
                      const getScoreBadge = (score) => {
                        if (score >= 70) {
                          return (
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {score.toFixed(1)}%
                            </span>
                          );
                        } else if (score >= 50) {
                          return (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {score.toFixed(1)}%
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {score.toFixed(1)}%
                            </span>
                          );
                        }
                      };

                      return (
                        <tr
                          key={applicant.applicantId || index}
                          className="border-b border-gray-200 hover:bg-purple-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-800 font-medium">
                            {applicant.fullName || '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {applicant.email || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {applicant.vacancyTitle || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {applicant.categoryName || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getScoreBadge(applicant.scorePercent || 0)}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {applicant.completedAt || '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => navigate(`/admin/applicants/${applicant.applicantId}`)}
                              className="p-2 hover:bg-purple-100 rounded-lg transition-all text-purple-600"
                              title="Detalları gör"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;