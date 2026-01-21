import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  UserCheck,
  Building2,
  Shield,
  AlertCircle,
  Loader2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/admin/users', config);
      setUsers(res.data);
    } catch (err) {
      console.error('İstifadəçilər gətirilərkən xəta:', err);
      setError('İstifadəçilər yüklənə bilmədi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`https://job-server-tcq9.onrender.com/api/admin/users/${userId}`, config);
      setUsers(users.filter(u => u._id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('İstifadəçi silinərkən xəta:', err);
      setError('İstifadəçi silinə bilmədi.');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`https://job-server-tcq9.onrender.com/api/admin/users/${userId}`, config);
      setSelectedUser(res.data);
      setShowUserModal(true);
    } catch (err) {
      console.error('İstifadəçi detalları gətirilərkən xəta:', err);
      setError('İstifadəçi detalları yüklənə bilmədi.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profile?.firstName && user.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.profile?.lastName && user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.profile?.companyName && user.profile.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
          <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-blue-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">İstifadəçilər Yüklənir</h3>
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
          <h3 className="text-xl font-bold text-gray-800">İstifadəçi İdarəetməsi</h3>
          <p className="text-gray-600">{filteredUsers.length} istifadəçi tapıldı</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Yenilə</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Email, ad və ya şirkət adı ilə axtarın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="all">Bütün Rollar</option>
            <option value="applicant">İş Axtaran</option>
            <option value="company">Şirkət</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">İstifadəçi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Qeydiyyat Tarixi</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((userData) => (
                <tr key={userData._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userData.role === 'applicant'
                        ? 'bg-green-100 text-green-600'
                        : userData.role === 'company'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-blue-100 text-blue-600'
                        }`}>
                        {userData.role === 'applicant' ? (
                          <UserCheck className="w-5 h-5" />
                        ) : userData.role === 'company' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <Shield className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {userData.profile?.firstName && userData.profile?.lastName
                            ? `${userData.profile.firstName} ${userData.profile.lastName}`
                            : userData.profile?.companyName || 'Ad qeyd edilməyib'
                          }
                        </p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userData.role === 'applicant'
                      ? 'bg-green-100 text-green-700'
                      : userData.role === 'company'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {userData.role === 'applicant' ? 'İş Axtaran' :
                        userData.role === 'company' ? 'Şirkət' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(userData.createdAt).toLocaleDateString('az-AZ')}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewUser(userData._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Detalları Gör"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {userData.role !== 'admin' && (
                        <button
                          onClick={() => setDeleteConfirm(userData._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Heç bir istifadəçi tapılmadı</h3>
            <p className="text-gray-500">Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">İstifadəçi Detalları</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedUser.role === 'applicant'
                  ? 'bg-green-100 text-green-600'
                  : selectedUser.role === 'company'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-blue-100 text-blue-600'
                  }`}>
                  {selectedUser.role === 'applicant' ? (
                    <UserCheck className="w-8 h-8" />
                  ) : selectedUser.role === 'company' ? (
                    <Building2 className="w-8 h-8" />
                  ) : (
                    <Shield className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {selectedUser.profile?.firstName && selectedUser.profile?.lastName
                      ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`
                      : selectedUser.profile?.companyName || 'Ad qeyd edilməyib'
                    }
                  </h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${selectedUser.role === 'applicant'
                    ? 'bg-green-100 text-green-700'
                    : selectedUser.role === 'company'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                    {selectedUser.role === 'applicant' ? 'İş Axtaran' :
                      selectedUser.role === 'company' ? 'Şirkət' : 'Admin'}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              {selectedUser.profile && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Profil Məlumatları</h5>

                  {selectedUser.role === 'applicant' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.profile.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="font-medium text-gray-800">{selectedUser.profile.phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedUser.profile.yearsOfExperience !== undefined && (
                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Təcrübə</p>
                            <p className="font-medium text-gray-800">{selectedUser.profile.yearsOfExperience} il</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedUser.role === 'company' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.profile.industry && (
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Sənaye</p>
                            <p className="font-medium text-gray-800">{selectedUser.profile.industry}</p>
                          </div>
                        </div>
                      )}
                      {selectedUser.profile.address && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Ünvan</p>
                            <p className="font-medium text-gray-800">{selectedUser.profile.address}</p>
                          </div>
                        </div>
                      )}
                      {selectedUser.profile.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="font-medium text-gray-800">{selectedUser.profile.phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedUser.profile.website && (
                        <div className="flex items-center space-x-3">
                          <ExternalLink className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Vebsayt</p>
                            <a
                              href={selectedUser.profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-700"
                            >
                              {selectedUser.profile.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Account Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Hesab Məlumatları</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Qeydiyyat Tarixi</p>
                      <p className="font-medium text-gray-800">{new Date(selectedUser.createdAt).toLocaleDateString('az-AZ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserCheck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUser.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {selectedUser.isVerified ? 'Təsdiqlənib' : 'Gözləyir'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <h3 className="text-lg font-bold text-gray-800">İstifadəçini Sil</h3>
                  <p className="text-gray-600">Bu əməliyyat geri alına bilməz.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Bu istifadəçini və onunla əlaqəli bütün məlumatları silmək istədiyinizə əminsiniz?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
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

export default UserManagement;