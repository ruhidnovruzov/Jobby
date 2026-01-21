import { User } from 'lucide-react';
import React from 'react';
import { FiUser, FiMail, FiBriefcase, FiClock, FiDownload, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const JobApplicantsList = ({ applicants, jobTitle, applicantsLoading, applicantsError }) => {
    return (
        <div className="mt-6 border-t pt-4 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiUsers className="w-5 h-5 mr-2 text-indigo-600" />
                "{jobTitle}" üçün Müraciət Edənlər
            </h3>

            {applicantsLoading && (
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mr-2"></div>
                    <p className="text-blue-600">Müraciət edənlər yüklənir...</p>
                </div>
            )}

            {applicantsError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                    <p>{applicantsError}</p>
                </div>
            )}

            {!applicantsLoading && applicants.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">Bu elana heç bir müraciət edilməyib.</p>
                </div>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {applicants.map((applicant) => (
                    <li key={applicant._id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <Link to={`/applicants/${applicant._id}`} className="flex items-start space-x-3 group hover:bg-indigo-50 rounded-xl p-2 transition">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <User className="text-indigo-600 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 group-hover:text-indigo-700">{applicant.firstName} {applicant.lastName}</h4>
                                <div className="text-sm text-gray-600 space-y-1 mt-2">
                                    <p className="flex items-center">
                                        <FiMail className="w-4 h-4 mr-2" /> {applicant.email}
                                    </p>
                                    <p className="flex items-center">
                                        <FiBriefcase className="w-4 h-4 mr-2" /> {applicant.category || 'Naməlum'}
                                    </p>
                                    <p className="flex items-center">
                                        <FiClock className="w-4 h-4 mr-2" /> {applicant.yearsOfExperience || 0} il təcrübə
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Müraciət tarixi: {new Date(applicant.appliedAt).toLocaleDateString('az-AZ')}
                                    </p>
                                </div>
                                {applicant.resume && (
                                    <a
                                        href={`https://job-server-tcq9.onrender.com${applicant.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <FiDownload className="w-4 h-4 mr-1" />
                                        CV-ni Yüklə
                                    </a>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobApplicantsList;