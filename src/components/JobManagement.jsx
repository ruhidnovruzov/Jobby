import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Trash2,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Calendar,
  Users,
  AlertCircle,
  Loader2,
  Tag,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const JobManagement = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/jobs');
      setJobs(res.data.data);
    } catch (err) {
      console.error('İş elanları gətirilərkən xəta:', err);
      setError('İş elanları yüklənə bilmədi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://job-server-tcq9.onrender.com/api/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Kateqoriyalar gətirilərkən xəta:', err);
    }
  };

  const handleViewJob = async (jobId) => {
    try {
      const res = await axios.get(`https://job-server-tcq9.onrender.com/api/jobs/${jobId}`);
      setSelectedJob(res.data.data);
      setShowJobModal(true);
    } catch (err) {
      console.error('İş elanı detalları gətirilərkən xəta:', err);
      setError('İş elanı detalları yüklənə bilmədi.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`https://job-server-tcq9.onrender.com/api/jobs/${jobId}`, config);
      setJobs(jobs.filter(job => job._id !== jobId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('İş elanı silinərkən xəta:', err);
      setError('İş elanı silinə bilmədi.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || job.category?._id === categoryFilter;
    const matchesLocation = locationFilter === 'all' || job.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Get unique locations for filter
  const uniqueLocations = [...new Set(jobs.map(job => job.location))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">

          <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-orange-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">İş Elanları Yüklənir</h3>
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
          <h3 className="text-xl font-bold text-gray-800">İş Elanları İdarəetməsi</h3>
          <p className="text-gray-600">{filteredJobs.length} iş elanı tapıldı</p>
        </div>
        <button
          onClick={fetchJobs}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Yenilə</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="İş adı, şirkət və ya yer ilə axtarın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="all">Bütün Kateqoriyalar</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="all">Bütün Yerlər</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Job Header */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {job.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">
                        {job.company?.companyName || 'Naməlum Şirkət'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleViewJob(job._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Detalları Gör"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(job._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="p-6 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Tag className="w-4 h-4 text-gray-400" />
                <span>{job.category?.name || 'Naməlum'}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>{job.salaryRange || 'Qeyd edilməyib'}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{job.jobType}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>{job.experienceLevel}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(job.createdAt).toLocaleDateString('az-AZ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{job.applicants?.length || 0} müraciət</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || categoryFilter !== 'all' || locationFilter !== 'all'
              ? 'Heç bir iş elanı tapılmadı'
              : 'Hələ heç bir iş elanı yoxdur'
            }
          </h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' || locationFilter !== 'all'
              ? 'Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin'
              : 'Şirkətlər tərəfindən iş elanları əlavə edildikdə burada görünəcək'
            }
          </p>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur-[2px]">

          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">İş Elanı Detalları</h3>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Header */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedJob.title}</h4>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">{selectedJob.company?.companyName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedJob.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Kateqoriya</span>
                  </div>
                  <p className="text-gray-800 font-semibold">{selectedJob.category?.name}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Maaş</span>
                  </div>
                  <p className="text-gray-800 font-semibold">{selectedJob.salaryRange}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-700">İş Növü</span>
                  </div>
                  <p className="text-gray-800 font-semibold">{selectedJob.jobType}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-700">Təcrübə</span>
                  </div>
                  <p className="text-gray-800 font-semibold">{selectedJob.experienceLevel}</p>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">İş Təsviri</h5>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {/* Company Info */}
              {selectedJob.company && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Şirkət Haqqında</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedJob.company.description && (
                      <div className="md:col-span-2">
                        <p className="text-gray-700">{selectedJob.company.description}</p>
                      </div>
                    )}
                    {selectedJob.company.address && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ünvan</p>
                        <p className="text-gray-800">{selectedJob.company.address}</p>
                      </div>
                    )}
                    {selectedJob.company.website && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Vebsayt</p>
                        <a
                          href={selectedJob.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <span>{selectedJob.company.website}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Application Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Müraciət Məlumatları</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Yaradılma Tarixi</p>
                    <p className="text-gray-800">{new Date(selectedJob.createdAt).toLocaleDateString('az-AZ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Son Müraciət</p>
                    <p className="text-gray-800">{new Date(selectedJob.applicationDeadline).toLocaleDateString('az-AZ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Müraciət Sayı</p>
                    <p className="text-gray-800 font-semibold">{selectedJob.applicants?.length || 0} nəfər</p>
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
                  <h3 className="text-lg font-bold text-gray-800">İş Elanını Sil</h3>
                  <p className="text-gray-600">Bu əməliyyat geri alına bilməz.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Bu iş elanını və onunla əlaqəli bütün müraciətləri silmək istədiyinizə əminsiniz?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={() => handleDeleteJob(deleteConfirm)}
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

export default JobManagement;