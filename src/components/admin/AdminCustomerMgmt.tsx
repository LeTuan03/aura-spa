import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Users, Search, Edit3, ShieldAlert, CheckCircle, Ban, FileText, X } from 'lucide-react';

export const AdminCustomerMgmt: React.FC = () => {
  const { users, bookings, updateCustomerNotes } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeNotesModalUser, setActiveNotesModalUser] = useState<User | null>(null);
  const [notesText, setNotesText] = useState('');
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  const clientUsers = users.filter(u => u.role === 'client');

  const filteredClients = clientUsers.filter(u => {
    const q = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.phone.includes(q) || (u.email && u.email.toLowerCase().includes(q));
  });

  const openNotesModal = (u: User) => {
    setActiveNotesModalUser(u);
    setNotesText(u.notes || '');
    setIsBlacklisted(!!u.is_blacklisted);
  };

  const handleSaveNotes = () => {
    if (!activeNotesModalUser) return;
    updateCustomerNotes(activeNotesModalUser.id, notesText, isBlacklisted);
    setActiveNotesModalUser(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Quản Lý Khách Hàng
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Tra cứu thông tin khách hàng, xem tổng chi tiêu, ghi chú nội bộ (dị ứng, VIP) & chặn tài khoản no-show.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-[5px] pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-zinc-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e5e5] rounded-[5px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Liên hệ</th>
                <th className="px-4 py-3">Tổng đơn</th>
                <th className="px-4 py-3">Tổng chi tiêu</th>
                <th className="px-4 py-3">Ghi chú nội bộ</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredClients.map(c => {
                const userBks = bookings.filter(b => b.customer_id === c.id || b.customer_phone === c.phone);
                const totalSpent = userBks
                  .filter(b => ['confirmed', 'completed', 'paid'].includes(b.status))
                  .reduce((acc, b) => acc + b.total_amount, 0);

                return (
                  <tr key={c.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3 font-semibold text-black flex items-center gap-3">
                      <img src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                      <div>
                        <span className="font-bold text-black block">{c.name}</span>
                        <span className="text-[10px] text-[#8e8ea0]">Gia nhập: {c.created_at}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-black">{c.phone}</span>
                      <span className="text-[11px] text-[#8e8ea0]">{c.email || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-black">{userBks.length} đơn</td>
                    <td className="px-4 py-3 font-extrabold text-black">
                      {totalSpent.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-3">
                      {c.notes ? (
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-[5px] text-[11px] inline-block max-w-xs truncate">
                          {c.notes}
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[11px] italic">Chưa có ghi chú</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.is_blacklisted ? (
                        <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-[5px] text-[10px] inline-flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Blacklist (Chặn)
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-[5px] text-[10px]">
                          Hoạt động tốt
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openNotesModal(c)}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1 rounded-[5px] text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Ghi chú / Cấu hình
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTES & BLACKLIST MODAL */}
      {activeNotesModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-[5px] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-base text-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-700" /> Hồ sơ khách: {activeNotesModalUser.name}
              </h3>
              <button onClick={() => setActiveNotesModalUser(null)}><X className="w-4 h-4 text-zinc-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1">
                  Ghi chú nội bộ dành cho nhân viên (VIP, dị ứng, thói quen...):
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Khách dị ứng tinh dầu quế, thích phục vụ trà hoa cúc nóng..."
                  value={notesText}
                  onChange={e => setNotesText(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] p-2.5 focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[5px] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-rose-900">Blacklist (Chặn khách no-show)</h4>
                  <p className="text-[10px] text-rose-700">Khách bị blacklist sẽ bị cảnh báo khi đặt lịch mới.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isBlacklisted}
                  onChange={e => setIsBlacklisted(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setActiveNotesModalUser(null)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] font-semibold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNotes}
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2 rounded-[5px] font-semibold text-xs transition-colors duration-400"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
