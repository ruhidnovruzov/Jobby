import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import DefaultLayout from './layout/DefaultLayout';

// Components
import ProtectedRoute from './components/ProtectedRouter';

// Pages
import HomePage from './pages/HomePage';
import JobDetails from './pages/JobDetails';
import ApplyForm from './pages/ApplyForm';
import Quiz from './pages/Quiz';
import QuizStart from './pages/QuizStart';
import QuizRun from './pages/QuizRun';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CategoryManagement from './pages/Admin/CategoryManagement';
import CategoryVacancies from './pages/Admin/CategoryVacancies';
import VacancyManagement from './pages/Admin/VacancyManagement';
import VacancyId from './pages/Admin/VacancyId';
import ApplicantsList from './pages/Admin/ApplicantsList';
import ApplicantDetail from './pages/Admin/ApplicantDetail';

// Helper redirect component for bare /quiz/:applicantId -> send to /quiz/:applicantId/start
const QuizRedirect = () => {
  const { applicantId } = useParams();
  return <Navigate to={`/quiz/${applicantId}/start`} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Hər kəs daxil ola bilər */}
          <Route
            path="/"
            element={
              <DefaultLayout>
                <HomePage />
              </DefaultLayout>
            }
          />

          {/* Job Details Page */}
          <Route
            path="/jobs/:id"
            element={
              <DefaultLayout>
                <JobDetails />
              </DefaultLayout>
            }
          />

          {/* Job Apply Page */}
          <Route
            path="/jobs/:id/apply"
            element={
              <DefaultLayout>
                <ApplyForm />
              </DefaultLayout>
            }
          />

          {/* Quiz start / run / finished routes */}
          <Route
            path="/quiz/:applicantId"
            element={
              <DefaultLayout>
                <QuizRedirect />
              </DefaultLayout>
            }
          />
          <Route
            path="/quiz/:applicantId/start"
            element={
              <DefaultLayout>
                <QuizStart />
              </DefaultLayout>
            }
          />
          <Route
            path="/quiz/:applicantId/run"
            element={
              <DefaultLayout>
                <QuizRun />
              </DefaultLayout>
            }
          />
          <Route
            path="/quiz/:applicantId/finished"
            element={
              <DefaultLayout>
                <Quiz />
              </DefaultLayout>
            }
          />

          {/* Admin Routes */}
          {/* /admin → /admin-login'ə yönləndir */}
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />

          {/* Admin Login Səhifəsi - Hər kəs daxil ola bilər */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Dashboard - Yalnız login olmuş istifadəçilər */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin - Category Management */}
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin - Category Vacancies */}
          <Route
            path="/admin/categories/:id/vacancies"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <CategoryVacancies />
              </ProtectedRoute>
            }
          />

          {/* Admin - Vacancy Management */}
          <Route
            path="/admin/vacancies"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <VacancyManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin - Vacancy Detail by ID */}
          <Route
            path="/admin/vacancies/:id"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <VacancyId />
              </ProtectedRoute>
            }
          />

          {/* Admin - Applicants List */}
          <Route
            path="/admin/applicants"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <ApplicantsList />
              </ProtectedRoute>
            }
          />

          {/* Admin - Applicant Detail by ID */}
          <Route
            path="/admin/applicants/:id"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                requireAuth={true}
                redirectTo="/admin-login"
              >
                <ApplicantDetail />
              </ProtectedRoute>
            }
          />
          


          {/* 404 Route - Tapılmayan səhifələr üçün */}
          <Route
            path="*"
            element={
              <DefaultLayout>
                <NotFoundPage />
              </DefaultLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// 404 Not Found Component
const NotFoundPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Səhifə Tapılmadı</h2>
          <p className="text-gray-600 mb-6">Axtardığınız səhifə mövcud deyil və ya silinib.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ana Səhifəyə Qayıt
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default App;