import React from 'react';

const LoadingSpinner = ({ message = 'Məlumatlar yüklənir...' }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
    </div>
    <p className="mt-4 text-gray-600 font-medium">{message}</p>
  </div>
);