import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Store, User as UserIcon, HelpCircle, RotateCcw } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, resetDemoData, branches } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />, desc: 'Toàn quyền hệ thống' },
    { role: 'branch_manager', label: 'Quản Lý Q1', icon: <Store className="w-3.5 h-3.5 text-blue-600" />, desc: 'Quản lý chi nhánh HCM' },
    { role: 'staff', label: 'Nhân Viên', icon: <UserCheck className="w-3.5 h-3.5 text-emerald-600" />, desc: 'Lịch cá nhân & KTV' },
    { role: 'client', label: 'Khách Hàng', icon: <UserIcon className="w-3.5 h-3.5 text-amber-600" />, desc: 'Đã đăng nhập' },
    { role: 'guest', label: 'Khách Vãng Lai', icon: <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />, desc: 'Chưa có tài khoản' },
  ];

  return (
    <div className="bg-[#1e1e24] text-white py-1.5 px-3 border-b border-zinc-800 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        
        <div className="flex items-center gap-2 shrink-0 overflow-x-auto py-0.5 no-scrollbar">
          <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] whitespace-nowrap hidden sm:inline">
            Vai trò:
          </span>
          
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {roles.map(r => {
              const isActive = currentUser.role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role, r.role === 'branch_manager' ? branches[0]?.id : undefined)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-[5px] transition-all duration-300 font-medium whitespace-nowrap text-xs ${
                    isActive 
                      ? 'bg-white text-zinc-900 font-bold shadow-xs' 
                      : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                  title={r.desc}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-zinc-300 bg-zinc-800/60 px-2 py-0.5 rounded-[5px] border border-zinc-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px]">Tài khoản: <strong className="text-white">{currentUser.name}</strong></span>
          </div>
          <button
            onClick={() => {
              if (confirm('Khôi phục dữ liệu mẫu ban đầu?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 text-zinc-400 hover:text-rose-300 transition-colors py-0.5 px-2 rounded-[5px] hover:bg-zinc-800 whitespace-nowrap"
            title="Đặt lại toàn bộ dữ liệu mẫu"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px] font-medium">Reset Data</span>
          </button>
        </div>

      </div>
    </div>
  );
};
