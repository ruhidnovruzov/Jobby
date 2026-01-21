import React from 'react';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                JobPortal
              </span>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Azərbaycanda ən yaxşı iş imkanlarını təqdim edən platformadır. Karyeranızı inkişaf etdirin və xəyallarınızdakı işi tapın.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors duration-300" />
              </a>
              <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors duration-300" />
              </a>
              <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors duration-300" />
              </a>
              <a href="#" className="group w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full mr-3"></div>
              Sürətli Keçidlər
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Ana Səhifə', href: '/' },
                { name: 'İş Elanları', href: '/jobs' },
                { name: 'Şirkətlər', href: '/companies' },
                { name: 'Namizədlər', href: '/applicants' },
                { name: 'Haqqımızda', href: '/about' },
                { name: 'Əlaqə', href: '/contact' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="group flex items-center text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" />
                    <span className="group-hover:font-medium transition-all duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full mr-3"></div>
              Xidmətlər
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'İş Axtarışı', href: '/job-search' },
                { name: 'CV Hazırlama', href: '/cv-builder' },
                { name: 'Karyera Məsləhəti', href: '/career-advice' },
                { name: 'Şirkət Profili', href: '/company-profile' },
                { name: 'İş Elanı Yerləşdirmə', href: '/post-job' },
                { name: 'Premium Üzvlük', href: '/premium' }
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href} 
                    className="group flex items-center text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" />
                    <span className="group-hover:font-medium transition-all duration-300">{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mr-3"></div>
              Əlaqə Məlumatları
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-100 leading-relaxed">
                    Bakı şəhəri, Nəsimi rayonu,<br />
                    28 May küçəsi, 123
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <a href="tel:+994501234567" className="text-blue-100 hover:text-white transition-colors duration-300">
                    +994 (50) 123-45-67
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <a href="mailto:info@jobportal.az" className="text-blue-100 hover:text-white transition-colors duration-300">
                    info@jobportal.az
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Xəbər Bülleteni</h4>
              <p className="text-blue-100 text-sm mb-4">Yeni iş elanları haqqında məlumat alın</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Email ünvanınız"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-blue-100">
            <span>© {currentYear} JobPortal. Bütün hüquqlar qorunur.</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="text-blue-100 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-1">
              <span>Məxfilik Siyasəti</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="/terms" className="text-blue-100 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-1">
              <span>İstifadə Şərtləri</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="/cookies" className="text-blue-100 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-1">
              <span>Cookie Siyasəti</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Back to Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 flex items-center justify-center group z-50"
        >
          <ArrowRight className="w-5 h-5 transform -rotate-90 group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;