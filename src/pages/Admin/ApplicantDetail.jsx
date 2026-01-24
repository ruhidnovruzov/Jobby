import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, getFile } from '../../api/service';
import { Loader, AlertCircle, X, ArrowLeft, CheckCircle, XCircle, TrendingUp, Download, ExternalLink } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const ApplicantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [openingCV, setOpeningCV] = useState(false);

  useEffect(() => {
    fetchApplicantDetail();
  }, [id]);

  const fetchApplicantDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await get(`/applicants/${id}`);
      setApplicant(response.data?.data || response.data || null);
    } catch (err) {
      console.error('Müraciətçi məlumatları çəkilərkən xəta:', err);
      setError(err.response?.data?.message || 'Müraciətçi məlumatları yükləmə uğursuz oldu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async () => {
    try {
      setDownloadingCV(true);
      setError('');
      const response = await getFile(`/applicants/${id}/download-cv`);
      
      // Response header'dan filename al
      const contentDisposition = response.headers['content-disposition'];
      let filename = `CV_${applicant?.fullName || id}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          // UTF-8 encoded filename varsa decode et
          if (filename.startsWith("UTF-8''")) {
            filename = decodeURIComponent(filename.substring(7));
          }
        }
      }
      
      // Blob oluştur ve indir
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CV yükləmə xətası:', err);
      setError(err.response?.data?.message || 'CV yükləmə uğursuz oldu.');
    } finally {
      setDownloadingCV(false);
    }
  };

  const handleOpenCV = async () => {
    try {
      setOpeningCV(true);
      setError('');
      const response = await getFile(`/applicants/${id}/download-cv`);
      
      // Blob oluştur ve yeni pencerede aç
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      // Pencere açıldıktan sonra URL'i temizle
      if (newWindow) {
        newWindow.onload = () => {
          // URL'i temizlemek için biraz bekle
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);
        };
      } else {
        // Popup blocker varsa kullanıcıya bilgi ver
        setError('Popup blocker aktivdir. Lütfən brauzer ayarlarından icazə verin.');
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('CV açma xətası:', err);
      setError(err.response?.data?.message || 'CV açma uğursuz oldu.');
    } finally {
      setOpeningCV(false);
    }
  };

  const getOptionStyle = (option) => {
    let baseStyle = 'p-3 border rounded-lg text-left transition-all';
    
    if (option.isCorrect && option.isSelectedByApplicant) {
      // Doğru cavab və seçilmiş
      return `${baseStyle} bg-green-100 border-green-400 text-green-800`;
    } else if (option.isCorrect && !option.isSelectedByApplicant) {
      // Doğru cavab amma seçilməyib
      return `${baseStyle} bg-green-50 border-green-300 text-green-700 border-dashed`;
    } else if (!option.isCorrect && option.isSelectedByApplicant) {
      // Səhv cavab və seçilmiş
      return `${baseStyle} bg-red-100 border-red-400 text-red-800`;
    } else {
      // Nə seçilmiş, nə də doğru
      return `${baseStyle} bg-gray-50 border-gray-200 text-gray-700`;
    }
  };

  const getOptionIcon = (option) => {
    if (option.isCorrect && option.isSelectedByApplicant) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (option.isCorrect && !option.isSelectedByApplicant) {
      return <CheckCircle className="w-5 h-5 text-green-500 opacity-50" />;
    } else if (!option.isCorrect && option.isSelectedByApplicant) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/applicants')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Geri"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Müraciətçi Detalları</h1>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600 mt-2">Yüklənir...</p>
            </div>
          ) : !applicant ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">Müraciətçi məlumatları tapılmadı.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Applicant Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Şəxsi Məlumatlar</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleOpenCV}
                      disabled={openingCV || downloadingCV}
                      className="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="CV-ni yeni pəncərədə aç"
                    >
                      {openingCV ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Açılır...</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>CV Aç</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadCV}
                      disabled={downloadingCV || openingCV}
                      className="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="CV-ni yüklə"
                    >
                      {downloadingCV ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Yüklənir...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>CV Yüklə</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ad Soyad</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">{applicant.fullName || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">{applicant.email || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefon</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">{applicant.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vakansiya</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {applicant.vacancyTitle || '-'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Kateqoriya</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {applicant.categoryName || '-'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quiz Results Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Quiz Nəticələri</h2>
                </div>
                
                {/* Overall Score Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center mb-6">
                  <div className="text-5xl font-bold mb-1">{applicant.scorePercent?.toFixed(1) || 0}%</div>
                  <div className="text-blue-100 text-sm">{applicant.totalQuestions || 0} sualdan {applicant.correctAnswers || 0} düzgün</div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{applicant.totalQuestions || 0}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ümumi Suallar</p>
                        <p className="text-xl font-bold text-gray-800">{applicant.totalQuestions || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Düzgün Cavab</p>
                        <p className="text-xl font-bold text-green-700">{applicant.correctAnswers || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Səhv Cavab</p>
                        <p className="text-xl font-bold text-red-700">{applicant.wrongAnswers || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Detail */}
              {applicant.questions && applicant.questions.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Sual Cavabları</h2>
                  <div className="space-y-6">
                    {applicant.questions.map((question, index) => {
                      const isCorrect = question.options.some(
                        opt => opt.isCorrect && opt.isSelectedByApplicant
                      );
                      
                      return (
                        <div key={question.questionId || index} className="border border-gray-200 rounded-lg p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-semibold text-gray-500">Sual {index + 1}</span>
                                {isCorrect ? (
                                  <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Düzgün</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                                    <XCircle className="w-3 h-3" />
                                    <span>Səhv</span>
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{question.questionText}</h3>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {question.options && question.options.map((option) => (
                              <div
                                key={option.id}
                                className={getOptionStyle(option)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex-1">{option.text}</span>
                                  <div className="flex items-center space-x-2">
                                    {getOptionIcon(option)}
                                    {option.isSelectedByApplicant && (
                                      <span className="text-xs font-semibold text-blue-600">Seçilmiş</span>
                                    )}
                                    {option.isCorrect && !option.isSelectedByApplicant && (
                                      <span className="text-xs font-semibold text-green-600">Doğru cavab</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;

