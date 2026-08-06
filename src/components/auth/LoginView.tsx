import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck, UserCheck, Lock, Mail, Phone, User as UserIcon,
  Sparkles, ArrowRight, CheckCircle2, Store, Users, Eye, EyeOff
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, quickLogin, register, users } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Get returnUrl from location state if available
  const from = (location.state as any)?.from?.pathname || null;

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [loginTerm, setLoginTerm] = useState('');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginTerm.trim()) {
      setErrorMessage('Vui lòng nhập Email hoặc Số điện thoại.');
      return;
    }

    const res = login(loginTerm);
    if (res.success && res.user) {
      redirectAfterLogin(res.user.role);
    } else {
      setErrorMessage(res.message || 'Đăng nhập không thành công.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    quickLogin(userId);
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      redirectAfterLogin(targetUser.role);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regPhone.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên và Số điện thoại.');
      return;
    }

    const res = register(regName, regPhone, regEmail);
    if (res.success && res.user) {
      redirectAfterLogin(res.user.role);
    } else {
      setErrorMessage(res.message || 'Đăng ký thất bại.');
    }
  };

  const redirectAfterLogin = (role: string) => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }

    if (['super_admin', 'branch_manager', 'staff'].includes(role)) {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const demoAccounts = [
    {
      id: 'usr-admin',
      role: 'super_admin',
      title: 'Super Admin',
      desc: 'Quản trị viên toàn hệ thống',
      email: 'admin@booking.vn',
      icon: ShieldCheck,
    },
    {
      id: 'usr-mgr-hcm',
      role: 'branch_manager',
      title: 'Quản Lý Chi Nhánh',
      desc: 'Chi nhánh Q1, HCM',
      email: 'mgr.hcm@booking.vn',
      icon: Store,
    },
    {
      id: 'usr-staff-1',
      role: 'staff',
      title: 'Nhân Viên / KTV',
      desc: 'Lê Hoàng Anh · KTV Massage',
      email: 'hoanganh@booking.vn',
      icon: Users,
    },
    {
      id: 'usr-client-1',
      role: 'client',
      title: 'Khách Hàng VIP',
      desc: 'Vũ Thị Hương',
      email: 'huong.vu@gmail.com',
      icon: UserCheck,
    },
  ];

  const inputClass =
    'w-full pl-9 pr-9 py-2.5 bg-white/[0.03] border border-white/10 text-[#f5f0e8] rounded-[6px] text-xs font-medium placeholder-white/30 focus:outline-none focus:border-[#d4af6a]/70 focus:ring-1 focus:ring-[#d4af6a]/30 transition-all';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0b0d]">
      <div className="grid md:grid-cols-2 lg:grid-cols-[1.1fr_1fr] min-h-[calc(100vh-4rem)]">

        {/* Left — atmosphere / brand panel (desktop only) */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden px-10 lg:px-16 py-12 border-r border-[#d4af6a]/10">
          <img
            src="/src/assets/images/spa_reception_lobby_1785988995306.jpg"
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/75 to-[#0b0b0d]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b0b0d]/70" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#d4af6a]/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border border-[#d4af6a]/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#d4af6a]" />
            </div>
            <span className="font-serif text-lg tracking-[0.25em] text-[#f5f0e8] uppercase">Aura</span>
          </div>

          <div className="relative z-10 max-w-sm">
            <p className="font-serif italic text-2xl lg:text-[1.75rem] text-[#f5f0e8] leading-snug">
              "Một khoảng lặng riêng, giữa nhịp sống vội vã."
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#d4af6a]/60" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4af6a]/80">Aura Spa &amp; Wellness</p>
            </div>
          </div> */}
        </div>

        {/* Right — form panel */}
        <div className="flex items-center justify-center px-5 sm:px-10 py-10 sm:py-14">
          <div className="w-full max-w-md">

            {/* Mobile brand mark */}
            <div className="flex md:hidden items-center justify-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-full border border-[#d4af6a]/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#d4af6a]" />
              </div>
              <span className="font-serif text-base tracking-[0.25em] text-[#f5f0e8] uppercase">Aura</span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-white/10 mb-7">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex-1 text-center ${
                  mode === 'login'
                    ? 'border-[#d4af6a] text-[#e8c98a]'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(''); }}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex-1 text-center ${
                  mode === 'register'
                    ? 'border-[#d4af6a] text-[#e8c98a]'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div role="alert" className="mb-5 p-3 bg-rose-950/50 border border-rose-800/60 rounded-[5px] text-xs font-medium text-rose-300 flex items-start gap-2">
                <span className="font-bold shrink-0">!</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="loginTerm" className="block text-xs font-bold text-white/70 mb-1.5">
                    Email hoặc Số điện thoại <span className="text-[#d4af6a]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="loginTerm"
                      type="text"
                      value={loginTerm}
                      onChange={(e) => setLoginTerm(e.target.value)}
                      placeholder="admin@booking.vn hoặc 0977888999"
                      className={inputClass}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="loginPassword" className="block text-xs font-bold text-white/70 mb-1.5">
                    Mật khẩu <span className="text-[#d4af6a]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="loginPassword"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className={inputClass}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(v => !v)}
                      aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#e0bb7c] to-[#d4af6a] hover:from-[#e8c98a] hover:to-[#ddb877] text-[#1a1408] font-extrabold text-xs rounded-[6px] transition-all shadow-lg shadow-[#d4af6a]/10 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>Xác Nhận Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="regName" className="block text-xs font-bold text-white/70 mb-1.5">
                    Họ và tên <span className="text-[#d4af6a]">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="regName"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className={inputClass}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="regPhone" className="block text-xs font-bold text-white/70 mb-1.5">
                    Số điện thoại <span className="text-[#d4af6a]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="regPhone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className={inputClass}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="regEmail" className="block text-xs font-bold text-white/70 mb-1.5">
                    Email <span className="text-white/30 font-normal">(Không bắt buộc)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="regEmail"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nguyenvana@gmail.com"
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="regPassword" className="block text-xs font-bold text-white/70 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="regPassword"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tạo mật khẩu..."
                      className={inputClass}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(v => !v)}
                      aria-label={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs rounded-[6px] transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>Tạo Tài Khoản &amp; Đăng Nhập</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick access — demo accounts */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Truy cập nhanh (Demo)</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {demoAccounts.map(({ id, title, desc, email, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleQuickLogin(id)}
                    className="group flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/10 hover:border-[#d4af6a]/50 hover:bg-white/[0.04] rounded-[6px] text-left transition-all"
                  >
                    <div className="w-8 h-8 shrink-0 rounded-full bg-white/5 border border-white/10 group-hover:border-[#d4af6a]/50 flex items-center justify-center transition-colors">
                      <Icon className="w-3.5 h-3.5 text-white/50 group-hover:text-[#d4af6a] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/80 group-hover:text-[#e8c98a] transition-colors truncate">{title}</p>
                      <p className="text-[11px] text-white/35 truncate">{desc}</p>
                      <p className="text-[10px] text-white/25 truncate">{email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};