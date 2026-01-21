import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, put, del } from '../../api/service';
import { Plus, Edit2, Trash2, Loader, AlertCircle, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const VacancyManagement = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ categoryId: '', title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [columnName, setColumnName] = useState('createdDate');
  const [orderBy, setOrderBy] = useState('desc');

  // İlk yükləmədə vakansiyaları və kateqoriyaları çəkir
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchVacancies(filterValue, filterCategoryId, columnName, orderBy), fetchCategories()]);
    };
    loadData();
  }, [filterValue, filterCategoryId, columnName, orderBy]);

  const fetchVacancies = async (searchValue = '', categoryId = '', sortColumn = 'createdDate', sortOrder = 'desc') => {
    try {
      let url = '/vacancies?';
      const params = [];
      
      if (searchValue.trim()) {
        params.push(`FilterValue=${encodeURIComponent(searchValue.trim())}`);
      }
      if (categoryId) {
        params.push(`categoryId=${encodeURIComponent(categoryId)}`);
      }
      params.push(`ColumnName=${encodeURIComponent(sortColumn)}`);
      params.push(`OrderBy=${encodeURIComponent(sortOrder)}`);
      
      url += params.join('&');
      
      const response = await get(url);
      setVacancies(response.data?.data || []);
      setError('');
    } catch (err) {
      console.error('Vakansiyalar çəkilərkən xəta:', err);
      setError('Vakansiyalar yükləmə uğursuz oldu.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await get('/categories');
      setCategories(response.data?.data || []);
    } catch (err) {
      console.error('Kateqoriyalar çəkilərkən xəta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.title.trim() || !formData.description.trim()) {
      setError('Bütün sahələr boş ola bilməz.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        categoryId: parseInt(formData.categoryId),
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      if (editingId) {
        // Update vakansiya
        await put(`/vacancies/${editingId}`, payload);
        setSuccess('Vakansiya uğurla yeniləndi.');
      } else {
        // Yeni vakansiya
        await post('/vacancies', payload);
        setSuccess('Vakansiya uğurla yaradıldı.');
      }

      // Formu sıfırla və listi yenilə
      setFormData({ categoryId: '', title: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      await fetchVacancies(filterValue, filterCategoryId, columnName, orderBy);
    } catch (err) {
      console.error('Xəta:', err);
      setError(err.response?.data?.message || 'Əməliyyat uğursuz oldu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vacancy) => {
    setFormData({
      categoryId: vacancy.categoryId || '',
      title: vacancy.title,
      description: vacancy.description,
    });
    setEditingId(vacancy.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu vakansiyanı silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      await del(`/vacancies/${id}`);
      setSuccess('Vakansiya uğurla silindi.');
      await fetchVacancies(filterValue, filterCategoryId, columnName, orderBy);
    } catch (err) {
      console.error('Silmə xətası:', err);
      setError(err.response?.data?.message || 'Silmə uğursuz oldu.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ categoryId: '', title: '', description: '' });
    setEditingId(null);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Bilinməyən';
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8  mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-800">Vakansiyaları İdarə Et</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>{showForm ? 'Ləğv Et' : 'Yeni Vakansiya'}</span>
            </button>
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

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <div className="flex-1">
                <p className="text-green-700">{success}</p>
              </div>
              <button
                onClick={() => setSuccess('')}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrlər</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Axtarış (Başlıq, Təsvir)
                </label>
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Başlıq və ya təsvir ilə axtarın..."
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
                  onChange={(e) => setFilterCategoryId(e.target.value)}
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
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingId ? 'Vakansiyanı Redaktə Et' : 'Yeni Vakansiya'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Kateqoriya */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kateqoriya *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    disabled={submitting}
                    required
                  >
                    <option value="">Kateqoriya seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Başlıq */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlıq *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="məs: Senior React Developer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Təsvir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təsvir *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Vakansiya haqqında təfərrüatlar..."
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Yüklənir...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Yenilə' : 'Yarat'}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-all"
                  >
                    Ləğv Et
                  </button>
                </div>
              </form>
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
                <p className="text-gray-600 mb-4">Heç bir vakansiya tapılmadı.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Birincini Yarat</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th 
                        onClick={() => handleColumnSort('title')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'title' ? 'text-gray-700' : 'text-gray-500'}>
                          Başlıq {columnName === 'title' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleColumnSort('categoryId')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'categoryId' ? 'text-gray-700' : 'text-gray-500'}>
                          Kateqoriya {columnName === 'categoryId' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </th>
                      <th 
                        onClick={() => handleColumnSort('createdDate')}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      >
                        <span className={columnName === 'createdDate' ? 'text-gray-700' : 'text-gray-500'}>
                          Yaranma Tarixi {columnName === 'createdDate' ? (orderBy === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
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
                          {vacancy.title}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {getCategoryName(vacancy.categoryId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(vacancy.createdDate)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(vacancy)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-all text-blue-600"
                              title="Redaktə Et"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(vacancy.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-all text-red-600"
                              title="Sil"
                            >
                              <Trash2 className="w-5 h-5" />
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

export default VacancyManagement;
