import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, BarChart3, Tags, Briefcase, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: BarChart3,
      path: '/admin-dashboard',
    },
    {
      label: 'Kateqoriyalar',
      icon: Tags,
      path: '/admin/categories',
    },
    {
      label: 'Vakansiyalar',
      icon: Briefcase,
      path: '/admin/vacancies',
    },
    {
      label: 'Müraciətçilər',
      icon: Users,
      path: '/admin/applicants',
    },
  ];

  const isActive = (path) => {
    if (path === '/admin/applicants') {
      return location.pathname.startsWith('/admin/applicants');
    }
    return location.pathname === path;
  };

  return (
    <div
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-blue-900 to-indigo-900 text-white transition-all duration-300 shadow-lg flex flex-col fixed h-screen left-0 top-0 z-50`}
    >
      {/* Logo/Header */}
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        {open && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold">
              JB
            </div>
            <span className="font-bold text-lg">Jobby</span>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-1 hover:bg-blue-800 rounded-lg transition-all"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-white text-blue-900 font-semibold'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {open && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {open && <span>Çıxış</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
