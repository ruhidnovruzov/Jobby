// src/components/ToggleButton.js
import React from 'react';

const ToggleButton = ({ role, setRole }) => {
  return (
    <div className="flex bg-gray-200 rounded-md p-1 mb-6">
      <button
        className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
          role === 'applicant' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setRole('applicant')}
      >
        İş Axtaran
      </button>
      <button
        className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
          role === 'company' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setRole('company')}
      >
        Şirkət
      </button>
    </div>
  );
};

export default ToggleButton;