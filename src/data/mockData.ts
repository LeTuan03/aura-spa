import { Branch, Service, User, StaffSchedule, Booking, Review, SystemSettings, Notification } from '../types';

export const initialBranches: Branch[] = [
  {
    id: 'br-1',
    name: 'Chi Nhánh Quận 1 - Hồ Chí Minh',
    address: '152 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM',
    phone: '0901 234 567',
    opening_hours: '08:30 - 20:30',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'br-2',
    name: 'Chi Nhánh Hoàn Kiếm - Hà Nội',
    address: '45 Lý Thường Kiệt, Phường Trần Hưng Đạo, Q. Hoàn Kiếm, Hà Nội',
    phone: '0909 876 543',
    opening_hours: '09:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'br-3',
    name: 'Chi Nhánh Hải Châu - Đà Nẵng',
    address: '88 Bạch Đằng, Phường Phước Ninh, Q. Hải Châu, Đà Nẵng',
    phone: '0912 345 678',
    opening_hours: '08:30 - 20:00',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  }
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    name: 'Massage Thảo Dược Toàn Thân (Body Wellness)',
    description: 'Liệu trình massage thư giãn kết hợp túi thảo dược ấm, giúp lưu thông khí huyết và giảm căng thẳng cơ bắp.',
    price: 450000,
    duration_minutes: 60,
    category: 'Spa & Massage',
    branch_ids: ['br-1', 'br-2', 'br-3'],
    is_active: true,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-2',
    name: 'Chăm Sóc Da Mặt Chuyên Sâu (Deep Facial Care)',
    description: 'Làm sạch sâu, hút mụn cám, cấp ẩm và đi điện di Vitamin C phục hồi da tươi trẻ.',
    price: 590000,
    duration_minutes: 75,
    category: 'Chăm Sóc Da',
    branch_ids: ['br-1', 'br-2', 'br-3'],
    is_active: true,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-3',
    name: 'Cắt & Tạo Kiểu Tóc Premium (Hair Styling)',
    description: 'Tư vấn dáng tóc phù hợp khuôn mặt, gội đầu dưỡng sinh và tạo kiểu chuyên nghiệp.',
    price: 350000,
    duration_minutes: 45,
    category: 'Hair Salon',
    branch_ids: ['br-1', 'br-2'],
    is_active: true,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-4',
    name: 'Tư Vấn & Khám Da Liễu Chuyên Gia',
    description: 'Bác sĩ da liễu soi da 3D, phân tích tình trạng và lập phác đồ điều trị mụn/nám cá nhân hóa.',
    price: 300000,
    duration_minutes: 30,
    category: 'Tư Vấn Sức Khỏe',
    branch_ids: ['br-1', 'br-2', 'br-3'],
    is_active: true,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-5',
    name: 'Gội Đầu Dưỡng Sinh Thảo Dược Vua',
    description: 'Gội đầu kết hợp bấm huyệt vùng đầu, cổ, vai gáy bài trừ mệt mỏi và đau đầu.',
    price: 250000,
    duration_minutes: 45,
    category: 'Spa & Massage',
    branch_ids: ['br-1', 'br-2', 'br-3'],
    is_active: true,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-6',
    name: 'Trẻ Hóa Da Công Nghệ RF Laser',
    description: 'Công nghệ nâng cơ xóa nhăn RF giúp kích thích sản sinh collagen, da săn chắc rõ rệt.',
    price: 1200000,
    duration_minutes: 90,
    category: 'Chăm Sóc Da',
    branch_ids: ['br-1', 'br-2'],
    is_active: true,
    image: 'https://images.unsplash.com/photo-1512290900673-7002ddb97b09?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialUsers: User[] = [
  {
    id: 'usr-admin',
    name: 'Nguyễn Văn Quản Lý (Super Admin)',
    email: 'admin@booking.vn',
    phone: '0988 111 222',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-01-01'
  },
  {
    id: 'usr-mgr-hcm',
    name: 'Trần Thị Mai (Quản Lý Q1)',
    email: 'mgr.hcm@booking.vn',
    phone: '0988 333 444',
    role: 'branch_manager',
    branch_id: 'br-1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-01-15'
  },
  {
    id: 'usr-staff-1',
    name: 'Lê Hoàng Anh (KTV Massage)',
    email: 'hoanganh@booking.vn',
    phone: '0911 222 333',
    role: 'staff',
    branch_id: 'br-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-02-01'
  },
  {
    id: 'usr-staff-2',
    name: 'Phạm Thu Thảo (Chuyên Gia Skincare)',
    email: 'thuthao@booking.vn',
    phone: '0911 444 555',
    role: 'staff',
    branch_id: 'br-1',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-02-10'
  },
  {
    id: 'usr-staff-3',
    name: 'Đặng Minh Khoa (Hair Stylist HN)',
    email: 'minhkhoa@booking.vn',
    phone: '0911 666 777',
    role: 'staff',
    branch_id: 'br-2',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-02-15'
  },
  {
    id: 'usr-client-1',
    name: 'Vũ Thị Hương',
    email: 'huong.vu@gmail.com',
    phone: '0977 888 999',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-03-01',
    notes: 'Khách VIP, thích tinh dầu sả chanh'
  },
  {
    id: 'usr-client-2',
    name: 'Nguyễn Quốc Tuấn',
    email: 'tuan.nguyen@gmail.com',
    phone: '0966 555 444',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-03-05'
  }
];

