import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, TrendingUp, Calendar, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, services, branches, users } = useApp();

  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('30days');

  // Compute key reporting metrics
  const totalBookingsCount = bookings.length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
  const noshowCount = bookings.filter(b => b.status === 'no_show').length;

  const cancelRate = totalBookingsCount > 0 ? Math.round((cancelledCount / totalBookingsCount) * 100) : 0;
  const noshowRate = totalBookingsCount > 0 ? Math.round((noshowCount / totalBookingsCount) * 100) : 0;

  const totalRevenue = bookings
    .filter(b => ['completed', 'confirmed'].includes(b.status) || b.payment_status === 'paid')
    .reduce((acc, b) => acc + b.total_amount, 0);

  // Simulation Export CSV
  const handleExportCSV = () => {
    const headers = 'Mã Đơn,Khách Hàng,Số Điện Thoại,Dịch Vụ,Chi Nhánh,Chuyên Viên,Ngày,Giờ,Tổng Tiền,Trạng Thái\n';
    const rows = bookings.map(b => 
      `"${b.booking_code}","${b.customer_name}","${b.customer_phone}","${b.services[0]?.service_name}","${b.branch_name}","${b.staff_name}","${b.date}","${b.start_time}",${b.total_amount},"${b.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bao-cao-doanh-thu-booking-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Báo Cáo & Thống Kê
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Phân tích chi tiết doanh thu, hiệu suất làm việc của nhân viên & tỷ lệ hủy lịch.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Xuất File CSV (Excel)</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <span className="text-xs font-semibold text-[#8e8ea0] uppercase tracking-wider text-[11px]">Tổng Doanh Thu</span>
          <div className="text-2xl font-extrabold text-black">{totalRevenue.toLocaleString('vi-VN')} đ</div>
          <span className="text-[11px] text-emerald-600 font-medium">Từ tất cả chi nhánh</span>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <span className="text-xs font-semibold text-[#8e8ea0] uppercase tracking-wider text-[11px]">Tổng Số Lịch Hẹn</span>
          <div className="text-2xl font-extrabold text-black">{totalBookingsCount} lượt</div>
          <span className="text-[11px] text-blue-600 font-medium">{completedCount} đã hoàn thành</span>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <span className="text-xs font-semibold text-[#8e8ea0] uppercase tracking-wider text-[11px]">Tỷ Lệ Hủy Lịch</span>
          <div className="text-2xl font-extrabold text-rose-600">{cancelRate}%</div>
          <span className="text-[11px] text-zinc-500">{cancelledCount} đơn đã hủy</span>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-5 rounded-[5px] space-y-2">
          <span className="text-xs font-semibold text-[#8e8ea0] uppercase tracking-wider text-[11px]">Tỷ Lệ No-Show</span>
          <div className="text-2xl font-extrabold text-purple-600">{noshowRate}%</div>
          <span className="text-[11px] text-zinc-500">{noshowCount} lượt vắng mặt</span>
        </div>
      </div>

      {/* Staff Performance Breakdown */}
      <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 space-y-4">
        <h3 className="font-bold text-base text-black flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-zinc-700" />
          Hiệu suất công việc từng chuyên viên
        </h3>

        <div className="divide-y divide-zinc-100">
          {users.filter(u => u.role === 'staff').map(st => {
            const stBookings = bookings.filter(b => b.staff_id === st.id);
            const stRevenue = stBookings
              .filter(b => ['completed', 'confirmed'].includes(b.status))
              .reduce((acc, b) => acc + b.total_amount, 0);

            return (
              <div key={st.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={st.avatar} alt={st.name} className="w-9 h-9 rounded-full object-cover border border-zinc-200" />
                  <div>
                    <h4 className="font-bold text-black">{st.name}</h4>
                    <span className="text-[#8e8ea0]">{stBookings.length} lượt phục vụ</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[#8e8ea0] block text-[10px]">Doanh thu tạo ra:</span>
                  <span className="font-extrabold text-black text-sm">{stRevenue.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
