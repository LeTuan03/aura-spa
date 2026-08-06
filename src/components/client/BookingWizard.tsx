import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Service, Branch, User, Booking } from '../../types';
import { 
  Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, 
  MapPin, UserCheck, Sparkles, CreditCard, FileText, CheckCircle, Download, Phone, Mail
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface BookingWizardProps {
  initialServiceId?: string;
  onNavigate?: (view: string) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ initialServiceId, onNavigate }) => {
  const { services, branches, users, staffServices, currentUser, getAvailableSlots, createBooking, settings } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      if (view === 'my-bookings') navigate('/my-bookings');
      else navigate('/' + view);
    }
  };

  // Get initial service ID from location state or props
  const effectiveInitialServiceId = (location.state as any)?.selectedServiceId || initialServiceId;

  // Step state (1 to 7)
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    effectiveInitialServiceId ? [effectiveInitialServiceId] : services.length > 0 ? [services[0].id] : []
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  
  // Contact details
  const [customerName, setCustomerName] = useState<string>(currentUser.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || '');
  const [notes, setNotes] = useState<string>('');
  const [paymentOption, setPaymentOption] = useState<'cash' | 'deposit'>('cash');

  // Completed booking result state
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Calculate totals
  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalAmount = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const depositAmount = Math.round(totalAmount * (settings.deposit_percentage / 100));

  // Available staff for selected branch & services
  const branchStaff = users.filter(u => u.role === 'staff' && (selectedBranchId ? u.branch_id === selectedBranchId : true));

  // Compute available slots
  const availableSlots = getAvailableSlots(selectedDate, selectedBranchId, selectedStaffId, totalDuration);

  // Toggle multi-service selection
  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter(sId => sId !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Date shortcuts for next 7 days
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      dayName: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : format(d, 'EEEE'),
      formattedDate: format(d, 'dd/MM')
    };
  });

  // Handle final submission
  const handleSubmitBooking = () => {
    if (!customerName || !customerPhone) {
      alert('Vui lòng nhập họ tên và số điện thoại liên hệ');
      return;
    }

    const branch = branches.find(b => b.id === selectedBranchId);
    let staffName = 'Bất kỳ chuyên viên';
    if (selectedStaffId !== 'any') {
      const st = users.find(u => u.id === selectedStaffId);
      if (st) staffName = st.name;
    }

    const bookingData = {
      customer_id: currentUser.role !== 'guest' ? currentUser.id : undefined,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      staff_id: selectedStaffId,
      staff_name: staffName,
      branch_id: selectedBranchId,
      branch_name: branch?.name || '',
      services: selectedServices.map(s => ({
        service_id: s.id,
        service_name: s.name,
        price: s.price,
        duration_minutes: s.duration_minutes
      })),
      date: selectedDate,
      start_time: selectedSlotTime,
      total_amount: totalAmount,
      status: 'pending' as const,
      notes,
      payment_status: paymentOption === 'deposit' ? ('deposited' as const) : ('unpaid' as const)
    };

    const result = createBooking(bookingData);
    setCompletedBooking(result);
    setStep(7);
  };

  // Simulation ICS download
  const handleDownloadICS = () => {
    if (!completedBooking) return;
    const content = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Lịch hẹn ${completedBooking.services[0].service_name} tại ${completedBooking.branch_name}\nDESCRIPTION:Mã lịch: ${completedBooking.booking_code}. Khách hàng: ${completedBooking.customer_name}\nDTSTART:${completedBooking.date.replace(/-/g, '')}T${completedBooking.start_time.replace(':', '')}00\nDTEND:${completedBooking.date.replace(/-/g, '')}T${completedBooking.end_time.replace(':', '')}00\nLOCATION:${completedBooking.branch_name}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lich-hen-${completedBooking.booking_code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 text-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Wizard Header Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-semibold text-black uppercase tracking-wider text-[11px]">
              {step === 7 ? 'Hoàn tất đặt lịch' : `Bước ${step} trên 6`}
            </span>
            <span className="font-medium text-[#8e8ea0]">
              {step === 1 && 'Chọn dịch vụ'}
              {step === 2 && 'Chọn chi nhánh'}
              {step === 3 && 'Chọn chuyên viên'}
              {step === 4 && 'Chọn ngày & giờ'}
              {step === 5 && 'Thông tin liên hệ'}
              {step === 6 && 'Xác nhận & Thanh toán'}
              {step === 7 && 'Phiếu xác nhận'}
            </span>
          </div>

          {step < 7 && (
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-zinc-900 h-full transition-all duration-400 ease-out"
                style={{ width: `${(step / 6) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* STEP 1: SELECT SERVICES */}
        {step === 1 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">Bước 1: Chọn dịch vụ sử dụng</h2>
              <p className="text-xs text-[#8e8ea0]">
                Bạn có thể tích chọn nhiều dịch vụ cùng lúc trong một lượt đặt lịch.
              </p>
            </div>

            <div className="space-y-3">
              {services.map(srv => {
                const isSelected = selectedServiceIds.includes(srv.id);
                return (
                  <div 
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`p-4 rounded-[5px] border cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 ${
                      isSelected 
                        ? 'border-zinc-900 bg-zinc-50/80 shadow-xs' 
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-[3px] border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-black">{srv.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#8e8ea0] mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {srv.duration_minutes} phút</span>
                          <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-[5px] text-[10px]">{srv.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-black">{srv.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Summary Footer */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8e8ea0]">Đã chọn {selectedServiceIds.length} dịch vụ:</span>
                <p className="text-sm font-bold text-black">
                  {totalAmount.toLocaleString('vi-VN')} đ <span className="text-xs font-normal text-zinc-500">({totalDuration} phút)</span>
                </p>
              </div>

              <button
                disabled={selectedServiceIds.length === 0}
                onClick={() => setStep(2)}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400 disabled:opacity-50"
              >
                <span>Tiếp tục (Chọn chi nhánh)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT BRANCH */}
        {step === 2 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">Bước 2: Chọn chi nhánh phù hợp</h2>
              <p className="text-xs text-[#8e8ea0]">
                Vui lòng chọn cơ sở gần nhất để thực hiện liệu trình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {branches.map(br => {
                const isSelected = selectedBranchId === br.id;
                return (
                  <div
                    key={br.id}
                    onClick={() => setSelectedBranchId(br.id)}
                    className={`p-4 rounded-[5px] border cursor-pointer transition-all duration-300 space-y-3 ${
                      isSelected 
                        ? 'border-zinc-900 bg-zinc-50/80 shadow-xs' 
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="h-32 rounded-[5px] overflow-hidden bg-zinc-100">
                      <img src={br.image} alt={br.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-black">{br.name}</h4>
                        {isSelected && <Check className="w-4 h-4 text-zinc-900" />}
                      </div>
                      <p className="text-[11px] text-zinc-600 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{br.address}</span>
                      </p>
                      <p className="text-[11px] text-[#8e8ea0] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{br.opening_hours}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> quay lại
              </button>

              <button
                onClick={() => setStep(3)}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
              >
                <span>Tiếp tục (Chọn chuyên viên)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT STAFF */}
        {step === 3 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">Bước 3: Chọn chuyên viên phụ trách</h2>
              <p className="text-xs text-[#8e8ea0]">
                Bạn có thể chọn đích danh nhân viên yêu thích hoặc chọn "Bất kỳ ai" để tìm slot trống nhanh nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Option 1: Any Staff */}
              <div
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-[5px] border cursor-pointer transition-all duration-300 flex items-center gap-3 ${
                  selectedStaffId === 'any' 
                    ? 'border-zinc-900 bg-zinc-50/80 shadow-xs' 
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                  ★
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-black">Ngẫu nhiên / Bất kỳ ai</h4>
                  <p className="text-[11px] text-[#8e8ea0]">Hệ thống chọn nhân viên trống slot</p>
                </div>
              </div>

              {/* Specific Staff List */}
              {branchStaff.map(st => {
                const isSelected = selectedStaffId === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStaffId(st.id)}
                    className={`p-4 rounded-[5px] border cursor-pointer transition-all duration-300 flex items-center gap-3 ${
                      isSelected 
                        ? 'border-zinc-900 bg-zinc-50/80 shadow-xs' 
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <img 
                      src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                      alt={st.name} 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-black truncate">{st.name}</h4>
                      <p className="text-[11px] text-[#8e8ea0]">Kỹ thuật viên lành nghề</p>
                    </div>
                  </div>
                );
              })}

            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>

              <button
                onClick={() => setStep(4)}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
              >
                <span>Tiếp tục (Chọn ngày & giờ)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DATE & TIME SLOT PICKER */}
        {step === 4 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">Bước 4: Chọn ngày & khung giờ</h2>
              <p className="text-xs text-[#8e8ea0]">
                Thời lượng liệu trình dự kiến: <strong className="text-black">{totalDuration} phút</strong>. Vui lòng chọn giờ bắt đầu.
              </p>
            </div>

            {/* Date Quick Selector */}
            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                1. Chọn ngày thực hiện:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {next7Days.map(d => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      onClick={() => {
                        setSelectedDate(d.dateStr);
                        setSelectedSlotTime(''); // reset slot when date changes
                      }}
                      className={`px-4 py-2.5 rounded-[5px] border text-center transition-all min-w-[100px] shrink-0 ${
                        isSelected 
                          ? 'bg-zinc-900 text-white border-zinc-900 font-bold shadow-xs' 
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-medium opacity-80">{d.dayName}</span>
                      <span className="block text-sm font-bold">{d.formattedDate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots Grid */}
            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                2. Chọn khung giờ khả dụng:
              </label>

              {availableSlots.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 border border-zinc-200 rounded-[5px] text-zinc-500 text-xs">
                  Không còn slot trống nào trong ngày này. Vui lòng chọn ngày khác.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {availableSlots.map((s, idx) => {
                    const isSelected = selectedSlotTime === s.time;
                    return (
                      <button
                        key={idx}
                        disabled={!s.available}
                        onClick={() => setSelectedSlotTime(s.time)}
                        className={`py-2 px-1 rounded-[5px] border text-xs font-semibold transition-all text-center ${
                          !s.available
                            ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                            : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50'
                        }`}
                        title={s.reason}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>

              <button
                disabled={!selectedSlotTime}
                onClick={() => setStep(5)}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400 disabled:opacity-50"
              >
                <span>Tiếp tục (Nhập thông tin)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONTACT DETAILS */}
        {step === 5 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">Bước 5: Thông tin khách hàng đặt lịch</h2>
              <p className="text-xs text-[#8e8ea0]">
                Nhập thông tin người sử dụng dịch vụ để hệ thống gửi SMS/Email xác nhận.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Họ và tên khách hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0901 234 567"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    Email nhận thông báo
                  </label>
                  <input
                    type="email"
                    placeholder="khachhang@gmail.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Ghi chú thêm / Yêu cầu đặc biệt
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Da mẫn cảm với tinh dầu hoa hái, cần phòng yên tĩnh..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] p-3 text-xs focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setStep(4)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>

              <button
                disabled={!customerName || !customerPhone}
                onClick={() => setStep(6)}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400 disabled:opacity-50"
              >
                <span>Tiếp tục (Xác nhận đơn)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: FINAL CONFIRMATION & PAYMENT */}
        {step === 6 && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">Bước 6: Kiểm tra & Xác nhận lịch hẹn</h2>
              <p className="text-xs text-[#8e8ea0]">
                Vui lòng kiểm tra kỹ thông tin đơn đặt lịch trước khi gửi.
              </p>
            </div>

            {/* Summary Ticket Box */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-[5px] p-5 space-y-4">
              <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-black">Tóm tắt dịch vụ đăng ký</h3>
                  <p className="text-xs text-[#8e8ea0]">{selectedServices.length} gói liệu trình</p>
                </div>
                <span className="font-extrabold text-base text-black">{totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="space-y-2 text-xs">
                {selectedServices.map(s => (
                  <div key={s.id} className="flex justify-between items-center text-zinc-700">
                    <span>• {s.name} ({s.duration_minutes} phút)</span>
                    <span className="font-medium text-black">{s.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8e8ea0] block">Ngày & Giờ hẹn:</span>
                  <span className="font-bold text-black">{selectedDate} lúc {selectedSlotTime}</span>
                </div>
                <div>
                  <span className="text-[#8e8ea0] block">Chi nhánh thực hiện:</span>
                  <span className="font-bold text-black">{branches.find(b => b.id === selectedBranchId)?.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8e8ea0] block">Người đặt:</span>
                  <span className="font-semibold text-black">{customerName} ({customerPhone})</span>
                </div>
                <div>
                  <span className="text-[#8e8ea0] block">Chuyên viên:</span>
                  <span className="font-semibold text-black">
                    {selectedStaffId === 'any' ? 'Bất kỳ ai (Ngẫu nhiên)' : users.find(u => u.id === selectedStaffId)?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Option Selection */}
            <div>
              <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                Phương thức thanh toán:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentOption('cash')}
                  className={`p-3.5 rounded-[5px] border cursor-pointer text-xs space-y-1 transition-all ${
                    paymentOption === 'cash' ? 'border-zinc-900 bg-zinc-50 font-semibold' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Thanh toán tại quầy</span>
                    {paymentOption === 'cash' && <Check className="w-4 h-4 text-zinc-900" />}
                  </div>
                  <p className="text-[11px] text-[#8e8ea0] font-normal">Thanh toán bằng tiền mặt/chuyển khoản sau khi làm xong</p>
                </div>

                <div
                  onClick={() => setPaymentOption('deposit')}
                  className={`p-3.5 rounded-[5px] border cursor-pointer text-xs space-y-1 transition-all ${
                    paymentOption === 'deposit' ? 'border-zinc-900 bg-zinc-50 font-semibold' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Đặt cọc online ({settings.deposit_percentage}%)</span>
                    {paymentOption === 'deposit' && <Check className="w-4 h-4 text-zinc-900" />}
                  </div>
                  <p className="text-[11px] text-[#8e8ea0] font-normal">Đặt cọc {depositAmount.toLocaleString('vi-VN')} đ giữ slot ưu tiên</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setStep(5)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>

              <button
                onClick={handleSubmitBooking}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-6 py-3 rounded-[5px] text-xs font-bold flex items-center gap-2 shadow-xs transition-colors duration-400"
              >
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Hoàn tất đặt lịch</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: RECEIPT / CONFIRMATION SUCCESS */}
        {step === 7 && completedBooking && (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-8 shadow-sm text-center space-y-6 animate-in fade-in duration-300">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-[5px] inline-block mb-3">
                Đặt lịch thành công!
              </span>
              <h2 className="text-2xl font-extrabold text-black">
                Mã lịch hẹn: <span className="text-blue-700">{completedBooking.booking_code}</span>
              </h2>
              <p className="text-xs text-[#8e8ea0] max-w-md mx-auto mt-1 leading-relaxed">
                Cảm ơn quý khách <strong>{completedBooking.customer_name}</strong>. Tin nhắn xác nhận đã được gửi đến số điện thoại <strong>{completedBooking.customer_phone}</strong>.
              </p>
            </div>

            {/* Printable Receipt Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-[5px] p-6 text-left max-w-lg mx-auto space-y-4">
              <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
                <span className="text-xs text-[#8e8ea0]">Trạng thái:</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-[5px] font-semibold">
                  Chờ xác nhận từ chi nhánh
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8e8ea0]">Thời gian hẹn:</span>
                  <span className="font-bold text-black">{completedBooking.date} ({completedBooking.start_time} - {completedBooking.end_time})</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8ea0]">Chi nhánh:</span>
                  <span className="font-bold text-black">{completedBooking.branch_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8ea0]">Chuyên viên:</span>
                  <span className="font-bold text-black">{completedBooking.staff_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8ea0]">Tổng chi phí:</span>
                  <span className="font-extrabold text-black text-sm">{completedBooking.total_amount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadICS}
                className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-zinc-600" />
                <span>Tải lịch hẹn (.ics)</span>
              </button>

              <button
                onClick={() => handleNav('my-bookings')}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-[#8e8ea0] text-white px-6 py-2.5 rounded-[5px] text-xs font-semibold transition-colors duration-400"
              >
                Xem lịch hẹn của tôi
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
