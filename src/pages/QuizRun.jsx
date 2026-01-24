import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { post } from '../api/service';
import { Loader, ArrowLeft, BookOpen } from 'lucide-react';

const ONE_QUESTION_SECONDS = 60;
const storageKey = (applicantId) => `quiz:${applicantId}`;

const QuizRun = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // used for submit/finish
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(ONE_QUESTION_SECONDS);
  const [finishedResults, setFinishedResults] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const timerRef = useRef(null);
  const submittingRef = useRef(false);
  const selectedOptionRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  // load from localStorage on mount. If no data, redirect to start
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(applicantId));
    if (!raw) {
      navigate(`/quiz/${applicantId}/start`);
      return;
    }
    try {
      const state = JSON.parse(raw);
      setQuestions(state.questions || []);
      setCurrentIndex(state.currentIndex || 0);
      setSecondsLeft(state.secondsLeft || ONE_QUESTION_SECONDS);
      setTotalQuestions(state.totalQuestions || null);
    } catch (err) {
      console.error('Failed to parse quiz state', err);
      navigate(`/quiz/${applicantId}/start`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]);

  useEffect(() => {
    // start timer when questions loaded
    if (questions.length > 0) startTimer();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, currentIndex]);

  // persist state whenever questions/currentIndex/secondsLeft/totalQuestions change
  useEffect(() => {
    const toStore = { questions, currentIndex, secondsLeft, totalQuestions };
    localStorage.setItem(storageKey(applicantId), JSON.stringify(toStore));
  }, [questions, currentIndex, secondsLeft, totalQuestions, applicantId]);

  const startTimer = (initialSeconds = secondsLeft) => {
    // clear any existing timers
    stopTimer();
    // set initial seconds
    setSecondsLeft(initialSeconds);

    // visual countdown interval
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    // schedule auto-submit once after initialSeconds
    submitTimeoutRef.current = setTimeout(() => {
      if (!submittingRef.current) handleAutoSubmit();
    }, initialSeconds * 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
  };

  const handleAutoSubmit = async () => {
    // send selected option if user picked one; otherwise send null
    const optionToSend = selectedOptionRef.current == null ? null : selectedOptionRef.current;
    await submitAnswer(optionToSend);
  };

  // helper to normalize server nextQuestion
  const normalizeNextQuestion = (nextQuestion) => {
    if (!nextQuestion) return null;
    return {
      id: nextQuestion.id,
      text: nextQuestion.text || '',
      order: nextQuestion.order ?? (questions.length + 1),
      timeLeftSeconds: nextQuestion.timeLeftSeconds ?? ONE_QUESTION_SECONDS,
      totalQuestions: nextQuestion.totalQuestions ?? null,
      options: (nextQuestion.options || []).map((o) => ({ id: o.id, text: o.text || '' })),
    };
  };

  const submitAnswer = async (optionId) => {
    // prevent duplicate concurrent submissions
    if (submittingRef.current) return;
    submittingRef.current = true;
    stopTimer();
    setLoading(true);
    setError('');
    const question = questions[currentIndex];

    try {
      // send null for empty
      const payload = {
        applicantId: Number(applicantId),
        questionId: Number(question.id),
        // backend expects questionOptionId; use null when unanswered
        questionOptionId: optionId == null ? null : Number(optionId),
      };

      const res = await post('/applicants/submit-answer', payload);
      const resp = res.data?.data || res.data || {};
      const isFinished = resp.isFinished ?? false;
      const nextQuestionRaw = resp.nextQuestion || null;

      if (nextQuestionRaw) {
        const nq = normalizeNextQuestion(nextQuestionRaw);
        // Eğer yeni soruda totalQuestions varsa ve state'de yoksa, güncelle
        if (nq.totalQuestions && !totalQuestions) {
          setTotalQuestions(nq.totalQuestions);
        }
        setQuestions((prev) => [...prev, nq]);
        setCurrentIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        selectedOptionRef.current = null;
        setSecondsLeft(nq.timeLeftSeconds);
        startTimer();
      } else if (isFinished) {
        // server says finished. If it returned results/finishResult, use them.
        const resultsCandidate = resp.results || resp.finishResult || resp;
        const hasMeaningfulResults = resultsCandidate && (
          resultsCandidate.totalQuestions !== undefined ||
          resultsCandidate.total !== undefined ||
          resultsCandidate.correctAnswers !== undefined ||
          resultsCandidate.wrongAnswers !== undefined ||
          resultsCandidate.scorePercent !== undefined ||
          resultsCandidate.finishResult !== undefined ||
          resultsCandidate.results !== undefined
        );

        if (hasMeaningfulResults) {
          setFinishedResults(resultsCandidate);
          localStorage.removeItem(storageKey(applicantId));
          navigate(`/quiz/${applicantId}/finished`, { state: { results: resultsCandidate } });
        } else {
          // backend only acknowledged finish; call finish endpoint to retrieve final results
          await finishTest();
        }
      } else {
        // fallback: try to advance locally
        const next = currentIndex + 1;
        if (next < questions.length) {
          setCurrentIndex(next);
          setSelectedOptionId(null);
          selectedOptionRef.current = null;
          setSecondsLeft(questions[next].timeLeftSeconds ?? ONE_QUESTION_SECONDS);
          startTimer();
        } else {
          // final fallback: call finish
          await finishTest();
        }
      }
    } catch (err) {
      console.error('Submit error', err);
      setError(err.response?.data?.message || 'Cavab göndərilərkən xəta oldu.');
      // try to continue locally
      const next = currentIndex + 1;
      if (next < questions.length) {
        setCurrentIndex(next);
        setSelectedOptionId(null);
        selectedOptionRef.current = null;
        setSecondsLeft(questions[next].timeLeftSeconds ?? ONE_QUESTION_SECONDS);
        startTimer();
      }
    } finally {
      setLoading(false);
      // allow subsequent submissions
      submittingRef.current = false;
    }
  };

  const finishTest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await post('/applicants/finish-test', { applicantId: Number(applicantId) });
      const results = res.data?.data || res.data || null;
      setFinishedResults(results);
      localStorage.removeItem(storageKey(applicantId));
      navigate(`/quiz/${applicantId}/finished`, { state: { results } });
    } catch (err) {
      console.error('Finish error', err);
      setError(err.response?.data?.message || 'Test bitirilmədi.');
    } finally {
      setLoading(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="mb-4">Test üçün sual tapılmadı və ya test başlanmayıb.</p>
          <button onClick={() => navigate(`/quiz/${applicantId}/start`)} className="px-4 py-2 bg-blue-600 text-white rounded">Testi Başlat</button>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleSelectOption = (id) => {
    setSelectedOptionId(id);
    selectedOptionRef.current = id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6">
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-8 text-white">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Quiz</h1>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <Loader className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-blue-800 font-medium">Zəhmət olmasa gözləyin...</span>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Sual {currentIndex + 1} / {totalQuestions ?? question.totalQuestions ?? questions.length}
                </div>
                <div className="text-sm font-medium text-gray-800">Vaxt: {secondsLeft}s</div>
              </div>

              <div className="p-4 border rounded-lg mb-4">
                <div className="font-semibold text-lg mb-2">{question.text}</div>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {question.options && question.options.map((opt) => (
                    <button key={opt.id} onClick={() => handleSelectOption(opt.id)} type="button"
                      className={`text-left p-3 border rounded-lg ${selectedOptionId === opt.id ? 'bg-blue-50 border-blue-400' : 'bg-white hover:bg-gray-50'}`}>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="mb-3 text-red-600">{error}</div>}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Seçim etdikdən sonra "Göndər" düyməsi ilə davam edin. Vaxt bitərsə sistem avtomatik göndərəcək.</div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => submitAnswer(selectedOptionRef.current == null ? null : selectedOptionRef.current)} disabled={loading} className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md flex items-center space-x-2">
                    {loading ? (<><Loader className="w-4 h-4 animate-spin" /><span>Göndərilir...</span></>) : <span>Göndər</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRun;
