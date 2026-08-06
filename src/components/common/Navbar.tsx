import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar, User as UserIcon, Bell,
  LayoutDashboard, Scissors, Users, Store, Settings as SettingsIcon,
  LogOut, ChevronDown, Trash2, Menu, X, BarChart3, LogIn, KeyRound
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout, notifications, markNotificationRead, clearAllNotifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRole = ['super_admin', 'branch_manager', 'staff'].includes(currentUser.role) && isAuthenticated;

  // Filter relevant notifications specifically for current user account & role
  const userNotifs = notifications.filter(n => {
    // Direct match for specific user ID always takes top precedence
    if (n.user_id && n.user_id === currentUser.id) return true;

    // Client/Guest ONLY sees notifications explicitly addressed to them
    if (currentUser.role === 'client' || currentUser.role === 'guest') {
      return n.user_id === currentUser.id;
    }

    // Super Admin sees all system/admin notifications
    if (currentUser.role === 'super_admin') {
      return !n.user_id || n.target_role === 'super_admin' || n.target_role === 'branch_manager';
    }

    // Branch Manager sees notifications for their specific branch or role
    if (currentUser.role === 'branch_manager') {
      if (n.user_id && n.user_id !== currentUser.id) return false;
      if (n.branch_id && currentUser.branch_id && n.branch_id !== currentUser.branch_id) return false;
      return n.target_role === 'branch_manager' || !n.user_id;
    }

    // Staff sees notifications assigned to them or their branch staff role
    if (currentUser.role === 'staff') {
      if (n.user_id === currentUser.id) return true;
      if (n.branch_id && currentUser.branch_id && n.branch_id === currentUser.branch_id && n.target_role === 'staff') {
        return true;
      }
      return false;
    }

    return false;
  });
  const unreadCount = userNotifs.filter(n => !n.is_read).length;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-[5px] text-sm font-medium transition-all duration-300 ${isActive ? 'bg-zinc-100 text-black font-bold' : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
    }`;

  const adminNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all duration-300 ${isActive ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:bg-zinc-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              to={isAdminRole ? '/admin' : '/'}
              className="flex items-center gap-2 text-left group transition-all"
            >
              <img src="/src/assets/logo.png" alt="Aura Spa Logo" className="w-6 h-8" />
              <div>
                <span className="font-bold text-sm sm:text-base text-black tracking-tight">
                  Aura Spa
                </span>
              </div>
            </Link>

            {/* Client Navigation Links (Desktop) */}
            {!isAdminRole && (
              <nav className="hidden md:flex items-center gap-1 ml-2 lg:ml-4">
                <NavLink to="/" end className={navLinkClass}>
                  Trang chủ
                </NavLink>
                <NavLink to="/services" className={navLinkClass}>
                  Dịch vụ
                </NavLink>
                <NavLink to="/my-bookings" className={navLinkClass}>
                  Lịch hẹn của tôi
                </NavLink>
              </nav>
            )}

            {/* Admin Quick View Selector (Desktop) */}
            {isAdminRole && (
              <nav className="hidden lg:flex items-center gap-1 ml-2 border-l border-zinc-200 pl-4">
                <NavLink to="/admin" end className={adminNavLinkClass}>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </NavLink>
                <NavLink to="/admin/bookings" className={adminNavLinkClass}>
                  <Calendar className="w-3.5 h-3.5" />
                  Lịch hẹn
                </NavLink>

                {(currentUser.role === 'super_admin' || currentUser.role === 'branch_manager') && (
                  <>
                    <NavLink to="/admin/services" className={adminNavLinkClass}>
                      <Scissors className="w-3.5 h-3.5" />
                      Dịch vụ
                    </NavLink>
                    <NavLink to="/admin/staff" className={adminNavLinkClass}>
                      <Users className="w-3.5 h-3.5" />
                      Nhân viên
                    </NavLink>
                    <NavLink to="/admin/branches" className={adminNavLinkClass}>
                      <Store className="w-3.5 h-3.5" />
                      Chi nhánh
                    </NavLink>
                    <NavLink to="/admin/customers" className={adminNavLinkClass}>
                      <UserIcon className="w-3.5 h-3.5" />
                      Khách hàng
                    </NavLink>
                    <NavLink to="/admin/reports" className={adminNavLinkClass}>
                      <BarChart3 className="w-3.5 h-3.5" />
                      Báo cáo
                    </NavLink>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-3">

            {/* Primary CTA button for clients */}
            {!isAdminRole && (
              <Link
                to="/booking"
                className="bg-zinc-800 hover:bg-zinc-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-[5px] text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-all duration-400 active:scale-[0.98]"
              >
                <span className="hidden xs:inline">Đặt lịch ngay</span>
                <span className="xs:hidden">Đặt lịch</span>
              </Link>
            )}

            {/* Notification Bell */}
            {isAuthenticated && currentUser.role !== 'guest' && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="p-1.5 sm:p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-[5px] transition-colors relative"
                  aria-label="Thông báo"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Popup */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white border border-zinc-200 rounded-[5px] shadow-lg z-50 overflow-hidden text-sm">
                    <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-black">
                        <span>Thông báo ({userNotifs.length})</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} chưa đọc
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={clearAllNotifications}
                          className="text-zinc-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                          title="Xóa tất cả"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                      {userNotifs.length === 0 ? (
                        <div className="p-6 text-center text-zinc-400 text-xs italic">
                          Không có thông báo nào.
                        </div>
                      ) : (
                        userNotifs.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 transition-colors cursor-pointer hover:bg-zinc-50 ${!n.is_read ? 'bg-amber-50/40 border-l-2 border-amber-500' : ''
                              }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-xs text-black flex items-center gap-1.5">
                                {!n.is_read && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                                {n.title}
                              </h4>
                              <span className="text-[10px] text-[#8e8ea0] whitespace-nowrap">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar & Menu OR Login Button */}
            {isAuthenticated && currentUser.role !== 'guest' ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-1.5 p-1 border border-zinc-200 hover:border-zinc-400 rounded-[5px] transition-all bg-zinc-50 hover:bg-white"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-medium text-black hidden sm:inline max-w-[100px] md:max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-[5px] shadow-lg z-50 py-1.5 text-xs">
                    <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50">
                      <p className="font-semibold text-black truncate">{currentUser.name}</p>
                      <p className="text-[#8e8ea0] truncate">{currentUser.email || currentUser.phone}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded-[3px]">
                        {currentUser.role}
                      </span>
                    </div>

                    {!isAdminRole && (
                      <>
                        <Link
                          to="/my-bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          Lịch hẹn của tôi
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
                        >
                          <UserIcon className="w-4 h-4 text-zinc-500" />
                          Hồ sơ cá nhân
                        </Link>
                      </>
                    )}

                    {isAdminRole && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                          Trang quản trị (Dashboard)
                        </Link>
                        {currentUser.role === 'super_admin' && (
                          <Link
                            to="/admin/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
                          >
                            <SettingsIcon className="w-4 h-4 text-zinc-500" />
                            Cấu hình Hệ thống
                          </Link>
                        )}
                      </>
                    )}

                    <div className="border-t border-zinc-100 my-1"></div>

                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-1.5 text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      Đổi Tài Khoản / Vai trò
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-[5px] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Đăng Nhập</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-[5px] transition-colors md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Responsive Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 space-y-2 md:hidden animate-in slide-in-from-top-2 duration-200 shadow-md">
          {!isAdminRole ? (
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold ${location.pathname === '/' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                Trang chủ
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold ${location.pathname === '/services' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                Dịch vụ
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold ${location.pathname === '/my-bookings' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                Lịch hẹn của tôi
              </Link>
              <Link
                to="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold bg-[#8e8ea0] text-white flex items-center gap-2"
              >
                Đặt lịch mới
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#8e8ea0] uppercase tracking-wider px-3 pt-1">
                Danh mục quản trị
              </div>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Tổng Quan
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/bookings' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                <Calendar className="w-4 h-4" />
                Quản lý Lịch hẹn (Calendar)
              </Link>
              {(currentUser.role === 'super_admin' || currentUser.role === 'branch_manager') && (
                <>
                  <Link
                    to="/admin/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/services' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                  >
                    <Scissors className="w-4 h-4" />
                    Quản lý Dịch vụ
                  </Link>
                  <Link
                    to="/admin/staff"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/staff' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                  >
                    <Users className="w-4 h-4" />
                    Quản lý Nhân viên
                  </Link>
                  <Link
                    to="/admin/branches"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/branches' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                  >
                    <Store className="w-4 h-4" />
                    Quản lý Chi nhánh
                  </Link>
                  <Link
                    to="/admin/customers"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/customers' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    Quản lý Khách hàng
                  </Link>
                  <Link
                    to="/admin/reports"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/reports' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Báo cáo & Thống kê
                  </Link>
                </>
              )}
              {currentUser.role === 'super_admin' && (
                <Link
                  to="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-left block px-3 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-2 ${location.pathname === '/admin/settings' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Cấu hình Hệ thống
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
