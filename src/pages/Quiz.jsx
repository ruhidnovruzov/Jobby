import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../api/service';
import { ArrowLeft, BookOpen, Loader, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
                                        timeLeftSeconds: q.timeLeftSeconds && q.timeLeftSeconds > 0 ? q.timeLeftSeconds : ONE_QUESTION_SECONDS,
                                        options: (q.options || []).map((o) => ({ id: o.id, text: o.text || '' })),
                                    }));
                                    setQuestions(normalized);
                                    // set initial secondsLeft from first question if available
                                    const initialSeconds = normalized.length > 0 ? (normalized[0].timeLeftSeconds && normalized[0].timeLeftSeconds > 0 ? normalized[0].timeLeftSeconds : ONE_QUESTION_SECONDS) : ONE_QUESTION_SECONDS;
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
                    timeLeftSeconds: nextQuestion.timeLeftSeconds && nextQuestion.timeLeftSeconds > 0 ? nextQuestion.timeLeftSeconds : ONE_QUESTION_SECONDS,
                    options: (nextQuestion.options || []).map((o) => ({ id: o.id, text: o.text || '' })),
                };
                // append next question and advance to it
                setQuestions((prev) => [...prev, nq]);
                setCurrentIndex((prev) => prev + 1);
                setSelectedOptionId(null);
                setSecondsLeft(nq.timeLeftSeconds && nq.timeLeftSeconds > 0 ? nq.timeLeftSeconds : ONE_QUESTION_SECONDS);
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
                    setSecondsLeft(questions[next].timeLeftSeconds && questions[next].timeLeftSeconds > 0 ? questions[next].timeLeftSeconds : ONE_QUESTION_SECONDS);
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
                setSecondsLeft(questions[next].timeLeftSeconds && questions[next].timeLeftSeconds > 0 ? questions[next].timeLeftSeconds : ONE_QUESTION_SECONDS);
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
        
        // Prepare chart data
        const totalQuestions = results?.totalQuestions ?? results?.total ?? 0;
        const correctAnswers = results?.correctAnswers ?? 0;
        const wrongAnswers = results?.wrongAnswers ?? 0;
        const scorePercent = results?.scorePercent ?? 0;
        
        const chartData = [
            { name: 'Düzgün cavablar', value: correctAnswers, color: '#10b981' },
            { name: 'Səhv cavablar', value: wrongAnswers, color: '#ef4444' },
        ];
        
        const COLORS = ['#10b981', '#ef4444'];
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Tamamlandı</h2>
                        <p className="text-gray-600">Nəticələriniz aşağıda göstərilir</p>
                    </div>
                    
                    {results ? (
                        <div className="space-y-6">
                            {/* Overall Score - Large Display */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <TrendingUp className="w-6 h-6" />
                                    <span className="text-lg font-semibold">Ümumi Nəticə</span>
                                </div>
                                <div className="text-5xl font-bold mb-1">{scorePercent.toFixed(1)}%</div>
                                <div className="text-blue-100 text-sm">{totalQuestions} sualdan {correctAnswers} düzgün</div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Düzgün Cavab</p>
                                            <p className="text-2xl font-bold text-green-700">{correctAnswers}</p>
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
                                            <p className="text-2xl font-bold text-red-700">{wrongAnswers}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">İmtahan nəticəsi</h3>
                                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                                    <div className="w-full md:w-80 h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart margin={{ top: 10, right: 10, bottom: 60, left: 10 }}>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={false}
                                                    outerRadius={100}
                                                    innerRadius={40}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(value, name) => {
                                                        const total = chartData.reduce((sum, item) => sum + item.value, 0);
                                                        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                                        return [`${value} (${percent}%)`, name];
                                                    }}
                                                />
                                                <Legend 
                                                    verticalAlign="bottom" 
                                                    height={50}
                                                    iconType="circle"
                                                    wrapperStyle={{ paddingTop: '20px' }}
                                                    formatter={(value) => {
                                                        const entry = chartData.find(item => item.name === value);
                                                        if (!entry) return value;
                                                        const total = chartData.reduce((sum, item) => sum + item.value, 0);
                                                        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                                                        return `${value}: ${entry.value} (${percent}%)`;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    
                                    {/* Detailed Stats */}
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-700 font-medium">Ümumi Suallar</span>
                                                <span className="text-xl font-bold text-gray-800">{totalQuestions}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-700 font-medium">Düzgün Cavab</span>
                                                <span className="text-xl font-bold text-green-600">{correctAnswers}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${totalQuestions > 0 ? (correctAnswers / totalQuestions * 100) : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-700 font-medium">Səhv Cavab</span>
                                                <span className="text-xl font-bold text-red-600">{wrongAnswers}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className="bg-red-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${totalQuestions > 0 ? (wrongAnswers / totalQuestions * 100) : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 mb-6">Cavablarınız qeydə alındı. Tezliklə nəticələr görünəcək.</p>
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <button 
    onClick={() => navigate('/')} 
    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md"
>
    Ana Səhifəyə Qayıt
</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              

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
                                <button onClick={startTest} disabled={loading} className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-lg">
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
