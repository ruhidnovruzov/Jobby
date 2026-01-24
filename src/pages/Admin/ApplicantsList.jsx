import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../../api/service';
import { Loader, AlertCircle, X, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const ApplicantsList = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Filter states
  const [filterValue, setFilterValue] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterVacancyId, setFilterVacancyId] = useState('');
  const [columnName, setColumnName] = useState('firstName');
  const [orderBy, setOrderBy] = useState('asc');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // İlk yükləmədə məlumatları çəkir
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchApplicants(),
        fetchCategories(),
        fetchVacancies()
      ]);
    };
    loadData();
  }, [filterValue, filterCategoryId, filterVacancyId, columnName, orderBy, pageNumber, pageSize]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      
      // Geçersiz sütun adlarını kontrol et ve düzelt
      const invalidColumns = ['vacancyTitle', 'categoryName', 'scorePercent'];
      let validColumnName = columnName;
      // CreatedDate için mapping - frontend'de createdDate, backend'de CreatedDate
      if (columnName === 'createdDate') {
        validColumnName = 'CreatedDate';
      } else if (invalidColumns.includes(columnName)) {
        validColumnName = 'firstName';
        setColumnName('firstName');
        setOrderBy('asc');
      }
      
      let url = '/applicants?';
      const params = [];
      
      if (filterValue.trim()) {
        params.push(`FilterValue=${encodeURIComponent(filterValue.trim())}`);
      }
      if (filterCategoryId) {
        params.push(`CategoryId=${encodeURIComponent(filterCategoryId)}`);
      }
      if (filterVacancyId) {
        params.push(`VacancyId=${encodeURIComponent(filterVacancyId)}`);
      }
      params.push(`ColumnName=${encodeURIComponent(validColumnName)}`);
      params.push(`OrderBy=${encodeURIComponent(orderBy)}`);
      params.push(`PageNumber=${pageNumber}`);
      params.push(`PageSize=${pageSize}`);
      
      url += params.join('&');
      
      const response = await get(url);
      const data = response.data?.data || response.data || [];
      setApplicants(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Müraciətçilər çəkilərkən xəta:', err);
      setError('Müraciətçilər yükləmə uğursuz oldu.');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await get('/categories');
      setCategories(response.data?.data || []);
    } catch (err) {
      console.error('Kateqoriyalar çəkilərkən xəta:', err);
    }
  };

  const fetchVacancies = async () => {
    try {
      const response = await get('/vacancies');
      setVacancies(response.data?.data || []);
    } catch (err) {
      console.error('Vakansiyalar çəkilərkən xəta:', err);
    }
  };

  const handleColumnSort = (column) => {
    if (columnName === column) {
      // Toggle asc/desc if same column
      setOrderBy(orderBy === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to desc
      setColumnName(column);
      setOrderBy('desc');
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

  const getStatusBadge = (isFinished, scorePercent) => {
    if (!isFinished) {
      return (
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
          Test bitməyib
        </span>
      );
    }
    
    if (scorePercent >= 70) {
      return (
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          {scorePercent.toFixed(1)}%
        </span>
      );
    } else if (scorePercent >= 50) {
      return (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {scorePercent.toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
          {scorePercent.toFixed(1)}%
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Müraciətçilər</h1>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrlər</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Axtarış (Ad, Soyad, Email)
                </label>
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Ad, soyad və ya email ilə axtarın..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kateqoriya
                </label>
                <select
                  value={filterCategoryId}
                  onChange={(e) => {
                    setFilterCategoryId(e.target.value);
                    // Kategori değiştiğinde vakansiya filtresini sıfırla
                    setFilterVacancyId('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Hamısı</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vacancy Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vakansiya
                </label>
                <select
                  value={filterVacancyId}
                  onChange={(e) => setFilterVacancyId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Hamısı</option>
                  {filterCategoryId
                    ? vacancies
                        .filter((vac) => vac.categoryId === Number(filterCategoryId))
                        .map((vac) => (
                          <option key={vac.id} value={vac.id}>
                            {vac.title}
                          </option>
                        ))
                    : vacancies.map((vac) => (
                        <option key={vac.id} value={vac.id}>
                          {vac.title}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 mt-2">Yüklənir...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Heç bir müraciətçi tapılmadı.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th 
                        onClick={() => handleColumnSort('firstName')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'firstName' ? 'text-gray-700' : 'text-gray-500'}>
                          Ad {columnName === 'firstName' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleColumnSort('lastName')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'lastName' ? 'text-gray-700' : 'text-gray-500'}>
                          Soyad {columnName === 'lastName' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleColumnSort('email')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'email' ? 'text-gray-700' : 'text-gray-500'}>
                          Email {columnName === 'email' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Vakansiya
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Kateqoriya
                      </th>
                      <th 
                        onClick={() => handleColumnSort('createdDate')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'createdDate' ? 'text-gray-700' : 'text-gray-500'}>
                          Müraciət Tarixi {columnName === 'createdDate' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant, index) => (
                      <tr
                        key={applicant.applicantId || index}
                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {applicant.firstName || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {applicant.lastName || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {applicant.email || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {applicant.vacancyTitle || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {applicant.categoryName || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(applicant.appliedDate)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/admin/applicants/${applicant.id}`)}
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

            {/* Pagination Controls */}
            {!loading && applicants.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Səhifə ölçüsü:
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNumber(1);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                      disabled={pageNumber === 1}
                      className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 transition-colors"
                    >
                      Əvvəlki
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Səhifə {pageNumber}
                    </span>
                    <button
                      onClick={() => setPageNumber(prev => prev + 1)}
                      disabled={applicants.length < pageSize}
                      className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 transition-colors"
                    >
                      Növbəti
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsList;

