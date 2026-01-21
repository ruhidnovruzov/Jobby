// src/components/CompanyJobList.js
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import JobApplicantsList from './JobApplicantsList';

// Iconlar
import { FiExternalLink, FiEdit2, FiTrash2, FiUserPlus, FiUsers, FiFilter, FiX } from 'react-icons/fi';

const CompanyJobList = ({
  companyJobs,
  jobsError,
  selectedJobApplicants,
  applicantsLoading,
  applicantsError,
  handleDeleteJob,
  fetchApplicants,
}) => {
  const [filters, setFilters] = useState({
    category: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: '',
    searchTerm: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(companyJobs.map(job => job.category?.name).filter(Boolean))];
    const jobTypes = [...new Set(companyJobs.map(job => job.jobType).filter(Boolean))];
    const experienceLevels = [...new Set(companyJobs.map(job => job.experienceLevel).filter(Boolean))];
    const salaryRanges = [...new Set(companyJobs.map(job => job.salaryRange).filter(Boolean))];

    return {
      categories,
      jobTypes,
      experienceLevels,
      salaryRanges
    };
  }, [companyJobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return companyJobs.filter(job => {
      const matchesCategory = !filters.category || job.category?.name === filters.category;
      const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
      const matchesExperience = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;
      const matchesSalary = !filters.salaryRange || job.salaryRange === filters.salaryRange;
      const matchesSearch = !filters.searchTerm || 
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesCategory && matchesJobType && matchesExperience && matchesSalary && matchesSearch;
    });
  }, [companyJobs, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      jobType: '',
      experienceLevel: '',
      salaryRange: '',
      searchTerm: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-3xl font-semibold text-gray-800">İş Elanlarım</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <FiFilter size={16} />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {Object.values(filters).filter(f => f !== '').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {jobsError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
          <p>{jobsError}</p>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Filterlər</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <FiX size={16} />
                Təmizlə
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Axtarış</label>
              <input
                type="text"
                placeholder="İş adı və ya təsvir..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bütün kateqoriyalar</option>
                {filterOptions.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İş Növü</label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bütün növlər</option>
                {filterOptions.jobTypes.map(jobType => (
                  <option key={jobType} value={jobType}>{jobType}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Təcrübə Səviyyəsi</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bütün səviyyələr</option>
                {filterOptions.experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maaş Aralığı</label>
              <select
                value={filters.salaryRange}
                onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Bütün aralıqlar</option>
                {filterOptions.salaryRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{filteredJobs.length}</span> iş elanı{filteredJobs.length !== 1 ? '' : ''}
          {hasActiveFilters && (
            <span className="ml-2 text-blue-600">
              ({companyJobs.length} iş elanından filterləndi)
            </span>
          )}
        </div>
        <Link
          to="/post-job"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow hover:shadow-md"
        >
          <span>Yeni Elan Yerləşdir</span>
        </Link>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          {hasActiveFilters ? (
            <div>
              <p className="text-gray-500 text-lg mb-2">Filter şərtlərinə uyğun iş elanı tapılmadı.</p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Filterləri təmizlə
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-lg">Heç bir iş elanı yerləşdirməmisiniz.</p>
          )}
        </div>
      )}

      <div className="space-y-5">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-5">
              <h3 className="text-xl font-medium text-gray-800">{job.title}</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <p><span className="font-medium">Kateqoriya:</span> {job.category?.name || 'Naməlum'}</p>
                <p><span className="font-medium">İş Növü:</span> {job.jobType}</p>
                <p><span className="font-medium">Təcrübə:</span> {job.experienceLevel}</p>
                <p><span className="font-medium">Maaş:</span> {job.salaryRange}</p>
                <p><span className="font-medium">Müraciətlər:</span> {job.applicants?.length || 0}</p>
                <p><span className="font-medium">Yerləşdirilmə:</span> {new Date(job.createdAt).toLocaleDateString('az-AZ')}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition"
                >
                  <FiExternalLink size={16} /> Bax
                </Link>

                <Link
                  to={`/edit-job/${job._id}`}
                  className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-800 bg-yellow-50 px-3 py-1.5 rounded-md transition"
                >
                  <FiEdit2 size={16} /> Redaktə
                </Link>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-md transition"
                >
                  <FiTrash2 size={16} /> Sil
                </button>

                <button
                  onClick={() => fetchApplicants(job._id, job.title)}
                  className="inline-flex cursor-pointer items-center gap-1 text-purple-600 hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-md transition"
                >
                  <FiUsers size={16} /> Müraciətçilər ({job.applicants?.length || 0})
                </button>
              </div>
            </div>

            {/* Applicants Section - Accordion Style */}
            {selectedJobApplicants && selectedJobApplicants.jobId === job._id && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 animate-fadeIn">
                <JobApplicantsList
                  applicants={selectedJobApplicants.applicants}
                  jobTitle={selectedJobApplicants.jobTitle}
                  applicantsLoading={applicantsLoading}
                  applicantsError={applicantsError}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyJobList;