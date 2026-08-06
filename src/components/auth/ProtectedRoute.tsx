import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useApp();
  const location = useLocation();

  // If not authenticated or guest
  if (!isAuthenticated || currentUser.role === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-zinc-50">
        <div className="bg-white border border-rose-200 rounded-[8px] p-6 max-w-md w-full shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black">Truy Cập Bị Từ Chối (403)</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Tài khoản của bạn (<strong className="text-black">{currentUser.name}</strong> - Vai trò: <span className="uppercase text-rose-600 font-bold">{currentUser.role}</span>) không có quyền truy cập vào trang này.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/"
              className="w-full py-2 bg-zinc-900 text-white rounded-[5px] text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay về Trang chủ</span>
            </Link>
            <Link
              to="/login"
              className="w-full py-2 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-[5px] text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Đổi Tài Khoản Đăng Nhập</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
