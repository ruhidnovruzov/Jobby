import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { get, post, put, del } from '../../api/service';
import { Plus, Edit2, Trash2, Loader } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const VacancyId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [vacancy, setVacancy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qLoading, setQLoading] = useState(false);

  // Backend'den gelen error'ları parse et ve toast göster
  const showErrorToast = (err) => {
    const errorData = err.response?.data;
    
    if (errorData?.errors) {
      // Validation errors - object formatında
      const errorMessages = [];
      Object.keys(errorData.errors).forEach((key) => {
        const messages = errorData.errors[key];
        if (Array.isArray(messages)) {
          messages.forEach(msg => errorMessages.push(msg));
        } else {
          errorMessages.push(messages);
        }
      });
      
      if (errorMessages.length > 0) {
        errorMessages.forEach(msg => toast.error(msg));
        return;
      }
    }
    
    // Single error message - öncelik sırası: detail > message > title
    const errorMessage = errorData?.detail || errorData?.message || errorData?.title || err.message || 'Xəta baş verdi.';
    toast.error(errorMessage);
  };

  const showSuccessToast = (message) => {
    toast.success(message);
  };

  // Question form
  const emptyOptions = () => [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ];

  const [questionForm, setQuestionForm] = useState({
    id: null,
    text: '',
    order: 1,
    options: emptyOptions(),
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchVacancy(), fetchQuestions()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVacancy = async () => {
    try {
      const res = await get(`/vacancies/${id}`);
      setVacancy(res.data?.data || res.data || null);
    } catch (err) {
      console.error('Vacancy fetch error', err);
      showErrorToast(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setQLoading(true);
  const res = await get(`/questions/by-vacancy/${id}`);
      const raw = res.data?.data || res.data || [];
      // Normalize options to include id, text and isCorrect fields for the UI
      const normalized = raw.map((q) => ({
        ...q,
        order: q.order ?? 1,
        options: (q.options || []).map((o) => ({ id: o.id, text: o.text || '', isCorrect: !!o.isCorrect })),
      }));
      setQuestions(normalized);
      
      // Update form order if form is empty (not in edit mode)
      if (!questionForm.id && !questionForm.text.trim()) {
        const nextOrder = getNextOrder(normalized);
        setQuestionForm(prev => ({ ...prev, order: nextOrder }));
      }
    } catch (err) {
      console.error('Questions fetch error', err);
      showErrorToast(err);
    } finally {
      setQLoading(false);
    }
  };

  // Calculate next available order number
  const getNextOrder = (questionsList = questions) => {
    if (questionsList.length === 0) return 1;
    
    // Get all existing orders and sort them
    const existingOrders = questionsList
      .map(q => Number(q.order) || 0)
      .filter(order => order > 0)
      .sort((a, b) => a - b);
    
    // If no valid orders exist, return 1
    if (existingOrders.length === 0) return 1;
    
    // Find the first gap in the sequence
    for (let i = 1; i <= existingOrders.length; i++) {
      if (existingOrders[i - 1] !== i) {
        return i;
      }
    }
    
    // No gap found, return max + 1
    return Math.max(...existingOrders) + 1;
  };

  const resetQuestionForm = () => {
    const nextOrder = getNextOrder();
    setQuestionForm({ id: null, text: '', order: nextOrder, options: emptyOptions() });
  };

  const handleOptionChange = (index, field, value) => {
    setQuestionForm((prev) => {
      const next = { ...prev };
      next.options = prev.options.map((o, i) => (i === index ? { ...o, [field]: value } : o));
      return next;
    });
  };

  const addOption = () => {
    setQuestionForm((prev) => ({ ...prev, options: [...prev.options, { text: '', isCorrect: false }] }));
  };

  const removeOption = (index) => {
    setQuestionForm((prev) => {
      if (prev.options.length <= 4) return prev; // enforce minimum 4
      const nextOptions = prev.options.filter((_, i) => i !== index);
      return { ...prev, options: nextOptions };
    });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    // Validation: at least 4 options
    if (!questionForm.text.trim()) {
      toast.error('Sual mətnini daxil edin.');
      return;
    }
    
    // Order validation - minimum 1 olmalıdır
    const orderValue = Number(questionForm.order) || 1;
    if (orderValue < 1) {
      toast.error('Sıra (order) ən az 1 olmalıdır.');
      return;
    }
    
    if (!questionForm.options || questionForm.options.length < 4) {
      toast.error('Sualın ən az 4 cavab seçimi olmalıdır.');
      return;
    }
    // Ensure option texts are non-empty
    for (let i = 0; i < questionForm.options.length; i++) {
      if (!questionForm.options[i].text.trim()) {
        toast.error(`Cavab ${i + 1} üçün mətn daxil edin.`);
        return;
      }
    }

    const payload = {
      vacancyId: parseInt(id),
      text: questionForm.text.trim(),
      order: orderValue,
      options: questionForm.options.map((o) => ({ text: o.text.trim(), isCorrect: !!o.isCorrect })),
    };

    try {
      if (questionForm.id) {
        await put(`/questions/${questionForm.id}`, payload);
        showSuccessToast('Sual yeniləndi.');
      } else {
        await post('/questions', payload);
        showSuccessToast('Sual yaradıldı.');
      }
      resetQuestionForm();
      await fetchQuestions();
    } catch (err) {
      console.error('Question save error', err);
      showErrorToast(err);
    }
  };

  const handleQuestionEdit = async (q) => {
    try {
      const res = await get(`/questions/${q.id}`);
      const data = res.data?.data || res.data || q;
      setQuestionForm({
        id: data.id,
        text: data.text || '',
        order: Math.max(1, data.order || 1), // Minimum 1 olmalıdır
        // keep option ids when loading so we can show/edit them; submission will strip ids
        options: (data.options && data.options.length > 0) ? data.options.map((o) => ({ id: o.id, text: o.text || '', isCorrect: !!o.isCorrect })) : emptyOptions(),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Load question error', err);
      showErrorToast(err);
    }
  };

  const handleQuestionDelete = async (questionId) => {
    if (!window.confirm('Bu sualı silmək istədiyinizə əminsiniz?')) return;
    try {
      await del(`/questions/${questionId}`);
      showSuccessToast('Sual uğurla silindi.');
      await fetchQuestions();
    } catch (err) {
      console.error('Delete question error', err);
      showErrorToast(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    if (typeof dateString === 'string' && /^\d{2}\.\d{2}\.\d{4}/.test(dateString)) return dateString;
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (err) {
      return dateString || '-';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vakansiya Detalları</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/admin/vacancies')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Geri
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {loading ? (
              <div className="p-6 text-center">
                <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 mt-2">Yüklənir...</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{vacancy?.title || '-'}</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{vacancy?.description || '-'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Status:</strong>
                    <div>{vacancy?.isActive ? 'Aktiv' : 'Passiv'}</div>
                  </div>
                  <div>
                    <strong>Yaranma Tarixi:</strong>
                    <div>{formatDate(vacancy?.createdDate)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Namizəd sualları</h3>
            </div>

            {/* Question Form */}
            <form onSubmit={handleQuestionSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sual mətni *</label>
                <input
                  type="text"
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm((p) => ({ ...p, text: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sıra (order)</label>
                <input
                  type="number"
                  min="1"
                  value={questionForm.order}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = Number(value);
                    // Mənfi və ya 0 ola bilməz, minimum 1
                    if (value === '' || (numValue >= 1)) {
                      setQuestionForm((p) => ({ ...p, order: value === '' ? '' : numValue }));
                    }
                  }}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cavab seçimləri (ən az 4)</label>
                <div className="space-y-2">
                  {questionForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder={`Cavab ${idx + 1}`}
                        required
                      />
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="radio"
                          name={`correct-answer-${questionForm.id || 'new'}`}
                          checked={opt.isCorrect}
                          onChange={(e) => {
                            // Radio button seçildiğinde, diğer seçimləri false yap
                            setQuestionForm((prev) => {
                              const next = { ...prev };
                              next.options = prev.options.map((o, i) => ({
                                ...o,
                                isCorrect: i === idx
                              }));
                              return next;
                            });
                          }}
                        />
                        <span>Doğrudur</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="text-red-600 hover:text-red-800 px-2"
                        title="Seçimi sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <button type="button" onClick={addOption} className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                    <Plus className="w-4 h-4" />
                    <span>Seçim əlavə et</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  {questionForm.id ? 'Yenilə' : 'Yarat'}
                </button>
                <button type="button" onClick={resetQuestionForm} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Təmizlə</button>
              </div>
            </form>

            {/* Questions List */}
            <div>
              {qLoading ? (
                <div className="p-6 text-center">
                  <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                </div>
              ) : questions.length === 0 ? (
                <div className="p-6 text-center text-gray-600">Bu vakansiya üçün heç bir sual tapılmadı.</div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="border border-gray-100 p-4 rounded-md flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">{q.text}</div>
                        <div className="text-xs text-gray-600 mt-2">Sıra: {q.order ?? 0}</div>
                        <div className="mt-2 text-sm">
                          {q.options && q.options.length > 0 ? (
                            <ul className="list-disc ml-5">
                              {q.options.map((o, i) => (
                                <li key={i} className={o.isCorrect ? 'text-green-700 font-semibold' : ''}>{o.text}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-gray-500">(Seçim yoxdur)</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleQuestionEdit(q)} className="p-2 hover:bg-blue-50 rounded text-blue-600" title="Redaktə et">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleQuestionDelete(q.id)} className="p-2 hover:bg-red-50 rounded text-red-600" title="Sil">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyId;