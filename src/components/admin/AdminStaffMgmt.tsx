import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Users, Plus, Edit, Trash2, Check, X, ShieldCheck } from 'lucide-react';

export const AdminStaffMgmt: React.FC = () => {
  const { users, branches, services, staffServices, addStaff, updateStaff, deleteStaff } = useApp();

  const [modalStaff, setModalStaff] = useState<Partial<User> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const staffList = users.filter(u => u.role === 'staff' || u.role === 'branch_manager');

  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setEmail('');
    setPhone('');
    setBranchId(branches[0]?.id || '');
    setAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
    setSelectedServiceIds(services.map(s => s.id));
    setModalStaff({});
  };

  const openEditModal = (st: User) => {
    setIsEditing(true);
    setModalStaff(st);
    setName(st.name);
    setEmail(st.email);
    setPhone(st.phone);
    setBranchId(st.branch_id || branches[0]?.id || '');
    setAvatar(st.avatar || '');
    
    // Assigned services for this staff
    const assigned = staffServices.filter(ss => ss.staff_id === st.id).map(ss => ss.service_id);
    setSelectedServiceIds(assigned);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (isEditing && modalStaff?.id) {
      updateStaff(modalStaff.id, { name, email, phone, branch_id: branchId, avatar }, selectedServiceIds);
    } else {
      addStaff({ name, email, phone, branch_id: branchId, avatar, role: 'staff' }, selectedServiceIds);
    }

    setModalStaff(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight mb-1">
            Quản Lý Nhân Viên & Chuyên Viên
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Phân công chuyên môn dịch vụ, quản lý chi nhánh làm việc & hồ sơ nhân sự.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-4 py-2 rounded-[5px] text-xs font-semibold flex items-center gap-1.5 transition-colors duration-400"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chuyên Viên Mới</span>
        </button>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map(st => {
          const br = branches.find(b => b.id === st.branch_id);
          const assignedSrvIds = staffServices.filter(ss => ss.staff_id === st.id).map(ss => ss.service_id);
          const assignedSrvs = services.filter(s => assignedSrvIds.includes(s.id));

          return (
            <div key={st.id} className="bg-white border border-[#e5e5e5] rounded-[5px] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover border border-zinc-200" />
                <div>
                  <h3 className="font-bold text-sm text-black">{st.name}</h3>
                  <span className="text-[11px] text-[#8e8ea0] uppercase tracking-wider font-semibold">
                    {st.role === 'branch_manager' ? 'Quản lý chi nhánh' : 'Kỹ thuật viên'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-zinc-600 border-t border-b border-zinc-100 py-2">
                <p>Chi nhánh: <strong className="text-black">{br?.name || 'Tất cả chi nhánh'}</strong></p>
                <p>SĐT: <strong className="text-black">{st.phone}</strong></p>
                <p>Email: <strong className="text-black">{st.email || 'N/A'}</strong></p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-700 block mb-1">Dịch vụ phụ trách:</span>
                <div className="flex flex-wrap gap-1">
                  {assignedSrvs.length === 0 ? (
                    <span className="text-[10px] text-zinc-400">Chưa gán dịch vụ nào</span>
                  ) : (
                    assignedSrvs.map(s => (
                      <span key={s.id} className="bg-zinc-100 text-zinc-800 text-[10px] px-2 py-0.5 rounded-[5px]">
                        {s.name}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  onClick={() => openEditModal(st)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1 rounded-[5px] text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Sửa
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Xóa nhân viên "${st.name}"?`)) deleteStaff(st.id);
                  }}
                  className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1 rounded-[5px] text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modalStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-[5px] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-base text-black">
                {isEditing ? 'Chỉnh sửa hồ sơ chuyên viên' : 'Thêm chuyên viên mới'}
              </h3>
              <button onClick={() => setModalStaff(null)}><X className="w-4 h-4 text-zinc-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1">Họ tên nhân viên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Chi nhánh trực thuộc</label>
                <select
                  value={branchId}
                  onChange={e => setBranchId(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Gán các dịch vụ thực hiện:</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-zinc-200 p-2 rounded-[5px]">
                  {services.map(srv => {
                    const isChecked = selectedServiceIds.includes(srv.id);
                    return (
                      <label key={srv.id} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 p-1 rounded-[3px]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedServiceIds(selectedServiceIds.filter(id => id !== srv.id));
                            } else {
                              setSelectedServiceIds([...selectedServiceIds, srv.id]);
                            }
                          }}
                        />
                        <span>{srv.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalStaff(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-[5px] font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#8e8ea0] hover:bg-zinc-800 text-white px-5 py-2 rounded-[5px] font-semibold transition-colors duration-400"
                >
                  Lưu Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
