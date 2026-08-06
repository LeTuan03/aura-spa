import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { Search, Filter, Clock, MapPin, Sparkles, X, Check } from 'lucide-react';

interface ServicesViewProps {
  onNavigate?: (view: string, params?: any) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  const { services, branches, users, staffServices } = useApp();
  const navigate = useNavigate();

  const handleNav = (view: string, params?: any) => {
    if (onNavigate) {
      onNavigate(view, params);
    } else {
      if (view === 'booking') {
        navigate('/booking', { state: params });
      } else {
        navigate('/' + view);
      }
    }
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  // Extract categories
  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];

  // Filter logic
  const filteredServices = services.filter(srv => {
    if (!srv.is_active) return false;
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesBranch = selectedBranchId === 'all' || srv.branch_ids.includes(selectedBranchId);
    return matchesSearch && matchesCat && matchesBranch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-10 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black tracking-tight mb-2">
            Danh Sách Dịch Vụ
          </h1>
          <p className="text-xs text-[#8e8ea0]">
            Khám phá các gói liệu trình massage, chăm sóc da & tạo kiểu cao cấp tại hệ thống của chúng tôi.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border border-[#e5e5e5] rounded-[5px] p-4 mb-8 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm tên dịch vụ, từ khóa..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2 text-xs focus:outline-none focus:border-zinc-500"
              >
                <option value="all">Tất cả danh mục ({services.length})</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedBranchId}
                onChange={e => setSelectedBranchId(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-[5px] px-3 py-2 text-xs focus:outline-none focus:border-zinc-500"
              >
                <option value="all">Tất cả chi nhánh</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white border border border-[#e5e5e5] rounded-[5px] p-12 text-center text-zinc-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
            <p className="text-sm font-semibold">Không tìm thấy dịch vụ nào phù hợp</p>
            <p className="text-xs text-[#8e8ea0] mt-1">Vui lòng thử tìm kiếm bằng từ khóa hoặc bộ lọc khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(srv => {
              // Find specialists assigned to this service
              const assignedStaffIds = staffServices.filter(ss => ss.service_id === srv.id).map(ss => ss.staff_id);
              const assignedStaff = users.filter(u => assignedStaffIds.includes(u.id));

              return (
                <div 
                  key={srv.id}
                  className="bg-white border border border-[#e5e5e5] rounded-[5px] overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-all duration-400 group"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-zinc-100 cursor-pointer" onClick={() => setActiveServiceModal(srv)}>
                      <img 
                        src={srv.image} 
                        alt={srv.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-[5px]">
                        {srv.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 
                        onClick={() => setActiveServiceModal(srv)}
                        className="font-bold text-base text-black cursor-pointer hover:text-[#8e8ea0] transition-colors leading-snug"
                      >
                        {srv.name}
                      </h3>
                      <p className="text-xs text-[#8e8ea0] line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>

                      {assignedStaff.length > 0 && (
                        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
                          <span className="font-semibold text-zinc-700">Chuyên viên:</span>
                          <span className="truncate">
                            {assignedStaff.map(st => st.name.split(' ')[0]).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-zinc-100 mt-2">
                    <div className="flex items-center justify-between text-xs my-3">
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-3.5 h-3.5" /> {srv.duration_minutes} phút
                      </span>
                      <span className="font-bold text-black text-base">
                        {srv.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveServiceModal(srv)}
                        className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2 rounded-[5px] text-xs font-semibold transition-colors"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleNav('booking', { selectedServiceId: srv.id })}
                        className="w-full bg-zinc-800 hover:bg-zinc-800 text-white py-2 rounded-[5px] text-xs font-semibold transition-colors duration-400 flex items-center justify-center gap-1"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Service Modal */}
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-zinc-200 rounded-[5px] max-w-lg w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
              
              <div className="relative h-56 bg-zinc-100">
                <img src={activeServiceModal.image} alt={activeServiceModal.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="absolute top-3 right-3 bg-black/70 text-white p-1.5 rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-[5px]">
                  {activeServiceModal.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-black mb-1">{activeServiceModal.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-600">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-zinc-400" /> {activeServiceModal.duration_minutes} phút</span>
                    <span className="font-bold text-black text-lg">{activeServiceModal.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <div className="border-t border-b border-zinc-100 py-3 text-xs text-zinc-700 leading-relaxed">
                  <h4 className="font-semibold text-black mb-1">Mô tả dịch vụ:</h4>
                  <p>{activeServiceModal.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-black mb-2">Chi nhánh áp dụng:</h4>
                  <div className="space-y-1 text-xs text-zinc-600">
                    {branches.filter(b => activeServiceModal.branch_ids.includes(b.id)).map(b => (
                      <div key={b.id} className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setActiveServiceModal(null)}
                    className="w-1/3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2.5 rounded-[5px] text-xs font-semibold transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      const srvId = activeServiceModal.id;
                      setActiveServiceModal(null);
                      handleNav('booking', { selectedServiceId: srvId });
                    }}
                    className="w-2/3 bg-[#8e8ea0] hover:bg-zinc-800 text-white py-2.5 rounded-[5px] text-xs font-semibold transition-colors duration-400 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Đặt lịch ngay cho gói này
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
