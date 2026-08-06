import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { Scissors, Plus, Edit, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';

export const AdminServiceMgmt: React.FC = () => {
  const { services, branches, users, staffServices, addService, updateService, deleteService } = useApp();

  const [modalService, setModalService] = useState<Partial<Service> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(300000);
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState('Spa & Massage');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80');
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>(branches.map(b => b.id));

  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setDescription('');
    setPrice(350000);
    setDuration(60);
    setCategory('Spa & Massage');
    setImage('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80');
    setSelectedBranchIds(branches.map(b => b.id));
    setModalService({});
  };

  const openEditModal = (srv: Service) => {
    setIsEditing(true);
    setModalService(srv);
    setName(srv.name);
    setDescription(srv.description);
    setPrice(srv.price);
    setDuration(srv.duration_minutes);
    setCategory(srv.category);
    setImage(srv.image || '');
    setSelectedBranchIds(srv.branch_ids);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    if (isEditing && modalService?.id) {
      updateService(modalService.id, {
        name, description, price: Number(price), duration_minutes: Number(duration),
        category, image, branch_ids: selectedBranchIds
      });
    } else {
      addService({
        name, description, price: Number(price), duration_minutes: Number(duration),
        category, image, branch_ids: selectedBranchIds, is_active: true
      });
    }

    setModalService(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Quản Lý Dịch Vụ
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Thêm mới, chỉnh sửa giá, thời lượng & bật/tắt tạm ngừng nhận lịch của từng dịch vụ.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Dịch Vụ Mới</span>
        </button>
      </div>

      {/* Services Table List */}
      <div className="bg-white border border-[#e5e5e5] rounded-[5px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 uppercase tracking-wider text-[10px] text-zinc-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Dịch vụ</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Thời lượng</th>
                <th className="px-4 py-3">Giá tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {services.map(srv => (
                <tr key={srv.id} className="hover:bg-zinc-50/50">
                  <td className="px-4 py-3 font-semibold text-black flex items-center gap-3">
                    <img src={srv.image} alt={srv.name} className="w-10 h-10 rounded-[5px] object-cover border border-zinc-200" />
                    <div>
                      <span className="font-bold text-black block">{srv.name}</span>
                      <span className="text-[11px] text-[#8e8ea0] line-clamp-1">{srv.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-zinc-100 px-2 py-0.5 rounded-[5px] text-[11px] font-medium text-zinc-800">
                      {srv.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{srv.duration_minutes} phút</td>
                  <td className="px-4 py-3 font-extrabold text-black">
                    {srv.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateService(srv.id, { is_active: !srv.is_active })}
                      className={`px-2.5 py-1 rounded-[5px] text-[11px] font-semibold flex items-center gap-1 ${
                        srv.is_active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {srv.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{srv.is_active ? 'Đang nhận lịch' : 'Tạm dừng'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-1.5 hover:bg-zinc-100 text-zinc-600 hover:text-black rounded-[5px]"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa dịch vụ "${srv.name}"?`)) deleteService(srv.id);
                        }}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-[5px]"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / ADD MODAL */}
      {modalService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-[5px] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-base text-black">
                {isEditing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h3>
              <button onClick={() => setModalService(null)}><X className="w-4 h-4 text-zinc-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] p-2.5 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black mb-1">Giá dịch vụ (VND) *</label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black mb-1">Thời lượng (phút) *</label>
                  <input
                    type="number"
                    step="15"
                    required
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Danh mục</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Link Ảnh minh họa (URL)</label>
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
                  onClick={() => setModalService(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2 rounded-[5px] font-semibold transition-colors duration-400"
                >
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
