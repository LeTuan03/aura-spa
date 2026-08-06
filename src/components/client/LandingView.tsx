import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Star, MapPin, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface LandingViewProps {
  onNavigate?: (view: string, params?: any) => void;
}

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/images/spa_facial_treatment_1785988817999.jpg',
    title: 'Trị Liệu & Chăm Sóc Da Chuyên Sâu 5 Sao'
  },
  {
    id: 'slide-2',
    image: '/images/luxury_spa_hero_1785988061075.jpg',
    title: 'Aura Spa - Không Gian Sang Trọng'
  },
  {
    id: 'slide-3',
    image: '/images/spa_head_wash_lounge_1785988830083.jpg',
    title: 'Gội Đầu Dưỡng Sinh & Massage Cổ Vai Gáy'
  },
  {
    id: 'slide-4',
    image: '/images/spa_aromatherapy_lounge_1785988973477.jpg',
    title: 'Phòng Thư Giãn Hương Thảo Mộc Độc Quyền'
  },
  {
    id: 'slide-5',
    image: '/images/spa_reception_lobby_1785988995306.jpg',
    title: 'Sảnh Đón Tiếp Đẳng Cấp 5 Sao Trung Tâm HCM'
  }
];

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { services, branches, reviews } = useApp();
  const navigate = useNavigate();

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-play interval effect
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNav = (view: string, params?: any) => {
    if (onNavigate) {
      onNavigate(view, params);
    } else {
      if (view === 'booking') {
        navigate('/booking', { state: params });
      } else if (view === 'services') {
        navigate('/services');
      } else {
        navigate('/' + view);
      }
    }
  };

  const featuredServices = services.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* High-End Clean Visual Hero Carousel Banner */}
      <section
        className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] bg-[#0a0a0c] text-white border-b border-zinc-800/80 overflow-hidden group select-none"
      >
        {/* Auto-sliding Images with Smooth Fade & Scale Transition */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.03]"
            />
            {/* Subtle Vignette & Gradient Borders for Premium Look */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/50 via-transparent to-[#0a0a0c]/50"></div>
          </div>
        ))}

        {/* Floating Side Prev / Next Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-zinc-950/60 hover:bg-zinc-900 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-xl"
          title="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-zinc-950/60 hover:bg-zinc-900 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-xl"
          title="Ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Floating Bar: Minimal Slide Title, Indicators & Floating Quick Action */}
        <div className="absolute bottom-6 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left: Minimal Image Caption Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950/70 border border-white/15 rounded-full backdrop-blur-md text-xs font-medium text-amber-200 shadow-2xl">
            <span>{HERO_SLIDES[currentSlide].title}</span>
          </div>

          {/* Right Controls: Dot Progress & Booking Button */}
          <div className="flex items-center gap-4">

            {/* Dots + Autoplay Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/70 border border-white/15 rounded-full backdrop-blur-md">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                    ? 'w-7 bg-amber-400 shadow-sm shadow-amber-400/80'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => handleNav('booking', { selectedServiceId: services[0]?.id })}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-full transition-all duration-300 shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Đặt Hẹn Ngay</span>
            </button>

          </div>

        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-[#8e8ea0] tracking-wider block mb-1">Dịch vụ hàng đầu</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                Dịch vụ được đặt nhiều nhất
              </h2>
            </div>
            <button
              onClick={() => handleNav('services')}
              className="text-xs font-semibold text-black hover:text-[#8e8ea0] flex items-center gap-1 transition-colors self-start md:self-auto"
            >
              Xem tất cả dịch vụ &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map(srv => (
              <div
                key={srv.id}
                className="bg-white border border-zinc-200 rounded-[5px] overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-all duration-400"
              >
                <div>
                  <div className="h-44 overflow-hidden relative bg-zinc-100">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-medium px-2 py-0.5 rounded-[5px]">
                      {srv.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-black leading-snug line-clamp-2">{srv.name}</h3>
                    <p className="text-xs text-[#8e8ea0] line-clamp-2 leading-relaxed">{srv.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-zinc-100 mt-2">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" /> {srv.duration_minutes} phút
                    </span>
                    <span className="font-bold text-black text-sm">
                      {srv.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <button
                    onClick={() => handleNav('booking', { selectedServiceId: srv.id })}
                    className="w-full bg-zinc-900 hover:bg-[#8e8ea0] text-white py-2 rounded-[5px] text-xs font-semibold transition-colors duration-400"
                  >
                    Đặt dịch vụ này
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3 Step Process Section */}
      <section className="py-16 bg-zinc-50 border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase text-[#8e8ea0] tracking-wider block mb-1">Quy trình đơn giản</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Đặt lịch hẹn chỉ với 3 bước đơn giản
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-zinc-200 rounded-[5px] space-y-3">
              <div className="w-10 h-10 rounded-[5px] bg-zinc-900 text-white font-bold flex items-center justify-center text-base">
                1
              </div>
              <h3 className="font-bold text-base text-black">Chọn dịch vụ & chi nhánh</h3>
              <p className="text-xs text-[#8e8ea0] leading-relaxed">
                Lựa chọn một hoặc nhiều dịch vụ cần làm, địa điểm chi nhánh gần nhất và chuyên viên bạn tin tưởng.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-200 rounded-[5px] space-y-3">
              <div className="w-10 h-10 rounded-[5px] bg-zinc-900 text-white font-bold flex items-center justify-center text-base">
                2
              </div>
              <h3 className="font-bold text-base text-black">Chọn ngày & khung giờ trống</h3>
              <p className="text-xs text-[#8e8ea0] leading-relaxed">
                Hệ thống tự động hiển thị các slot giờ còn trống chính xác theo thời gian thực để bạn chọn lựa.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-200 rounded-[5px] space-y-3">
              <div className="w-10 h-10 rounded-[5px] bg-zinc-900 text-white font-bold flex items-center justify-center text-base">
                3
              </div>
              <h3 className="font-bold text-base text-black">Xác nhận & Đến tận hưởng</h3>
              <p className="text-xs text-[#8e8ea0] leading-relaxed">
                Nhận tin nhắn/email xác nhận ngay lập tức. Đến đúng hẹn và tận hưởng dịch vụ không cần xếp hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Showcase */}
      <section className="py-16 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase text-[#8e8ea0] tracking-wider block mb-1">Địa điểm phục vụ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Hệ thống chi nhánh của chúng tôi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map(b => (
              <div key={b.id} className="border border-zinc-200 rounded-[5px] overflow-hidden bg-white">
                <div className="h-48 overflow-hidden bg-zinc-100">
                  <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-black">{b.name}</h3>
                  <p className="text-xs text-zinc-600 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </p>
                  <p className="text-xs text-[#8e8ea0] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>Giờ mở cửa: {b.opening_hours}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase text-[#8e8ea0] tracking-wider block mb-1">Đánh giá từ khách hàng</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(rev => (
              <div key={rev.id} className="p-6 bg-white border border-zinc-200 rounded-[5px] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8e8ea0]">{rev.created_at}</span>
                </div>

                <p className="text-xs text-zinc-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-black">{rev.customer_name}</span>
                  <span className="text-[#8e8ea0]">{rev.service_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
