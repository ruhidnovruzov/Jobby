# Jobby - İş Elanları və Başvuru Sistemi

Jobby, iş elanları yayımlamaq, başvuruları idarə etmək və namizədləri qiymətləndirmək üçün hazırlanmış müasir bir veb tətbiqdir.

## 📋 Məzmun

- [Xüsusiyyətlər](#xüsusiyyətlər)
- [Texnologiyalar](#texnologiyalar)
- [Quraşdırma](#quraşdırma)
- [İstifadə](#istifadə)
- [Admin Paneli](#admin-paneli)
- [Route Strukturu](#route-strukturu)
- [API Konfiqurasiyası](#api-konfiqurasiyası)
- [Layihə Strukturu](#layihə-strukturu)

## ✨ Xüsusiyyətlər

### İstifadəçi Tərəfi
- 📄 İş elanlarını görüntüləmə və filtrləmə
- 🔍 Detallı iş məlumatlarını görüntüləmə
- 📝 İşə müraciət etmə
- 📊 Online quiz/test sistemi
- ⏱️ Vaxt məhdudiyyəti ilə sual cavablandırma
- 📈 Quiz nəticələrini görüntüləmə

### Admin Paneli
- 📊 Dashboard - Statistikalar və qrafiklər
- 🏢 Şirkət idarəetməsi
- 📂 Kateqoriya idarəetməsi
- 💼 Vakansiya idarəetməsi
- 👥 Namizəd idarəetməsi
- 📋 Başvuruları görüntüləmə və qiymətləndirmə
- 📊 Quiz nəticələrini analiz etmə

## 🛠️ Texnologiyalar

- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.12.0
- **Styling:** Tailwind CSS 4.1.18
- **HTTP Client:** Axios 1.13.2
- **Charts:** Recharts 3.7.0
- **Icons:** Lucide React 0.562.0
- **Notifications:** React Hot Toast 2.6.0

## 🚀 Quraşdırma

### Tələblər
- Node.js (v18 və ya daha yeni)
- npm və ya yarn

### Addımlar

1. **Layihəni klonlayın:**
   ```bash
   git clone <repository-url>
   cd Jobby
   ```

2. **Asılılıqları quraşdırın:**
   ```bash
   npm install
   ```

3. **API konfiqurasiyasını yoxlayın:**
   `src/api/config.ts` faylında API base URL-i təyin edin:
   ```typescript
   const API_BASE_URL = 'http://188.132.237.113:5067/api';
   ```

4. **Development serveri başladın:**
   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   ```

6. **Build preview:**
   ```bash
   npm run preview
   ```

## 📖 İstifadə

### İstifadəçi Tərəfi

1. **Ana Səhifə:** `/vacancy/`
   - Bütün iş elanlarını görüntüləyin
   - Filtrlərlə axtarış edin

2. **İş Detalları:** `/vacancy/jobs/:id`
   - İş haqqında ətraflı məlumat
   - Müraciət etmək üçün düymə

3. **Müraciət Formu:** `/vacancy/jobs/:id/apply`
   - Şəxsi məlumatları doldurun
   - Müraciəti göndərin

4. **Quiz Sistemi:**
   - `/vacancy/quiz/:applicantId/start` - Quiz başlatma
   - `/vacancy/quiz/:applicantId/run` - Quiz cavablandırma
   - `/vacancy/quiz/:applicantId/finished` - Nəticələri görüntüləmə

## 🔐 Admin Paneli

### Adminə Daxil Olmaq

1. **Admin Login Səhifəsinə keçin:**
   ```
   http://localhost:5173/vacancy/admin-login
   ```
   və ya
   ```
   http://localhost:5173/vacancy/admin
   ```
   (avtomatik olaraq `/admin-login`-ə yönləndiriləcək)

2. **Email və Parol ilə daxil olun:**
   - Admin email adresinizi daxil edin
   - Parolunuzu daxil edin
   - "Daxil Ol" düyməsinə klikləyin

3. **Dashboard-a yönləndiriləcəksiniz:**
   - Uğurlu girişdən sonra `/admin-dashboard` səhifəsinə yönləndiriləcəksiniz

### Admin Paneli Səhifələri

#### 📊 Dashboard
**URL:** `/vacancy/admin-dashboard`

- Ümumi statistikalar
- Ən çox müraciət alan vakansiyalar
- Uğur dərəcələri
- Ən yaxşı namizədlər
- Qrafiklər və vizuallaşdırmalar

#### 🏢 Şirkət İdarəetməsi
**URL:** `/vacancy/admin/companies`

- Şirkətləri əlavə etmə, redaktə etmə, silmə
- Şirkət profillərini idarə etmə

#### 📂 Kateqoriya İdarəetməsi
**URL:** `/vacancy/admin/categories`

- Kateqoriyaları əlavə etmə, redaktə etmə, silmə
- Kateqoriyalara görə vakansiyaları görüntüləmə

**Kateqoriya Vakansiyaları:**
**URL:** `/vacancy/admin/categories/:id/vacancies`

- Müəyyən kateqoriyaya aid vakansiyaları görüntüləmə

#### 💼 Vakansiya İdarəetməsi
**URL:** `/vacancy/admin/vacancies`

- Bütün vakansiyaları görüntüləmə
- Yeni vakansiya əlavə etmə
- Vakansiyaları redaktə etmə və silmə

**Vakansiya Detalları:**
**URL:** `/vacancy/admin/vacancies/:id`

- Vakansiya haqqında ətraflı məlumat
- Vakansiyaya müraciət edən namizədləri görüntüləmə

#### 👥 Namizəd İdarəetməsi
**URL:** `/vacancy/admin/applicants`

- Bütün namizədlərin siyahısı
- Namizədləri filtrləmə və axtarış

**Namizəd Detalları:**
**URL:** `/vacancy/admin/applicants/:id`

- Namizədin şəxsi məlumatları
- Quiz nəticələri
- Başvuru statusu
- Qiymətləndirmə və qeydlər

## 🗺️ Route Strukturu

### Public Routes (Hər kəs daxil ola bilər)

| Route | Açıqlama |
|-------|----------|
| `/vacancy/` | Ana səhifə - İş elanları siyahısı |
| `/vacancy/jobs/:id` | İş detalları səhifəsi |
| `/vacancy/jobs/:id/apply` | Müraciət formu |
| `/vacancy/quiz/:applicantId` | Quiz redirect (avtomatik `/start`-ə yönləndirir) |
| `/vacancy/quiz/:applicantId/start` | Quiz başlatma səhifəsi |
| `/vacancy/quiz/:applicantId/run` | Quiz cavablandırma səhifəsi |
| `/vacancy/quiz/:applicantId/finished` | Quiz nəticələri səhifəsi |

### Admin Routes (Yalnız admin rolü)

| Route | Açıqlama |
|-------|----------|
| `/vacancy/admin` | Admin redirect (avtomatik `/admin-login`-ə yönləndirir) |
| `/vacancy/admin-login` | Admin giriş səhifəsi |
| `/vacancy/admin-dashboard` | Admin dashboard |
| `/vacancy/admin/categories` | Kateqoriya idarəetməsi |
| `/vacancy/admin/categories/:id/vacancies` | Kateqoriyaya aid vakansiyalar |
| `/vacancy/admin/vacancies` | Vakansiya idarəetməsi |
| `/vacancy/admin/vacancies/:id` | Vakansiya detalları |
| `/vacancy/admin/applicants` | Namizəd siyahısı |
| `/vacancy/admin/applicants/:id` | Namizəd detalları |

### Protected Routes

Bütün admin route-ları `ProtectedRoute` komponenti ilə qorunur:
- Yalnız `admin` rolü olan istifadəçilər daxil ola bilər
- Giriş edilməyibsə, `/admin-login`-ə yönləndirilir
- Token yoxdursa və ya etibarsızdırsa, avtomatik çıxış edilir

## ⚙️ API Konfiqurasiyası

API konfiqurasiyası `src/api/config.ts` faylında təyin edilir:

```typescript
const API_BASE_URL = 'http://188.132.237.113:5067/api';
```

### API Endpoint-ləri

#### Authentication
- `POST /auth/login` - Admin girişi
- `GET /auth/user-info` - İstifadəçi məlumatları

#### Vacancies (İş Elanları)
- `GET /vacancies` - Bütün vakansiyaları əldə et
- `GET /vacancies/:id` - Vakansiya detalları
- `POST /vacancies` - Yeni vakansiya əlavə et
- `PUT /vacancies/:id` - Vakansiyanı yenilə
- `DELETE /vacancies/:id` - Vakansiyanı sil

#### Applicants (Namizədlər)
- `GET /applicants` - Bütün namizədləri əldə et
- `GET /applicants/:id` - Namizəd detalları
- `POST /applicants/start-test` - Quiz başlat
- `POST /applicants/submit-answer` - Cavab göndər
- `POST /applicants/finish-test` - Quiz bitir

#### Categories (Kateqoriyalar)
- `GET /categories` - Bütün kateqoriyaları əldə et
- `POST /categories` - Yeni kateqoriya əlavə et
- `PUT /categories/:id` - Kateqoriyanı yenilə
- `DELETE /categories/:id` - Kateqoriyanı sil

### Authentication

API sorğuları avtomatik olaraq `Authorization` header-ə token əlavə edir:
```typescript
Authorization: Bearer <token>
```

Token localStorage-da saxlanılır və hər sorğuda avtomatik əlavə edilir.

## 📁 Layihə Strukturu

```
Jobby/
├── public/                 # Statik fayllar
├── src/
│   ├── api/               # API konfiqurasiyası və servislər
│   │   ├── config.ts      # Axios konfiqurasiyası
│   │   └── service.ts     # API funksiyaları
│   ├── components/         # Yenidən istifadə olunan komponentlər
│   │   ├── AdminSidebar.jsx
│   │   ├── AuthForm.jsx
│   │   ├── CategoryManagement.jsx
│   │   ├── CompanyManagement.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Footer.jsx
│   │   ├── Home/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobFilterForm.jsx
│   │   │   └── JobList.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRouter.jsx
│   ├── context/           # React Context API
│   │   └── AuthContext.jsx
│   ├── layout/            # Layout komponentləri
│   │   └── DefaultLayout.jsx
│   ├── pages/             # Səhifə komponentləri
│   │   ├── Admin/         # Admin paneli səhifələri
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ApplicantDetail.jsx
│   │   │   ├── ApplicantsList.jsx
│   │   │   ├── CategoryManagement.jsx
│   │   │   ├── CategoryVacancies.jsx
│   │   │   ├── VacancyId.jsx
│   │   │   └── VacancyManagement.jsx
│   │   ├── ApplyForm.jsx
│   │   ├── HomePage.jsx
│   │   ├── JobDetails.jsx
│   │   ├── Quiz.jsx
│   │   ├── QuizRun.jsx
│   │   └── QuizStart.jsx
│   ├── App.jsx            # Ana komponent və route konfiqurasiyası
│   ├── main.jsx           # Entry point
│   └── index.css          # Global stillər
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔒 Təhlükəsizlik

- Bütün admin route-ları `ProtectedRoute` komponenti ilə qorunur
- JWT token əsaslı autentifikasiya
- 401 xətası alındıqda avtomatik çıxış
- Token localStorage-da saxlanılır

## 🐛 Problemlərin Həlli

### Admin-ə daxil ola bilmirəm
1. Email və parolun düzgün olduğunu yoxlayın
2. API serverinin işlədiyini yoxlayın (`src/api/config.ts`)
3. Browser console-da xətaları yoxlayın
4. Token localStorage-da saxlanılıb-saxlanılmadığını yoxlayın

### Quiz işləmir
1. `applicantId`-nin düzgün olduğunu yoxlayın
2. localStorage-da quiz məlumatlarının olduğunu yoxlayın
3. API endpoint-lərinin düzgün işlədiyini yoxlayın

### Route-lar işləmir
1. Browser URL-də `/vacancy/` base path-in olduğunu yoxlayın
2. React Router versiyasını yoxlayın
3. Browser console-da xətaları yoxlayın

## 📝 Scripts

```bash
# Development serveri başlat
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# ESLint yoxla
npm run lint
```

## 👥 İstifadəçi Rolləri

- **Admin:** Bütün admin paneli funksiyalarına çıxış
- **İstifadəçi:** İş elanlarını görüntüləmə və müraciət etmə

## 📄 Lisenziya

Bu layihə özəl mülkiyyətdir.

## 📞 Əlaqə

Suallarınız və ya problemlər üçün layihə idarəçiləri ilə əlaqə saxlayın.

---

**Qeyd:** Bu README faylı layihənin əsas funksiyalarını və istifadə qaydalarını əhatə edir. Əlavə məlumat üçün kod bazasına baxın.
