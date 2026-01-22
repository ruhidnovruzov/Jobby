import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../api/service';
import { ArrowLeft, BookOpen, Loader, AlertCircle } from 'lucide-react';

const ONE_QUESTION_SECONDS = 60;

const Quiz = () => {
    const { applicantId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(ONE_QUESTION_SECONDS);
    const [finishedResults, setFinishedResults] = useState(null);
    const location = useLocation();
    const [testStarted, setTestStarted] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // clear timer on unmount
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startTest = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await post('/applicants/start-test', { applicantId: Number(applicantId) });
            // backend may return questions in various shapes: res.data.data.questions or res.data.questions or res.data
            const payload = res.data?.data?.questions || res.data?.questions || res.data?.data || res.data || [];
                                                const payloadRaw = payload;
                                                // Debug raw payload shape
                                                // console.debug('start-test payload:', payloadRaw);

                                                let qArr = [];
                                                if (Array.isArray(payloadRaw)) {
                                                    qArr = payloadRaw;
                                                } else if (payloadRaw && typeof payloadRaw === 'object' && (payloadRaw.id || payloadRaw.text)) {
                                                    // backend returned a single question object instead of an array
                                                    qArr = [payloadRaw];
                                                } else {
                                                    qArr = [];
                                                }
                                    // Normalize questions: ensure options are in shape { id, text } and timeLeftSeconds exists
                                    const normalized = qArr.map((q) => ({
                                        id: q.id,
                                        text: q.text || '',
                                        order: q.order ?? 1,
                                        timeLeftSeconds: q.timeLeftSeconds ?? ONE_QUESTION_SECONDS,
                                        options: (q.options || []).map((o) => ({ id: o.id, text: o.text || '' })),
                                    }));
                                    setQuestions(normalized);
                                    // set initial secondsLeft from first question if available
                                    const initialSeconds = normalized.length > 0 ? (normalized[0].timeLeftSeconds || ONE_QUESTION_SECONDS) : ONE_QUESTION_SECONDS;
                                    setSecondsLeft(initialSeconds);
                                    setTestStarted(true);
                                    setCurrentIndex(0);
                                    setSelectedOptionId(null);
                                    startTimer();
        } catch (err) {
            console.error('Start test error', err);
            setError(err.response?.data?.message || 'Test başlatılarkən xəta baş verdi.');
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    // auto-submit when timer reaches 0
                    handleAutoSubmit();
                    return ONE_QUESTION_SECONDS;
                }
                return s - 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleAutoSubmit = async () => {
        // submit with selectedOptionId or 0 for empty
        await submitAnswer(selectedOptionId || 0);
    };

    const submitAnswer = async (optionId) => {
        // prevent double submissions
        stopTimer();
        setLoading(true);
        setError('');
        const question = questions[currentIndex];
        try {
            const res = await post('/applicants/submit-answer', {
                applicantId: Number(applicantId),
                questionId: Number(question.id),
                questionOptionId: Number(optionId)
            });

            const resp = res.data?.data || res.data || {};
            const isFinished = resp.isFinished ?? false;
            const nextQuestion = resp.nextQuestion || null;

            if (nextQuestion) {
                const nq = {
                    id: nextQuestion.id,
                    text: nextQuestion.text || '',
                    order: nextQuestion.order ?? (questions.length + 1),
                    timeLeftSeconds: nextQuestion.timeLeftSeconds || ONE_QUESTION_SECONDS,
                    options: (nextQuestion.options || []).map((o) => ({ id: o.id, text: o.text || '' })),
                };
                // append next question and advance to it
                setQuestions((prev) => [...prev, nq]);
                setCurrentIndex((prev) => prev + 1);
                setSelectedOptionId(null);
                setSecondsLeft(nq.timeLeftSeconds);
                startTimer();
            } else if (isFinished) {
                // server indicates test finished; use results if present or call finishTest
                const results = resp.results || resp.finishResult || resp;
                if (results && (results.totalQuestions !== undefined || results.total !== undefined)) {
                    setFinishedResults(results);
                    navigate(`/quiz/${applicantId}/finished`, { state: { results } });
                } else {
                    await finishTest();
                }
            } else {
                // fallback: advance locally if possible
                const next = currentIndex + 1;
                if (next < questions.length) {
                    setCurrentIndex(next);
                    setSelectedOptionId(null);
                    setSecondsLeft(questions[next].timeLeftSeconds ?? ONE_QUESTION_SECONDS);
                    startTimer();
                } else {
                    await finishTest();
                }
            }
        } catch (err) {
            console.error('Submit answer error', err);
            setError(err.response?.data?.message || 'Cavab göndərilərkən xəta oldu.');
            // try to continue locally
            const next = currentIndex + 1;
            if (next < questions.length) {
                setCurrentIndex(next);
                setSelectedOptionId(null);
                setSecondsLeft(questions[next].timeLeftSeconds ?? ONE_QUESTION_SECONDS);
                startTimer();
            }
        } finally {
            setLoading(false);
        }
    };

    const finishTest = async () => {
        setLoading(true);
        try {
            const res = await post('/applicants/finish-test', { applicantId: Number(applicantId) });
            const results = res.data?.data || res.data || null;
            setFinishedResults(results);
            // navigate to finished route and pass results in location state to avoid 404 and allow display
            navigate(`/quiz/${applicantId}/finished`, { state: { results } });
        } catch (err) {
            console.error('Finish test error', err);
            setError(err.response?.data?.message || 'Test bitirilmədi.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionId) => {
        setSelectedOptionId(optionId);
    };

    // manual submit (before timer ends)
    const handleSubmitNow = async () => {
        await submitAnswer(selectedOptionId || 0);
    };

    // Finished screen - check location.state first, otherwise use finishedResults
    if (window.location.pathname.endsWith('/finished')) {
        const results = location.state?.results || finishedResults;
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold mb-4">Test tamamlandı</h2>
                    {results ? (
                        <div className="text-left space-y-3 mb-6">
                            <div>Total suallar: <strong>{results.totalQuestions ?? results.total ?? 0}</strong></div>
                            <div>Doğru cavablar: <strong>{results.correctAnswers ?? 0}</strong></div>
                            <div>Yanlış cavablar: <strong>{results.wrongAnswers ?? 0}</strong></div>
                            <div>Skor: <strong>{results.scorePercent ?? 0}%</strong></div>
                        </div>
                    ) : (
                        <p className="text-gray-600 mb-6">Cavablarınız qeydə alındı. Tezliklə nəticələr görünəcək.</p>
                    )}
                    <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Ana səhifə</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6">
                    <ArrowLeft className="w-5 h-5" /> <span>Geri Qayıt</span>
                </button>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-8 text-white">
                        <div className="flex items-center space-x-4">
                            <BookOpen className="w-8 h-8" />
                            <div>
                                <h1 className="text-3xl font-bold">Quiz</h1>
                                <p className="text-blue-100">Applicant ID: <span className="font-semibold">{applicantId}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Pending overlay shown while submitting/finishing (only after test started) */}
                        {testStarted && loading && (
                            <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
                                <div className="flex items-center space-x-3">
                                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                                    <span className="text-blue-800 font-medium">Zəhmət olmasa gözləyin...</span>
                                </div>
                            </div>
                        )}
                        {!testStarted ? (
                            <div className="text-center py-12">
                                <h2 className="text-2xl font-bold mb-4">Testə başlamaq üçün hazırsınız?</h2>
                                {error && <div className="mb-4 text-red-600">{error}</div>}
                                <button onClick={startTest} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                                    {loading ? (<><Loader className="w-4 h-4 animate-spin inline-block mr-2"/>Yüklənir...</>) : 'Testi Başlat'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                {questions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">Bu vakansiya üçün heç bir sual tapılmadı.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-sm text-gray-600">Sual {currentIndex + 1} / {questions.length}</div>
                                            <div className="text-sm font-medium text-gray-800">Vaxt: {secondsLeft}s</div>
                                        </div>

                                        <div className="p-4 border rounded-lg mb-4">
                                            <div className="font-semibold text-lg mb-2">{questions[currentIndex].text}</div>
                                            <div className="grid grid-cols-1 gap-3 mt-3">
                                                {questions[currentIndex].options && questions[currentIndex].options.map((opt) => (
                                                    <button key={opt.id} onClick={() => handleOptionSelect(opt.id)} type="button"
                                                        className={`text-left p-3 border rounded-lg ${selectedOptionId === opt.id ? 'bg-blue-50 border-blue-400' : 'bg-white hover:bg-gray-50'}`}>
                                                        {opt.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">Seçim etdikdən sonra "Göndər" düyməsi ilə davam edin. Vaxt bitərsə sistem avtomatik göndərəcək.</div>
                                                <div className="flex items-center space-x-2">
                                                <button onClick={handleSubmitNow} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center space-x-2">
                                                    {loading ? (<><Loader className="w-4 h-4 animate-spin" /><span>Göndərilir...</span></>) : <span>Göndər</span>}
                                                </button>
                                                <button onClick={finishTest} disabled={loading} className="px-4 py-2 bg-gray-200 rounded-md flex items-center space-x-2">
                                                    {loading ? (<><Loader className="w-4 h-4 animate-spin text-gray-600" /><span>Bitirilir...</span></>) : <span>Bitir</span>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
