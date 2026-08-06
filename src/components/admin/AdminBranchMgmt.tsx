import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Branch } from '../../types';
import { Store, Plus, Edit, Trash2, MapPin, Clock, Phone, X } from 'lucide-react';

export const AdminBranchMgmt: React.FC = () => {
  const { branches, addBranch, updateBranch, deleteBranch } = useApp();

  const [modalBranch, setModalBranch] = useState<Partial<Branch> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('08:30 - 20:30');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');

  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setAddress('');
    setPhone('');
    setOpeningHours('08:30 - 20:30');
    setImage('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80');
    setModalBranch({});
  };

  const openEditModal = (br: Branch) => {
    setIsEditing(true);
    setModalBranch(br);
    setName(br.name);
    setAddress(br.address);
    setPhone(br.phone);
    setOpeningHours(br.opening_hours);
    setImage(br.image || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    if (isEditing && modalBranch?.id) {
      updateBranch(modalBranch.id, { name, address, phone, opening_hours: openingHours, image });
    } else {
      addBranch({ name, address, phone, opening_hours: openingHours, image, is_active: true });
    }

    setModalBranch(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Quản Lý Chi Nhánh
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Danh sách địa điểm cơ sở, địa chỉ, hotline & giờ mở cửa đón khách.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chi Nhánh Mới</span>
        </button>
      </div>

      {/* Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map(br => (
          <div key={br.id} className="bg-white border border-[#e5e5e5] rounded-[5px] overflow-hidden shadow-xs space-y-3">
            <div className="h-44 bg-zinc-100 overflow-hidden">
              <img src={br.image} alt={br.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-black">{br.name}</h3>
              <p className="text-xs text-zinc-600 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>{br.address}</span>
              </p>
              <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>SĐT: {br.phone}</span>
              </p>
              <p className="text-xs text-[#8e8ea0] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Giờ mở cửa: {br.opening_hours}</span>
              </p>
            </div>

            <div className="p-4 pt-0 flex justify-end gap-2 border-t border-zinc-100">
              <button
                onClick={() => openEditModal(br)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  if (confirm(`Xóa chi nhánh "${br.name}"?`)) deleteBranch(br.id);
                }}
                className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-[5px] text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalBranch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-[5px] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-base text-black">
                {isEditing ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}
              </h3>
              <button onClick={() => setModalBranch(null)}><X className="w-4 h-4 text-zinc-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1">Tên chi nhánh *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Địa chỉ chi tiết *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black mb-1">Số điện thoại hotline *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black mb-1">Giờ mở cửa *</label>
                  <input
                    type="text"
                    required
                    placeholder="08:30 - 20:30"
                    value={openingHours}
                    onChange={e => setOpeningHours(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Link ảnh chi nhánh (URL)</label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalBranch(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2 rounded-[5px] font-semibold transition-colors duration-400"
                >
                  Lưu Chi Nhánh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
