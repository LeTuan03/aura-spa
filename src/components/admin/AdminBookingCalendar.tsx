import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';
import { Badge } from '../common/Badge';
import {
  Calendar, Plus, Filter, Search, Clock, MapPin,
  UserCheck, Check, X, AlertCircle, Trash2, Edit
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const AdminBookingCalendar: React.FC = () => {
  const {
    bookings, branches, services, users, updateBookingStatus,
    createBooking, currentUser
  } = useApp();

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [filterBranchId, setFilterBranchId] = useState<string>('all');
  const [filterStaffId, setFilterStaffId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Manual booking modal state
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualCustomerName, setManualCustomerName] = useState<string>('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState<string>('');
  const [manualServiceId, setManualServiceId] = useState<string>(services[0]?.id || '');
  const [manualBranchId, setManualBranchId] = useState<string>(branches[0]?.id || '');
  const [manualStaffId, setManualStaffId] = useState<string>('any');
  const [manualDate, setManualDate] = useState<string>(todayStr);
  const [manualTime, setManualTime] = useState<string>('10:00');
  const [manualNotes, setManualNotes] = useState<string>('');

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (filterBranchId !== 'all' && b.branch_id !== filterBranchId) return false;
    if (filterStaffId !== 'all' && b.staff_id !== filterStaffId) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = b.customer_name.toLowerCase().includes(q);
      const matchPhone = b.customer_phone.includes(q);
      const matchCode = b.booking_code.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCode) return false;
    }
    return true;
  });

  // Week days interval for week view
  const currentWeekStart = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  // Time slots for Day grid (08:00 to 20:00)
  const timeHours = Array.from({ length: 13 }, (_, i) => `${String(8 + i).padStart(2, '0')}:00`);

  // Handle Manual Booking Create
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName || !manualCustomerPhone) {
      alert('Vui lòng nhập tên và SĐT khách hàng');
      return;
    }

    const srv = services.find(s => s.id === manualServiceId) || services[0];
    const br = branches.find(b => b.id === manualBranchId) || branches[0];
    let stName = 'Bất kỳ chuyên viên';
    if (manualStaffId !== 'any') {
      const st = users.find(u => u.id === manualStaffId);
      if (st) stName = st.name;
    }

    createBooking({
      customer_name: manualCustomerName,
      customer_phone: manualCustomerPhone,
      customer_email: '',
      staff_id: manualStaffId,
      staff_name: stName,
      branch_id: manualBranchId,
      branch_name: br.name,
      services: [{
        service_id: srv.id,
        service_name: srv.name,
        price: srv.price,
        duration_minutes: srv.duration_minutes
      }],
      date: manualDate,
      start_time: manualTime,
      total_amount: srv.price,
      status: 'confirmed',
      notes: `Lịch thủ công: ${manualNotes}`,
      payment_status: 'unpaid'
    });

    alert('Tạo lịch hẹn thủ công thành công!');
    setShowManualModal(false);
    // Reset
    setManualCustomerName('');
    setManualCustomerPhone('');
    setManualNotes('');
  };

  return (
    <div className="space-y-6">

      {/* Title & Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Quản Lý Lịch Hẹn (Calendar View)
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Theo dõi khung giờ làm việc của chuyên viên, tạo lịch thủ công và chuyển trạng thái đơn.
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-400 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Lịch Thủ Công</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">

          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm tên khách, SĐT, mã lịch..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filterBranchId}
              onChange={e => setFilterBranchId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2 text-xs focus:outline-none focus:border-zinc-900"
            >
              <option value="all">Tất cả chi nhánh</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterStaffId}
              onChange={e => setFilterStaffId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2 text-xs focus:outline-none focus:border-zinc-900"
            >
              <option value="all">Tất cả chuyên viên</option>
              {users.filter(u => u.role === 'staff').map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="md:col-span-2 flex items-center bg-zinc-100 p-1 rounded-[5px]">
            <button
              onClick={() => setViewMode('day')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-[5px] transition-all ${viewMode === 'day' ? 'bg-white text-black shadow-xs' : 'text-zinc-600'
                }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-[5px] transition-all ${viewMode === 'week' ? 'bg-white text-black shadow-xs' : 'text-zinc-600'
                }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-[5px] transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-xs' : 'text-zinc-600'
                }`}
            >
              Danh sách
            </button>
          </div>

        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-100 text-xs">
          <span className="font-semibold text-black">Chọn ngày xem:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-1 text-xs focus:outline-none"
          />
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="text-xs font-semibold text-[#8e8ea0] hover:text-black"
          >
            Hôm nay
          </button>
        </div>
      </div>

      {/* DAY CALENDAR GRID VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-3 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-black flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 pb-3">
            <span>Lịch hẹn ngày {selectedDate}</span>
            <span className="text-xs text-[#8e8ea0] font-normal">Tự động đổi màu ô theo khung giờ</span>
          </h3>

          <div className="divide-y divide-zinc-100">
            {timeHours.map(hour => {
              const hourBookings = filteredBookings.filter(b => b.date === selectedDate && b.start_time.startsWith(hour.slice(0, 2)));

              return (
                <div key={hour} className="py-2.5 flex flex-col xs:flex-row items-start gap-2 xs:gap-4">
                  <span className="w-16 text-xs font-bold text-zinc-500 pt-1 shrink-0">{hour}</span>

                  <div className="w-full xs:flex-1 min-h-[44px] bg-zinc-50/60 border border-zinc-200/60 rounded-[5px] p-2 flex flex-wrap items-center gap-2">
                    {hourBookings.length === 0 ? (
                      <span className="text-[11px] text-zinc-400 italic">Trống slot</span>
                    ) : (
                      hourBookings.map(bk => (
                        <div
                          key={bk.id}
                          className="bg-white border border-zinc-300 hover:border-zinc-900 rounded-[5px] p-2.5 shadow-2xs transition-all duration-400 text-xs space-y-1.5 w-full sm:w-auto min-w-0 sm:min-w-[240px] max-w-full"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-black truncate">{bk.booking_code}</span>
                            <div className="shrink-0">
                              <Badge status={bk.status} />
                            </div>
                          </div>

                          <p className="font-semibold text-zinc-800 text-[11px] break-words">
                            {bk.customer_name} ({bk.customer_phone})
                          </p>

                          <p className="text-[10px] text-[#8e8ea0] truncate">
                            {bk.services[0]?.service_name} • {bk.staff_name}
                          </p>

                          {/* Quick Status Action Controls */}
                          <div className="pt-1.5 flex flex-wrap items-center gap-1 border-t border-zinc-100">
                            <button
                              onClick={() => updateBookingStatus(bk.id, 'confirmed')}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold whitespace-nowrap"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => updateBookingStatus(bk.id, 'completed')}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold whitespace-nowrap"
                            >
                              Hoàn thành
                            </button>
                            <button
                              onClick={() => updateBookingStatus(bk.id, 'no_show')}
                              className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold whitespace-nowrap"
                            >
                              No-show
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Lý do hủy:');
                                if (reason) updateBookingStatus(bk.id, 'cancelled', reason);
                              }}
                              className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold whitespace-nowrap"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-4 md:p-6 shadow-xs overflow-x-auto">
          <div className="min-w-[1200px] md:min-w-[700px]">
            <div className="grid grid-cols-7 gap-2 border-b border-zinc-200 pb-3 mb-4 text-center">
              {weekDays.map(d => {
                const dateStr = format(d, 'yyyy-MM-dd');
                const isToday = dateStr === todayStr;
                return (
                  <div key={dateStr} className={`p-2 rounded-[5px] min-w-[160px] md:min-w-[150px] ${isToday ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-50 text-zinc-800'}`}>
                    <span className="block text-[11px] uppercase">{format(d, 'EEE')}</span>
                    <span className="block text-sm font-bold">{format(d, 'dd/MM')}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(d => {
                const dateStr = format(d, 'yyyy-MM-dd');
                const dayBks = filteredBookings.filter(b => b.date === dateStr);
                return (
                  <div key={dateStr} className="min-h-[180px] bg-zinc-50 border border-zinc-200 rounded-[5px] p-2 space-y-2 min-w-[160px] md:min-w-[150px]">
                    {dayBks.length === 0 ? (
                      <span className="text-[11px] text-zinc-400 block text-center pt-4">Không có đơn</span>
                    ) : (
                      dayBks.map(bk => (
                        <div key={bk.id} className="p-2 bg-white border border-zinc-200 rounded-[5px] text-xs space-y-1 shadow-2xs">
                          <div className="font-bold text-black flex justify-between">
                            <span>{bk.start_time}</span>
                            <Badge status={bk.status} className="text-[9px] px-1 py-0" />
                          </div>
                          <p className="font-semibold text-zinc-800 truncate">{bk.customer_name}</p>
                          <p className="text-[11px] text-[#8e8ea0] truncate">{bk.services[0]?.service_name}</p>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-black border-b border-zinc-100 pb-3">
            Danh sách lịch hẹn ({filteredBookings.length})
          </h3>

          <div className="divide-y divide-zinc-100">
            {filteredBookings.map(bk => (
              <div key={bk.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{bk.booking_code}</span>
                    <Badge status={bk.status} />
                    <Badge status={bk.payment_status} />
                  </div>
                  <p className="text-zinc-800 font-semibold">
                    {bk.customer_name} ({bk.customer_phone}) • {bk.services[0]?.service_name}
                  </p>
                  <p className="text-[#8e8ea0]">
                    Ngày: {bk.date} ({bk.start_time} - {bk.end_time}) | {bk.branch_name} | Chuyên viên: {bk.staff_name}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <select
                    value={bk.status}
                    onChange={e => updateBookingStatus(bk.id, e.target.value as BookingStatus)}
                    className="bg-zinc-50 border border-zinc-200 rounded-[5px] px-2 py-1 text-xs font-medium focus:outline-none"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="no_show">No-show</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANUAL BOOKING MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-[5px] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-base text-black">Tạo lịch hẹn thủ công (Khách gọi điện)</h3>
              <button onClick={() => setShowManualModal(false)}><X className="w-4 h-4 text-zinc-400" /></button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1">Tên khách hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn B"
                  value={manualCustomerName}
                  onChange={e => setManualCustomerName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0909 111 222"
                  value={manualCustomerPhone}
                  onChange={e => setManualCustomerPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Chọn dịch vụ *</label>
                <select
                  value={manualServiceId}
                  onChange={e => setManualServiceId(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.price.toLocaleString('vi-VN')}đ)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black mb-1">Chi nhánh *</label>
                  <select
                    value={manualBranchId}
                    onChange={e => setManualBranchId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-black mb-1">Chuyên viên</label>
                  <select
                    value={manualStaffId}
                    onChange={e => setManualStaffId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  >
                    <option value="any">Bất kỳ ai</option>
                    {users.filter(u => u.role === 'staff').map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black mb-1">Ngày hẹn *</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black mb-1">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    required
                    value={manualTime}
                    onChange={e => setManualTime(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Ghi chú nội bộ</label>
                <input
                  type="text"
                  placeholder="Khách quen gọi điện đặt slot"
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2 rounded-[5px] font-semibold transition-colors duration-400"
                >
                  Lưu & Tạo Đơn
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
