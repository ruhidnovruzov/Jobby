import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { post, get } from '../api/service';
import { Loader, BookOpen } from 'lucide-react';

const ONE_QUESTION_SECONDS = 60;

const storageKey = (applicantId) => `quiz:${applicantId}`;

const normalizeQuestions = (raw) => {
  const qArr = Array.isArray(raw) ? raw : (raw && (raw.id || raw.text) ? [raw] : []);
  return qArr.map((q) => ({
    id: q.id,
    text: q.text || '',
    order: q.order ?? 1,
    timeLeftSeconds: q.timeLeftSeconds && q.timeLeftSeconds > 0 ? q.timeLeftSeconds : ONE_QUESTION_SECONDS,
    options: (q.options || []).map((o) => ({ id: o.id, text: o.text || '' })),
  }));
};

const QuizStart = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const initialApplicantTotal = location.state?.applicantTotal ?? null;
  const [applicantTotal, setApplicantTotal] = useState(initialApplicantTotal);
  const [metaLoading, setMetaLoading] = useState(false);

  const getErrorDetail = (err) => {
    if (!err) return null;
    return err.response?.data?.detail || err.response?.data?.message || err.message || null;
  };

  useEffect(() => {
    // fetch applicant meta (may include totalQuestions) only if we don't already have it from navigation state
    const fetchMeta = async () => {
      setMetaLoading(true);
      try {
        const res = await get(`/applicants/${applicantId}`);
        const info = res.data?.data || res.data || null;
        setApplicantTotal(info?.totalQuestions ?? null);
      } catch (err) {
        // don't block starting the test; log and ignore
        console.debug('Failed to fetch applicant meta', err);
      } finally {
        setMetaLoading(false);
      }
    };
    if (applicantId && initialApplicantTotal == null) fetchMeta();
  }, [applicantId]);

  const startTest = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await post('/applicants/start-test', { applicantId: Number(applicantId) });
      const payload = res.data?.data?.questions || res.data?.questions || res.data?.data || res.data || [];
      const questions = normalizeQuestions(payload);
      
      // İlk sorudan totalQuestions değerini al (eğer varsa)
      const firstQuestion = Array.isArray(payload) ? payload[0] : payload;
      // prefer applicant-level total if available, otherwise read from first question
      const totalQuestions = firstQuestion?.totalQuestions || applicantTotal || null;

      // persist to localStorage
      const initial = {
        questions,
        currentIndex: 0,
        secondsLeft: questions.length > 0 ? (questions[0].timeLeftSeconds && questions[0].timeLeftSeconds > 0 ? questions[0].timeLeftSeconds : ONE_QUESTION_SECONDS) : ONE_QUESTION_SECONDS,
        totalQuestions, // totalQuestions değerini kaydet (applicant-level preferred)
      };
      localStorage.setItem(storageKey(applicantId), JSON.stringify(initial));

      navigate(`/quiz/${applicantId}/run`);
    } catch (err) {
      console.error('Start test error', err);
      setError(getErrorDetail(err) || 'Test başlatılarkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-8 text-white flex items-center space-x-4">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Quiz Başlat</h1>
            </div>
          </div>

          <div className="p-8 text-center">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <p className="text-lg font-medium mb-2">Sualları cavablandırmaq üçün testi başlatın.</p>

            {metaLoading ? (
              <div className="mb-4 text-sm text-gray-600">Sual sayı yüklənir...</div>
            ) : (
              applicantTotal != null && (
                <div className="mb-4 text-sm text-gray-700">Bu test <span className="font-semibold">{applicantTotal}</span> sualdan ibarətdir.</div>
              )
            )}

            <div className="mb-4 text-left bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm font-semibold text-yellow-800">DİQQƏT</p>
              <p className="text-sm text-yellow-700">İmtahana başladıqdan sonra səhifəni yeniləmək, geri qayıtmaq və ya brauzeri bağlamaq olmaz. İmtahan yalnız bir dəfə keçirilə bilər. Yarımçıq çıxdığınız təqdirdə nəticəniz ləğv olunacaq və imtahan bitmiş sayılacaqdır.</p>
            </div>

            <button onClick={startTest} disabled={loading} className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg inline-flex items-center space-x-3">
              {loading ? (<><Loader className="w-4 h-4 animate-spin"/> <span>Yüklənir...</span></>) : <span>Testi Başlat</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStart;
