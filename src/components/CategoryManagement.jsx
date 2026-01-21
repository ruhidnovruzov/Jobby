import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Tag,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle,
  Calendar,
  Hash,
  RefreshCw
} from 'lucide-react';

const CategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Kateqoriyalar gətirilərkən xəta:', err);
      setError('Kateqoriyalar yüklənə bilmədi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.post(
        'https://job-server-tcq9.onrender.com/api/categories',
        { name: newCategoryName.trim() },
        config
      );

      setCategories([...categories, res.data.data]);
      setNewCategoryName('');
      setMessage('Kateqoriya uğurla əlavə edildi!');

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Kateqoriya əlavə edilərkən xəta:', err);
      setError(err.response?.data?.message || 'Kateqoriya əlavə edilə bilmədi.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`https://job-server-tcq9.onrender.com/api/categories/${categoryId}`, config);
      setCategories(categories.filter(cat => cat._id !== categoryId));
      setDeleteConfirm(null);
      setMessage('Kateqoriya uğurla silindi!');

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Kateqoriya silinərkən xəta:', err);
      setError(err.response?.data?.message || 'Kateqoriya silinə bilmədi.');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
          <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-pink-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Kateqoriyalar Yüklənir</h3>
          <p className="text-gray-600">Məlumatlar hazırlanır...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kateqoriya İdarəetməsi</h3>
          <p className="text-gray-600">{filteredCategories.length} kateqoriya tapıldı</p>
        </div>
        <button
          onClick={fetchCategories}
          className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Yenilə</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 font-medium">{message}</p>
        </div>
      )}

      {/* Add New Category */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-pink-600" />
          Yeni Kateqoriya Əlavə Et
        </h4>
        <form onSubmit={handleAddCategory} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kateqoriya adını daxil edin..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newCategoryName.trim()}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${isAdding || !newCategoryName.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 shadow-lg'
              }`}
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Əlavə edilir...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Əlavə Et</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Kateqoriya adı ilə axtarın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category._id} className="group bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-200">
                      {category.name}
                    </h5>
                    <p className="text-sm text-gray-500">Kateqoriya</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirm(category._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <span>ID: {category._id.slice(-6)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(category.createdAt).toLocaleDateString('az-AZ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm ? 'Heç bir kateqoriya tapılmadı' : 'Hələ heç bir kateqoriya yoxdur'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin'
              : 'Yuxarıdakı formu istifadə edərək ilk kateqoriyanızı əlavə edin'
            }
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur-[2px]">

          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Kateqoriyanı Sil</h3>
                  <p className="text-gray-600">Bu əməliyyat geri alına bilməz.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Bu kateqoriyanı silmək istədiyinizə əminsiniz? Bu kateqoriya ilə əlaqəli bütün iş elanları təsirlənə bilər.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={() => handleDeleteCategory(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;