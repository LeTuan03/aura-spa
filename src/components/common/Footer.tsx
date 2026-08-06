import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { branches, settings } = useApp();

  return (
    <footer className="bg-white border-t border-[#e5e5e5] text-zinc-600 py-12 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[5px] bg-zinc-900 text-white flex items-center justify-center font-bold text-base">
                L
              </div>
              <span className="font-bold text-base text-black tracking-tight">
                {settings.business_name}
              </span>
            </div>
            <p className="text-xs text-[#8e8ea0] leading-relaxed mb-4">
              Hệ thống đặt lịch dịch vụ làm đẹp, trị liệu da & wellness chất lượng cao. Đảm bảo đúng giờ, phục vụ chu đáo tận tâm.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Phone className="w-4 h-4 text-zinc-500" />
              <span>Hotline: <strong>{settings.contact_phone}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-700 mt-1">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>Email: <strong>{settings.contact_email}</strong></span>
            </div>
          </div>

          {/* Col 2: Chi nhánh TP.HCM & HN */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-black text-sm mb-3 uppercase tracking-wider text-[11px] text-[#8e8ea0]">
              Hệ thống chi nhánh
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {branches.map(b => (
                <div key={b.id} className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-[5px]">
                  <h5 className="font-semibold text-black mb-1">{b.name}</h5>
                  <p className="text-zinc-600 flex items-start gap-1 mb-1 leading-normal">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </p>
                  <p className="text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Giờ mở cửa: {b.opening_hours}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Cam kết & Policy */}
          <div>
            <h4 className="font-semibold text-black text-sm mb-3 uppercase tracking-wider text-[11px] text-[#8e8ea0]">
              Chính sách & Cam kết
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hoàn hủy linh hoạt trước {settings.cancel_deadline_hours}h</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo mật thông tin khách hàng</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chuyên viên giàu kinh nghiệm</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giữ slot đúng giờ, không xếp hàng</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8e8ea0] gap-2">
          <p>© 2026 {settings.business_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
