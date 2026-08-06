import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User as UserIcon, Phone, Mail, Save, CheckCircle2 } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, updateCustomerProfile } = useApp();

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(currentUser.id, { name, phone, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 text-zinc-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white border border-[#e5e5e5] rounded-[5px] p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-zinc-100 pb-6">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200"
            />
            <div>
              <h1 className="text-xl font-bold text-black">{currentUser.name}</h1>
              <p className="text-xs text-[#8e8ea0]">
                Vai trò: <span className="uppercase font-semibold text-zinc-700">{currentUser.role}</span>
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[5px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cập nhật thông tin thành công!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-black mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
