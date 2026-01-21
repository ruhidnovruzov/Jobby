import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Search,
  Eye,
  Trash2,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Briefcase,
  AlertCircle,
  Loader2,
  ExternalLink,
  Mail,
  RefreshCw
} from 'lucide-react';

const CompanyManagement = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/companies', config);
      setCompanies(res.data.data);
    } catch (err) {
      console.error('Şirkətlər gətirilərkən xəta:', err);
      setError('Şirkətlər yüklənə bilmədi.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = async (companyId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`https://job-server-tcq9.onrender.com/api/companies/${companyId}`, config);
      setSelectedCompany(res.data.data);
      setShowCompanyModal(true);
    } catch (err) {
      console.error('Şirkət detalları gətirilərkən xəta:', err);
      setError('Şirkət detalları yüklənə bilmədi.');
    }
  };

  const handleDeleteCompany = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`https://job-server-tcq9.onrender.com/api/admin/users/${userId}`, config);
      setCompanies(companies.filter(company => company.userId._id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Şirkət silinərkən xəta:', err);
      setError('Şirkət silinə bilmədi.');
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.address && company.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
          <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-purple-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Şirkətlər Yüklənir</h3>
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
          <h3 className="text-xl font-bold text-gray-800">Şirkət İdarəetməsi</h3>
          <p className="text-gray-600">{filteredCompanies.length} şirkət tapıldı</p>
        </div>
        <button
          onClick={fetchCompanies}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Yenilə</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Şirkət adı, sənaye və ya ünvan ilə axtarın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Company Header */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-purple-300 transition-colors duration-300">
                      {company.logoUrl && company.logoUrl !== 'https://via.placeholder.com/150' ? (
                        <img
                          src={`https://job-server-tcq9.onrender.com${company.logoUrl}`}
                          alt={`${company.companyName} Logosu`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                      {company.companyName}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{company.industry}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleViewCompany(company._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Detalları Gör"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(company.userId._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="p-6 space-y-3">
              {company.address && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{company.address}</span>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{company.phone}</span>
                </div>
              )}

              {company.website && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 truncate flex items-center space-x-1"
                  >
                    <span className="truncate">{company.website}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(company.createdAt).toLocaleDateString('az-AZ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{company.userId?.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm ? 'Heç bir şirkət tapılmadı' : 'Hələ heç bir şirkət yoxdur'}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin'
              : 'Şirkətlər qeydiyyatdan keçdikdə burada görünəcək'
            }
          </p>
        </div>
      )}

      {/* Company Detail Modal */}
      {showCompanyModal && selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur-[2px]">

          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Şirkət Detalları</h3>
                <button
                  onClick={() => setShowCompanyModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Header */}
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  {selectedCompany.logoUrl && selectedCompany.logoUrl !== 'https://via.placeholder.com/150' ? (
                    <img
                      src={`https://job-server-tcq9.onrender.com${selectedCompany.logoUrl}`}
                      alt={`${selectedCompany.companyName} Logosu`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedCompany.companyName}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 font-medium">{selectedCompany.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{selectedCompany.userId?.email}</span>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              {selectedCompany.description && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Şirkət Haqqında</h5>
                  <p className="text-gray-700 leading-relaxed">{selectedCompany.description}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Əlaqə Məlumatları</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCompany.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ünvan</p>
                        <p className="text-gray-800">{selectedCompany.address}</p>
                      </div>
                    </div>
                  )}

                  {selectedCompany.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telefon</p>
                        <p className="text-gray-800">{selectedCompany.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedCompany.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Vebsayt</p>
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <span>{selectedCompany.website}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedCompany.establishedYear && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Təsis İli</p>
                        <p className="text-gray-800">{selectedCompany.establishedYear}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Hesab Məlumatları</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Qeydiyyat Tarixi</p>
                    <p className="text-gray-800">{new Date(selectedCompany.createdAt).toLocaleDateString('az-AZ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Son Yeniləmə</p>
                    <p className="text-gray-800">{new Date(selectedCompany.updatedAt).toLocaleDateString('az-AZ')}</p>
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
                  <h3 className="text-lg font-bold text-gray-800">Şirkəti Sil</h3>
                  <p className="text-gray-600">Bu əməliyyat geri alına bilməz.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Bu şirkəti və onunla əlaqəli bütün məlumatları (iş elanları daxil olmaqla) silmək istədiyinizə əminsiniz?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={() => handleDeleteCompany(deleteConfirm)}
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

export default CompanyManagement;