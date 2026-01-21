import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, put, del } from '../../api/service';
import { ArrowLeft, Plus, Edit2, Trash2, Loader, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Kateqoriyaları API-dən çəkir
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await get('/categories');
      setCategories(response.data?.data || []);
      setError('');
    } catch (err) {
      console.error('Kateqoriyalar çəkilərkən xəta:', err);
      setError('Kateqoriyalar yükləmə uğursuz oldu.');
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
    if (!formData.name.trim()) {
      setError('Kateqoriya adı boş ola bilməz.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        // Update kateqoriya
        await put(`/categories/${editingId}`, { name: formData.name });
        setSuccess('Kateqoriya uğurla yeniləndi.');
      } else {
        // Yeni kateqoriya
        await post('/categories', { name: formData.name });
        setSuccess('Kateqoriya uğurla yaradıldı.');
      }

      // Formu sıfırla və listi yenilə
      setFormData({ name: '' });
      setEditingId(null);
      setShowForm(false);
      await fetchCategories();
    } catch (err) {
      console.error('Xəta:', err);
      setError(err.response?.data?.message || 'Əməliyyat uğursuz oldu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      await del(`/categories/${id}`);
      setSuccess('Kateqoriya uğurla silindi.');
      await fetchCategories();
    } catch (err) {
      console.error('Silmə xətası:', err);
      setError(err.response?.data?.message || 'Silmə uğursuz oldu.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '' });
    setEditingId(null);
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
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-800">Kateqoriyaları İdarə Et</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>{showForm ? 'Ləğv Et' : 'Yeni Kateqoriya'}</span>
            </button>
          </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kateqoriya Adı
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="məs: IT, Dizayn, Pazarlama"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={submitting}
                />
              </div>

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

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600 mt-2">Yüklənir...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">Heç bir kateqoriya tapılmadı.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Birincini Yarad</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Kateqoriya Adı
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Əməliyyatlar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category.id || index}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-all text-blue-600"
                            title="Redaktə Et"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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

export default CategoryManagement;
