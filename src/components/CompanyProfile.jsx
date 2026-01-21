import React from 'react';

const CompanyProfile = ({
    profile,
    profileError,
    profileMessage,
    isEditMode,
    editFormData,
    selectedLogoFile,
    setIsEditMode,
    handleEditChange,
    handleLogoFileChange,
    handleUpdateProfile,
}) => {
    const defaultLogo = 'https://via.placeholder.com/150';
    const logoImageUrl = profile?.logoUrl && profile.logoUrl !== defaultLogo
        ? `https://job-server-tcq9.onrender.com${profile.logoUrl}`
        : defaultLogo;

    return (
        <div className="h-full">
            {/* Error and Success Messages */}
            {profileError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{profileError}</p>
                        </div>
                    </div>
                </div>
            )}

            {profileMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{profileMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {!isEditMode ? (
                <div className="space-y-6">
                    {/* Company Logo and Name */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <img
                                src={logoImageUrl}
                                alt={`${profile?.companyName} Logosu`}
                                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg mx-auto"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-gray-900">{profile?.companyName || 'Şirkət Adı'}</h3>
                        <p className="text-sm text-gray-500">{profile?.industry || 'Sənaye sahəsi'}</p>
                    </div>

                    {/* Company Information */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">Haqqında</p>
                                    <p className="text-sm text-gray-600 mt-1">{profile?.description || 'Məlumat əlavə edilməyib'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">Ünvan</p>
                                    <p className="text-sm text-gray-600">{profile?.address || 'Qeyd edilməyib'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">Telefon</p>
                                    <p className="text-sm text-gray-600">{profile?.phone || 'Qeyd edilməyib'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">Vebsayt</p>
                                    {profile?.website ? (
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {profile.website}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-600">Qeyd edilməyib</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0011.5 18h1a2 2 0 002-1.5L15 8m-6 0h6"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">Quruluş İli</p>
                                    <p className="text-sm text-gray-600">{profile?.establishedYear || 'Qeyd edilməyib'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="pt-4">
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            <span>Profili Redaktə Et</span>
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Logo Upload Section */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <img
                                src={selectedLogoFile ? URL.createObjectURL(selectedLogoFile) : logoImageUrl}
                                alt="Logo Önizləməsi"
                                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg mx-auto"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                                Şirkət Loqosu
                            </label>
                            <div className="flex justify-center">
                                <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-300">
                                    <input
                                        type="file"
                                        name="logo"
                                        id="logo"
                                        accept=".jpeg,.jpg,.png,.gif"
                                        onChange={handleLogoFileChange}
                                        className="hidden"
                                    />
                                    <div className="text-center">
                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="text-sm text-gray-600 mt-1">Logo yüklə</p>
                                        <p className="text-xs text-gray-400">JPEG, PNG, GIF (Max 2MB)</p>
                                    </div>
                                </label>
                            </div>
                            {selectedLogoFile && (
                                <p className="text-sm text-green-600 mt-2 text-center">✓ {selectedLogoFile.name}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                Şirkət Adı *
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                id="companyName"
                                value={editFormData.companyName}
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                required
                                placeholder="Şirkət adını daxil edin"
                            />
                        </div>

                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                                Sənaye *
                            </label>
                            <input
                                type="text"
                                name="industry"
                                id="industry"
                                value={editFormData.industry}
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                required
                                placeholder="Sənaye sahəsini daxil edin"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Haqqında
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={editFormData.description}
                                onChange={handleEditChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                placeholder="Şirkət haqqında məlumat"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Ünvan
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={editFormData.address}
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Şirkət ünvanı"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon Nömrəsi
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={editFormData.phone}
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="+994 XX XXX XX XX"
                            />
                        </div>

                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                Vebsayt
                            </label>
                            <input
                                type="url"
                                name="website"
                                id="website"
                                value={editFormData.website}
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="establishedYear" className="block text-sm font-medium text-gray-700 mb-2">
                                Quruluş İli
                            </label>
                            <input
                                type="number"
                                name="establishedYear"
                                id="establishedYear"
                                value={editFormData.establishedYear}
                                onChange={handleEditChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="2020"
                                min="1800"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditMode(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span>Ləğv Et</span>
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Yadda Saxla</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompanyProfile;