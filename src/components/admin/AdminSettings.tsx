import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [businessName, setBusinessName] = useState(settings.business_name);
  const [contactPhone, setContactPhone] = useState(settings.contact_phone);
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [cancelDeadlineHours, setCancelDeadlineHours] = useState(settings.cancel_deadline_hours);
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState(settings.slot_interval_minutes);
  const [bufferTimeMinutes, setBufferTimeMinutes] = useState(settings.buffer_time_minutes);
  const [depositPercentage, setDepositPercentage] = useState(settings.deposit_percentage);

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      business_name: businessName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      cancel_deadline_hours: Number(cancelDeadlineHours),
      slot_interval_minutes: Number(slotIntervalMinutes),
      buffer_time_minutes: Number(bufferTimeMinutes),
      deposit_percentage: Number(depositPercentage),
      allow_guest_booking: settings.allow_guest_booking
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
          Cấu Hình Hệ Thống
        </h1>
        <p className="text-xs text-[#8e8ea0]">
          Cấu hình quy định hủy/đổi lịch, thời gian nghỉ buffer giữa các slot & thông tin thương hiệu.
        </p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-6 shadow-xs max-w-2xl space-y-6">
        
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[5px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã lưu cấu hình hệ thống thành công!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <h3 className="font-bold text-sm text-black border-b border-zinc-100 pb-2">Thông tin thương hiệu</h3>
          
          <div>
            <label className="block font-semibold text-black mb-1">Tên thương hiệu / Trung tâm</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-black mb-1">Hotline tổng đài</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-black mb-1">Email hỗ trợ</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
              />
            </div>
          </div>

          <h3 className="font-bold text-sm text-black border-b border-zinc-100 pb-2 pt-4">Quy định đặt & hủy lịch</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-black mb-1">Giới hạn hủy lịch trước (giờ) *</label>
              <input
                type="number"
                required
                min="1"
                value={cancelDeadlineHours}
                onChange={e => setCancelDeadlineHours(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
              />
              <span className="text-[10px] text-[#8e8ea0]">Khách chỉ được đổi/hủy trước mốc giờ này.</span>
            </div>

            <div>
              <label className="block font-semibold text-black mb-1">Tỷ lệ đặt cọc online (%) *</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={depositPercentage}
                onChange={e => setDepositPercentage(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-black mb-1">Khoảng cách slot (phút) *</label>
              <select
                value={slotIntervalMinutes}
                onChange={e => setSlotIntervalMinutes(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
              >
                <option value={15}>15 phút</option>
                <option value={30}>30 phút (Mặc định)</option>
                <option value={60}>60 phút</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-black mb-1">Thời gian dọn dẹp Buffer (phút) *</label>
              <input
                type="number"
                required
                min="0"
                value={bufferTimeMinutes}
                onChange={e => setBufferTimeMinutes(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
