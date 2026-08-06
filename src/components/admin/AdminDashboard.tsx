import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { 
  Calendar, DollarSign, Users, AlertCircle, Clock, 
  TrendingUp, CheckCircle, XCircle, ArrowUpRight,
  Store, Scissors, User as UserIcon, BarChart3, Settings
} from 'lucide-react';
import { format } from 'date-fns';

export const AdminDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const { bookings, services, branches, users, updateBookingStatus, currentUser } = useApp();
  const navigate = useNavigate();

  const handleGoToBookings = () => {
    if (onNavigate) {
      onNavigate('admin-bookings');
    } else {
      navigate('/admin/bookings');
    }
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Filter bookings for current branch manager if applicable
  const roleBookings = bookings.filter(b => {
    if (currentUser.role === 'branch_manager' && currentUser.branch_id) {
      return b.branch_id === currentUser.branch_id;
    }
    if (currentUser.role === 'staff') {
      return b.staff_id === currentUser.id;
    }
    return true; // Super Admin sees all
  });

  const todayBookings = roleBookings.filter(b => b.date === todayStr);
  const pendingBookings = roleBookings.filter(b => b.status === 'pending');
  const completedBookings = roleBookings.filter(b => b.status === 'completed');
  
  const totalRevenue = roleBookings
    .filter(b => ['confirmed', 'completed', 'paid'].includes(b.status) || b.payment_status === 'paid')
    .reduce((acc, b) => acc + b.total_amount, 0);

  const todayRevenue = todayBookings
    .filter(b => ['confirmed', 'completed'].includes(b.status))
    .reduce((acc, b) => acc + b.total_amount, 0);

  // Compute staff occupancy rate estimate
  const activeStaffCount = users.filter(u => u.role === 'staff').length;
  const occupancyRate = Math.min(100, Math.round((todayBookings.length / (activeStaffCount * 6 || 1)) * 100));

  return (
    <div className="space-y-8">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Dashboard Tổng Quan
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Báo cáo chỉ số kinh doanh, tỷ lệ lấp đầy & lịch hẹn cần duyệt hôm nay ({todayStr}).
          </p>
        </div>

        <button
          onClick={handleGoToBookings}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold self-start sm:self-auto transition-colors duration-400 flex items-center gap-1.5 shadow-xs"
        >
          <Calendar className="w-4 h-4" />
          <span>Mở Lịch Xem Lịch Hẹn</span>
        </button>
      </div>

      {/* Admin Quick Modules Bar */}
      <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-4 shadow-2xs">
        <h3 className="text-xs font-bold text-[#8e8ea0] uppercase tracking-wider mb-3">Danh Mục Quản Lý</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-semibold">
          <Link
            to="/admin/bookings"
            className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-[5px] flex items-center gap-2 text-zinc-800 transition-all"
          >
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Lịch Hẹn</span>
          </Link>
          <Link
            to="/admin/services"
            className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-[5px] flex items-center gap-2 text-zinc-800 transition-all"
          >
            <Scissors className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Dịch Vụ</span>
          </Link>
          <Link
            to="/admin/staff"
            className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-[5px] flex items-center gap-2 text-zinc-800 transition-all"
          >
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Nhân Viên</span>
          </Link>
          <Link
            to="/admin/branches"
            className="p-2.5 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 rounded-[5px] flex items-center gap-2 text-amber-900 transition-all"
          >
            <Store className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Chi Nhánh</span>
          </Link>
          <Link
            to="/admin/customers"
            className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-[5px] flex items-center gap-2 text-zinc-800 transition-all"
          >
            <UserIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Khách Hàng</span>
          </Link>
          <Link
            to="/admin/reports"
            className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-[5px] flex items-center gap-2 text-zinc-800 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Báo Cáo</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <div className="flex items-center justify-between text-[#8e8ea0]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[11px]">Lịch Hẹn Hôm Nay</span>
            <Calendar className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-extrabold text-black">{todayBookings.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{todayBookings.filter(b => b.status === 'confirmed').length} đơn đã xác nhận</span>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <div className="flex items-center justify-between text-[#8e8ea0]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[11px]">Chờ Xác Nhận</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-black">{pendingBookings.length}</div>
          <div className="text-[11px] text-amber-600 font-medium">
            Cần thao tác duyệt ngay
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <div className="flex items-center justify-between text-[#8e8ea0]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[11px]">Doanh Thu Ước Tính</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-black">
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-zinc-500">
            Hôm nay: <strong className="text-black">{todayRevenue.toLocaleString('vi-VN')} đ</strong>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <div className="flex items-center justify-between text-[#8e8ea0]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[11px]">Tỷ Lệ Lấp Đầy</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-black">{occupancyRate}%</div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-blue-600 h-full" style={{ width: `${occupancyRate}%` }}></div>
          </div>
        </div>

      </div>

      {/* Pending Confirmations Section */}
      <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="font-bold text-base text-black flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Lịch hẹn mới chờ xác nhận ({pendingBookings.length})
          </h3>
          <button 
            onClick={() => onNavigate('admin-bookings')}
            className="text-xs text-zinc-600 hover:text-black font-semibold flex items-center gap-1"
          >
            Xem tất cả &rarr;
          </button>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
            Không có lịch hẹn nào đang chờ xác nhận.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {pendingBookings.map(bk => (
              <div key={bk.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black">{bk.booking_code}</span>
                    <Badge status={bk.status} />
                    <span className="text-zinc-500">({bk.date} lúc {bk.start_time})</span>
                  </div>
                  <p className="text-zinc-700 font-medium">
                    Khách: <strong>{bk.customer_name}</strong> ({bk.customer_phone}) • {bk.services[0]?.service_name}
                  </p>
                  <p className="text-[#8e8ea0]">
                    Chi nhánh: {bk.branch_name} | Chuyên viên: {bk.staff_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => updateBookingStatus(bk.id, 'confirmed')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Xác nhận
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt('Nhập lý do từ chối:');
                      if (reason) updateBookingStatus(bk.id, 'cancelled', reason);
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue Breakdown by Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Service Sales */}
        <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 space-y-4">
          <h3 className="font-bold text-base text-black">Top dịch vụ được đặt nhiều nhất</h3>
          <div className="space-y-3 text-xs">
            {services.slice(0, 4).map(srv => {
              const count = roleBookings.filter(b => b.services.some(s => s.service_id === srv.id)).length;
              return (
                <div key={srv.id} className="space-y-1">
                  <div className="flex justify-between font-semibold text-black">
                    <span>{srv.name}</span>
                    <span>{count} lượt</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-zinc-800 h-full" 
                      style={{ width: `${Math.min(100, (count / (roleBookings.length || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branch Occupancy */}
        <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 space-y-4">
          <h3 className="font-bold text-base text-black">Lịch hẹn theo chi nhánh</h3>
          <div className="space-y-3 text-xs">
            {branches.map(br => {
              const count = bookings.filter(b => b.branch_id === br.id).length;
              return (
                <div key={br.id} className="p-3 bg-zinc-50 border border-zinc-200/70 rounded-[5px] flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-black">{br.name}</h4>
                    <span className="text-[11px] text-[#8e8ea0]">{br.address}</span>
                  </div>
                  <span className="font-extrabold text-sm text-black bg-white px-3 py-1 rounded-[5px] border border-zinc-200">
                    {count} đơn
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
