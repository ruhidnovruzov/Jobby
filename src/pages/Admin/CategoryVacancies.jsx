import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../../api/service';
import { Loader, AlertCircle, X, ArrowLeft, Eye, Briefcase } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const CategoryVacancies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [category, setCategory] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Kategori məlumatlarını və vakansiyaları paralel çək
      const [categoryRes, vacanciesRes] = await Promise.all([
        get('/categories'),
        get(`/vacancies?categoryId=${id}`)
      ]);

      // Kategori məlumatını tap
      const categories = categoryRes.data?.data || categoryRes.data || [];
      const foundCategory = categories.find(cat => cat.id === Number(id));
      setCategory(foundCategory || null);

      // Vakansiyaları set et
      const vacanciesData = vacanciesRes.data?.data || vacanciesRes.data || [];
      setVacancies(Array.isArray(vacanciesData) ? vacanciesData : []);
    } catch (err) {
      console.error('Məlumatlar çəkilərkən xəta:', err);
      setError(err.response?.data?.message || 'Məlumatlar yükləmə uğursuz oldu.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // If already in DD.MM.YYYY HH:MM format, return as is
    if (typeof dateString === 'string' && /^\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}/.test(dateString)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (err) {
      return dateString || '-';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/categories')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Geri"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <span>
                    {category ? `${category.name} - Vakansiyalar` : 'Vakansiyalar'}
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Vacancies List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 mt-2">Yüklənir...</p>
              </div>
            ) : vacancies.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  {category ? `${category.name} kateqoriyası üçün heç bir vakansiya tapılmadı.` : 'Heç bir vakansiya tapılmadı.'}
                </p>
                <button
                  onClick={() => navigate('/admin/vacancies')}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Vakansiya Yarat</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Başlıq
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Təsvir
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Yaranma Tarixi
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacancies.map((vacancy, index) => (
                      <tr
                        key={vacancy.id || index}
                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {vacancy.title || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="max-w-md truncate" title={vacancy.description}>
                            {vacancy.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {vacancy.isActive ? (
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                              Aktiv
                            </span>
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                              Deaktiv
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(vacancy.createdDate)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/admin/vacancies/${vacancy.id}`)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-all text-blue-600"
                              title="Detalları gör"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default CategoryVacancies;