export const initialStaffServices = [
  { staff_id: 'usr-staff-1', service_id: 'srv-1' },
  { staff_id: 'usr-staff-1', service_id: 'srv-5' },
  { staff_id: 'usr-staff-2', service_id: 'srv-2' },
  { staff_id: 'usr-staff-2', service_id: 'srv-4' },
  { staff_id: 'usr-staff-2', service_id: 'srv-6' },
  { staff_id: 'usr-staff-3', service_id: 'srv-3' },
];

export const initialSchedules: StaffSchedule[] = [
  // Generate 7 days schedule for staff
  ...['usr-staff-1', 'usr-staff-2', 'usr-staff-3'].flatMap(staff_id => 
    [0, 1, 2, 3, 4, 5, 6].map(day => ({
      id: `sch-${staff_id}-${day}`,
      staff_id,
      day_of_week: day,
      start_time: '09:00',
      end_time: '18:00',
      is_working: day !== 0 // Working Mon-Sat, Sunday off
    }))
  )
];

// Helper date generator around current date
const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

export const initialBookings: Booking[] = [
  {
    id: 'bk-101',
    booking_code: 'BK-78901',
    customer_id: 'usr-client-1',
    customer_name: 'Vũ Thị Hương',
    customer_phone: '0977 888 999',
    customer_email: 'huong.vu@gmail.com',
    staff_id: 'usr-staff-2',
    staff_name: 'Phạm Thu Thảo',
    branch_id: 'br-1',
    branch_name: 'Chi Nhánh Quận 1 - Hồ Chí Minh',
    services: [
      {
        service_id: 'srv-2',
        service_name: 'Chăm Sóc Da Mặt Chuyên Sâu (Deep Facial Care)',
        price: 590000,
        duration_minutes: 75
      }
    ],
    date: todayStr,
    start_time: '10:00',
    end_time: '11:15',
    total_amount: 590000,
    status: 'confirmed',
    notes: 'Yêu cầu phòng yên tĩnh và bật nhạc nhẹ.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    payment_status: 'paid'
  },
  {
    id: 'bk-102',
    booking_code: 'BK-78902',
    customer_id: 'usr-client-2',
    customer_name: 'Nguyễn Quốc Tuấn',
    customer_phone: '0966 555 444',
    customer_email: 'tuan.nguyen@gmail.com',
    staff_id: 'usr-staff-1',
    staff_name: 'Lê Hoàng Anh',
    branch_id: 'br-1',
    branch_name: 'Chi Nhánh Quận 1 - Hồ Chí Minh',
    services: [
      {
        service_id: 'srv-1',
        service_name: 'Massage Thảo Dược Toàn Thân (Body Wellness)',
        price: 450000,
        duration_minutes: 60
      }
    ],
    date: todayStr,
    start_time: '14:00',
    end_time: '15:00',
    total_amount: 450000,
    status: 'pending',
    notes: 'Khách gọi điện đặt trực tiếp.',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    payment_status: 'unpaid'
  },
  {
    id: 'bk-103',
    booking_code: 'BK-78903',
    customer_id: 'usr-client-1',
    customer_name: 'Vũ Thị Hương',
    customer_phone: '0977 888 999',
    customer_email: 'huong.vu@gmail.com',
    staff_id: 'usr-staff-1',
    staff_name: 'Lê Hoàng Anh',
    branch_id: 'br-1',
    branch_name: 'Chi Nhánh Quận 1 - Hồ Chí Minh',
    services: [
      {
        service_id: 'srv-5',
        service_name: 'Gội Đầu Dưỡng Sinh Thảo Dược Vua',
        price: 250000,
        duration_minutes: 45
      }
    ],
    date: tomorrowStr,
    start_time: '09:30',
    end_time: '10:15',
    total_amount: 250000,
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    payment_status: 'deposited'
  },
  {
    id: 'bk-104',
    booking_code: 'BK-78899',
    customer_id: 'usr-client-2',
    customer_name: 'Nguyễn Quốc Tuấn',
    customer_phone: '0966 555 444',
    customer_email: 'tuan.nguyen@gmail.com',
    staff_id: 'usr-staff-1',
    staff_name: 'Lê Hoàng Anh',
    branch_id: 'br-1',
    branch_name: 'Chi Nhánh Quận 1 - Hồ Chí Minh',
    services: [
      {
        service_id: 'srv-1',
        service_name: 'Massage Thảo Dược Toàn Thân (Body Wellness)',
        price: 450000,
        duration_minutes: 60
      }
    ],
    date: yesterdayStr,
    start_time: '15:00',
    end_time: '16:00',
    total_amount: 450000,
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    payment_status: 'paid'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-104',
    customer_id: 'usr-client-2',
    customer_name: 'Nguyễn Quốc Tuấn',
    rating: 5,
    comment: 'Kỹ thuật viên Lê Hoàng Anh tay nghề rất tốt, massage giảm nhức mỏi ngay lập tức. Không gian sạch sẽ sang trọng!',
    service_name: 'Massage Thảo Dược Toàn Thân (Body Wellness)',
    created_at: yesterdayStr
  },
  {
    id: 'rev-2',
    booking_id: 'bk-099',
    customer_id: 'usr-client-1',
    customer_name: 'Vũ Thị Hương',
    rating: 5,
    comment: 'Dịch vụ chăm sóc da rất kỹ, nhân viên niềm nở, tư vấn đúng tình trạng da không chèo kéo mua thêm gói.',
    service_name: 'Chăm Sóc Da Mặt Chuyên Sâu',
    created_at: '2025-07-28'
  }
];

export const initialSettings: SystemSettings = {
  cancel_deadline_hours: 24,
  slot_interval_minutes: 30,
  buffer_time_minutes: 10,
  deposit_percentage: 20,
  business_name: 'Aura Spa',
  contact_email: 'support@Aura.vn',
  contact_phone: '1900 8888',
  allow_guest_booking: true
};

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Lịch hẹn mới cần xác nhận',
    type: 'booking_created',
    message: 'Khách hàng Nguyễn Quốc Tuấn vừa đăng ký lịch Massage Thảo Dược lúc 14:00 hôm nay.',
    is_read: false,
    created_at: new Date().toISOString(),
    booking_id: 'bk-102',
    target_role: 'branch_manager',
    branch_id: 'br-1'
  },
  {
    id: 'notif-2',
    title: 'Xác nhận lịch hẹn thành công',
    type: 'status_changed',
    message: 'Lịch hẹn BK-78901 của bạn tại Chi Nhánh Quận 1 đã được nhân viên xác nhận.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: 'usr-client-1',
    booking_id: 'bk-101',
    branch_id: 'br-1'
  }
];
