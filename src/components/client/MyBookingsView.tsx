import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Calendar, Clock, MapPin, XCircle, RotateCcw, 
  Star, FileText, CheckCircle2, AlertTriangle, X 
} from 'lucide-react';

export const MyBookingsView: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const { bookings, currentUser, cancelBooking, rescheduleBooking, addReview, settings, getAvailableSlots } = useApp();
  const navigate = useNavigate();

  const handleNav = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      if (view === 'booking') navigate('/booking');
      else navigate('/' + view);
    }
  };

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  // Modals state
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlotTime, setRescheduleSlotTime] = useState<string>('');

  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Filter user bookings
  const myBookings = bookings.filter(b => {
    if (currentUser.role === 'client') {
      return b.customer_id === currentUser.id || b.customer_phone === currentUser.phone;
    }
    return true; // if testing role
  });

  const filtered = myBookings.filter(b => {
    if (activeTab === 'upcoming') return ['pending', 'confirmed'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  // Action handlers
  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const res = cancelBooking(cancelModalBooking.id, cancelReason);
    if (!res.success) {
      alert(res.message);
    } else {
      setCancelModalBooking(null);
      setCancelReason('');
    }
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModalBooking || !rescheduleDate || !rescheduleSlotTime) return;
    const res = rescheduleBooking(rescheduleModalBooking.id, rescheduleDate, rescheduleSlotTime);
    if (!res.success) {
      alert(res.message);
    } else {
      alert('Đổi lịch thành công!');
      setRescheduleModalBooking(null);
    }
  };

  const handleConfirmReview = () => {
    if (!reviewModalBooking || !reviewComment) return;
    addReview({
      booking_id: reviewModalBooking.id,
      customer_id: currentUser.id,
      customer_name: currentUser.name,
      rating: reviewRating,
      comment: reviewComment,
      service_name: reviewModalBooking.services[0]?.service_name || 'Dịch vụ'
    });
    alert('Cảm ơn bạn đã gửi đánh giá!');
    setReviewModalBooking(null);
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 text-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
              Lịch Hẹn Của Tôi
            </h1>
            <p className="text-xs text-[#8e8ea0]">
              Theo dõi trạng thái, đổi lịch hoặc hủy lịch hẹn trước {settings.cancel_deadline_hours} giờ.
            </p>
          </div>

          <button
            onClick={() => handleNav('booking')}
            className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold self-start sm:self-auto transition-colors duration-400"
          >
            + Đặt lịch mới
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'upcoming' ? 'border-zinc-900 text-black' : 'border-transparent text-[#8e8ea0] hover:text-black'
            }`}
          >
            Sắp tới ({myBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'completed' ? 'border-zinc-900 text-black' : 'border-transparent text-[#8e8ea0] hover:text-black'
            }`}
          >
            Đã hoàn thành ({myBookings.filter(b => b.status === 'completed').length})
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'cancelled' ? 'border-zinc-900 text-black' : 'border-transparent text-[#8e8ea0] hover:text-black'
            }`}
          >
            Đã hủy ({myBookings.filter(b => b.status === 'cancelled').length})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'all' ? 'border-zinc-900 text-black' : 'border-transparent text-[#8e8ea0] hover:text-black'
            }`}
          >
            Tất cả ({myBookings.length})
          </button>
        </div>

        {/* Booking Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-12 text-center text-zinc-500">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
            <p className="text-sm font-semibold text-black">Không có lịch hẹn nào</p>
            <p className="text-xs text-[#8e8ea0] mt-1">Quý khách chưa có đơn đặt lịch nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(bk => (
              <div 
                key={bk.id} 
                className="bg-white border border-[#e5e5e5] rounded-[5px] p-5 shadow-xs hover:border-zinc-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-black">{bk.booking_code}</span>
                    <Badge status={bk.status} />
                    <Badge status={bk.payment_status} />
                  </div>
                  <span className="text-[11px] text-[#8e8ea0]">
                    Tạo ngày: {new Date(bk.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  
                  {/* Left: Services */}
                  <div className="md:col-span-6 space-y-1">
                    <span className="text-[#8e8ea0] block font-medium">Dịch vụ sử dụng:</span>
                    {bk.services.map((s, idx) => (
                      <div key={idx} className="font-semibold text-black flex items-center justify-between">
                        <span>• {s.service_name}</span>
                        <span className="text-zinc-600 font-normal">{s.duration_minutes}m</span>
                      </div>
                    ))}
                    {bk.notes && (
                      <p className="text-[11px] text-zinc-500 italic mt-1 bg-zinc-50 p-2 rounded-[5px] border border-zinc-100">
                        Ghi chú: "{bk.notes}"
                      </p>
                    )}
                  </div>

                  {/* Middle: Time & Location */}
                  <div className="md:col-span-4 space-y-1 text-zinc-700">
                    <p className="flex items-center gap-1.5 font-bold text-black">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <span>{bk.date} ({bk.start_time} - {bk.end_time})</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{bk.branch_name}</span>
                    </p>
                    <p className="text-[#8e8ea0]">Chuyên viên: <strong>{bk.staff_name || 'Đã phân công'}</strong></p>
                  </div>

                  {/* Right: Total Price */}
                  <div className="md:col-span-2 text-right flex flex-col justify-between">
                    <div>
                      <span className="text-[#8e8ea0] block">Tổng tiền:</span>
                      <span className="font-extrabold text-black text-base">
                        {bk.total_amount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="border-t border-zinc-100 pt-3 flex flex-wrap items-center justify-end gap-2">
                  
                  {/* Cancel / Reschedule for upcoming */}
                  {['pending', 'confirmed'].includes(bk.status) && (
                    <>
                      <button
                        onClick={() => {
                          setRescheduleModalBooking(bk);
                          setRescheduleDate(bk.date);
                        }}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Đổi lịch hẹn
                      </button>

                      <button
                        onClick={() => {
                          setCancelModalBooking(bk);
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Hủy lịch
                      </button>
                    </>
                  )}

                  {/* Rate Review for completed */}
                  {bk.status === 'completed' && (
                    <button
                      onClick={() => setReviewModalBooking(bk)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Đánh giá dịch vụ
                    </button>
                  )}

                </div>

              </div>
            ))}
          </div>
        )}

        {/* CANCEL MODAL */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-[5px] max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-base text-black flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-rose-500" /> Hủy lịch hẹn {cancelModalBooking.booking_code}
                </h3>
                <button onClick={() => setCancelModalBooking(null)}><X className="w-4 h-4 text-zinc-400" /></button>
              </div>

              <p className="text-xs text-zinc-600">
                Chính sách: Khách hàng chỉ có thể hủy trước ít nhất <strong>{settings.cancel_deadline_hours}h</strong>.
              </p>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Lý do hủy (không bắt buộc):
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhập lý do bận việc đột xuất, đổi kế hoạch..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] p-2.5 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] text-xs font-semibold"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-[5px] text-xs font-semibold"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESCHEDULE MODAL */}
        {rescheduleModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-[5px] max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-base text-black flex items-center gap-1.5">
                  <RotateCcw className="w-5 h-5 text-zinc-700" /> Đổi ngày/giờ hẹn {rescheduleModalBooking.booking_code}
                </h3>
                <button onClick={() => setRescheduleModalBooking(null)}><X className="w-4 h-4 text-zinc-400" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-black mb-1">Chọn ngày mới:</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={e => setRescheduleDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black mb-1">Chọn khung giờ mới:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {getAvailableSlots(
                      rescheduleDate, 
                      rescheduleModalBooking.branch_id, 
                      rescheduleModalBooking.staff_id, 
                      rescheduleModalBooking.services.reduce((acc, s) => acc + s.duration_minutes, 0)
                    ).map((s, idx) => (
                      <button
                        key={idx}
                        disabled={!s.available}
                        onClick={() => setRescheduleSlotTime(s.time)}
                        className={`py-1.5 text-xs font-medium rounded-[5px] border ${
                          !s.available ? 'bg-zinc-100 text-zinc-400 line-through' :
                          rescheduleSlotTime === s.time ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200'
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRescheduleModalBooking(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  disabled={!rescheduleSlotTime}
                  onClick={handleConfirmReschedule}
                  className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold disabled:opacity-50"
                >
                  Xác nhận đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW MODAL */}
        {reviewModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-[5px] max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-base text-black flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Đánh giá dịch vụ
                </h3>
                <button onClick={() => setReviewModalBooking(null)}><X className="w-4 h-4 text-zinc-400" /></button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-zinc-600">Bạn đánh giá thế nào về chất lượng dịch vụ?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">Nhận xét chi tiết:</label>
                <textarea
                  rows={3}
                  placeholder="Bày tỏ sự hài lòng về thái độ phục vụ, không gian, tay nghề kỹ thuật viên..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] p-2.5 text-xs focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setReviewModalBooking(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] text-xs font-semibold"
                >
                  Bỏ qua
                </button>
                <button
                  disabled={!reviewComment}
                  onClick={handleConfirmReview}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-[5px] text-xs font-semibold disabled:opacity-50"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
