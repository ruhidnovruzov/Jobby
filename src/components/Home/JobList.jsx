import React from 'react';
import { Briefcase, Search } from 'lucide-react';
import JobCard from './JobCard';

const JobList = ({ jobs }) => {
    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <Search className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-700">Heç bir iş elanı tapılmadı</h3>
                    <p className="text-gray-500 max-w-md">
                        Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin və ya filtirləri sıfırlayın
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Yeni iş elanları tezliklə əlavə ediləcək</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {jobs.length} iş elanı tapıldı
                        </h3>
                        <p className="text-sm text-gray-500">Ən uyğun nəticələr göstərilir</p>
                    </div>
                </div>
    
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    );
};

export default JobList;