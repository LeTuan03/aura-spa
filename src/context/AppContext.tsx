import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Branch, Service, Booking, Review, SystemSettings, Notification, 
  UserRole, StaffSchedule, BookingStatus 
} from '../types';
import { 
  initialBranches, initialServices, initialUsers, initialBookings, 
  initialReviews, initialSettings, initialNotifications, initialSchedules, initialStaffServices 
} from '../data/mockData';
import { format } from 'date-fns';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password?: string) => { success: boolean; message?: string; user?: User };
  quickLogin: (userId: string) => void;
  logout: () => void;
  register: (name: string, phone: string, email: string) => { success: boolean; message?: string; user?: User };
  switchRole: (role: UserRole, branchId?: string) => void;
  
  users: User[];
  branches: Branch[];
  services: Service[];
  bookings: Booking[];
  reviews: Review[];
  notifications: Notification[];
  settings: SystemSettings;
  schedules: StaffSchedule[];
  staffServices: { staff_id: string; service_id: string }[];

  // Client actions
  createBooking: (bookingData: Omit<Booking, 'id' | 'booking_code' | 'created_at' | 'end_time'>) => Booking;
  cancelBooking: (bookingId: string, reason?: string) => { success: boolean; message: string };
  rescheduleBooking: (bookingId: string, newDate: string, newStartTime: string) => { success: boolean; message: string };
  addReview: (reviewData: Omit<Review, 'id' | 'created_at'>) => void;

  // Admin / Management actions
  updateBookingStatus: (bookingId: string, status: BookingStatus, reason?: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  addStaff: (staff: Omit<User, 'id' | 'created_at'>, assignedServiceIds: string[]) => void;
  updateStaff: (id: string, staffData: Partial<User>, assignedServiceIds?: string[]) => void;
  deleteStaff: (id: string) => void;

  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  updateCustomerProfile: (userId: string, data: Partial<User>) => void;
  updateCustomerNotes: (userId: string, notes: string, is_blacklisted?: boolean) => void;
  updateSettings: (newSettings: SystemSettings) => void;

  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetDemoData: () => void;

  // Availability Helper
  getAvailableSlots: (dateStr: string, branchId: string, staffId: string, totalDurationMinutes: number) => { time: string; available: boolean; reason?: string }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'booking_app_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}branches`);
    return saved ? JSON.parse(saved) : initialBranches;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}services`);
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}bookings`);
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}reviews`);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [schedules] = useState<StaffSchedule[]>(initialSchedules);
  const [staffServices, setStaffServices] = useState<{ staff_id: string; service_id: string }[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}staff_services`);
    return saved ? JSON.parse(saved) : initialStaffServices;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`);
    if (saved) return JSON.parse(saved);
    return initialUsers.find(u => u.role === 'client') || initialUsers[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}is_authenticated`);
    if (savedAuth !== null) return JSON.parse(savedAuth);
    // Default logged in as client if user exists
    return true;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}is_authenticated`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Auth Methods
  const login = (emailOrPhone: string) => {
    const term = emailOrPhone.trim().toLowerCase();
    const matchedUser = users.find(u => 
      u.email.toLowerCase() === term || 
      u.phone.replace(/\s+/g, '') === term.replace(/\s+/g, '')
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      return { success: true, user: matchedUser };
    }

    return { 
      success: false, 
      message: 'Không tìm thấy tài khoản với Email/SĐT này trong hệ thống.' 
    };
  };

  const quickLogin = (userId: string) => {
    const matchedUser = users.find(u => u.id === userId);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    const guestUser: User = {
      id: 'usr-guest-' + Date.now(),
      name: 'Khách Vãng Lai',
      email: '',
      phone: '',
      role: 'guest',
      created_at: new Date().toISOString()
    };
    setCurrentUser(guestUser);
  };

  const register = (name: string, phone: string, email: string) => {
    const existing = users.find(u => 
      (email && u.email.toLowerCase() === email.trim().toLowerCase()) || 
      (phone && u.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''))
    );

    if (existing) {
      return { success: false, message: 'Email hoặc Số điện thoại đã được sử dụng.' };
    }

    const newUser: User = {
      id: `usr-client-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      role: 'client',
      created_at: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    return { success: true, user: newUser };
  };

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}branches`, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}staff_services`, JSON.stringify(staffServices));
  }, [staffServices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  // Switch active role for demo
  const switchRole = (role: UserRole, branchId?: string) => {
    let target = users.find(u => u.role === role);
    if (!target) {
      if (role === 'guest') {
        target = {
          id: 'usr-guest-' + Date.now(),
          name: 'Khách Vãng Lai',
          email: '',
          phone: '',
          role: 'guest',
          created_at: new Date().toISOString()
        };
      } else {
        target = users[0];
      }
    }
    if (branchId && target.role === 'branch_manager') {
      target = { ...target, branch_id: branchId };
    }
    setCurrentUser(target);
  };

  // Helper for computing end time string from start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  // Check available slots logic
  const getAvailableSlots = (
    dateStr: string, 
    branchId: string, 
    staffId: string, 
    totalDurationMinutes: number
  ) => {
    const branch = branches.find(b => b.id === branchId) || branches[0];
    const [openH, openM] = (branch.opening_hours.split('-')[0] || '08:30').trim().split(':').map(Number);
    const [closeH, closeM] = (branch.opening_hours.split('-')[1] || '20:30').trim().split(':').map(Number);
    
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday

    // Filter staff active bookings on this date
    const dayBookings = bookings.filter(b => 
      b.date === dateStr && 
      b.status !== 'cancelled' &&
      (staffId === 'any' ? b.branch_id === branchId : b.staff_id === staffId)
    );

    const interval = settings.slot_interval_minutes || 30;
    const slots: { time: string; available: boolean; reason?: string }[] = [];

    // Check if staff works on this day (if specific staff selected)
    if (staffId !== 'any') {
      const staffSchedule = schedules.find(s => s.staff_id === staffId && s.day_of_week === dayOfWeek);
      if (staffSchedule && !staffSchedule.is_working) {
        return [{ time: '09:00', available: false, reason: 'Chuyên viên nghỉ làm trong ngày này' }];
      }
    }

    // Now step through the day
    const now = new Date();
    const isToday = dateStr === format(now, 'yyyy-MM-dd');
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (let m = openMinutes; m + totalDurationMinutes <= closeMinutes; m += interval) {
      const slotH = Math.floor(m / 60);
      const slotM = m % 60;
      const slotTimeStr = `${String(slotH).padStart(2, '0')}:${String(slotM).padStart(2, '0')}`;
      const proposedEndM = m + totalDurationMinutes;

      let hasConflict = false;
      let reason: string | undefined;

      if (isToday && m <= nowMinutes) {
        hasConflict = true;
        reason = 'Đã qua thời gian này';
      } else {
        for (const bk of dayBookings) {
          const [bkStartH, bkStartM] = bk.start_time.split(':').map(Number);
          const [bkEndH, bkEndM] = bk.end_time.split(':').map(Number);
          const bkStartMinutes = bkStartH * 60 + bkStartM;
          const bkEndMinutes = bkEndH * 60 + bkEndM + settings.buffer_time_minutes;

          if (m < bkEndMinutes && proposedEndM > bkStartMinutes) {
            hasConflict = true;
            reason = 'Đã có lịch hẹn';
            break;
          }
        }
      }

      slots.push({
        time: slotTimeStr,
        available: !hasConflict,
        reason
      });
    }

    return slots;
  };

  // Create booking
  const createBooking = (bookingData: Omit<Booking, 'id' | 'booking_code' | 'created_at' | 'end_time'>) => {
    const totalDuration = bookingData.services.reduce((acc, s) => acc + s.duration_minutes, 0);
    const endTime = calculateEndTime(bookingData.start_time, totalDuration);
    const codeNumber = Math.floor(10000 + Math.random() * 90000);
    
    // Select actual staff if "any" was picked
    let chosenStaffId = bookingData.staff_id;
    let chosenStaffName = bookingData.staff_name;
    if (chosenStaffId === 'any') {
      const branchStaff = users.filter(u => u.role === 'staff' && u.branch_id === bookingData.branch_id);
      if (branchStaff.length > 0) {
        const randomStaff = branchStaff[Math.floor(Math.random() * branchStaff.length)];
        chosenStaffId = randomStaff.id;
        chosenStaffName = randomStaff.name;
      }
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      booking_code: `BK-${codeNumber}`,
      staff_id: chosenStaffId,
      staff_name: chosenStaffName,
      end_time: endTime,
      created_at: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Dispatch targeted notifications
    const newNotifs: Notification[] = [];
    const nowIso = new Date().toISOString();

    // 1. Notification for Customer
    if (newBooking.customer_id) {
      newNotifs.push({
        id: `notif-${Date.now()}-client`,
        user_id: newBooking.customer_id,
        branch_id: newBooking.branch_id,
        title: 'Đặt lịch thành công!',
        type: 'booking_created',
        message: `Lịch hẹn ${newBooking.booking_code} của bạn đã ghi nhận vào ngày ${newBooking.date} lúc ${newBooking.start_time}.`,
        is_read: false,
        created_at: nowIso,
        booking_id: newBooking.id
      });
    }

    // 2. Notification for Branch Manager / Admin
    newNotifs.push({
      id: `notif-${Date.now()}-admin`,
      target_role: 'branch_manager',
      branch_id: newBooking.branch_id,
      title: 'Đơn đặt lịch mới!',
      type: 'booking_created',
      message: `Khách hàng ${newBooking.customer_name} (${newBooking.customer_phone}) vừa đặt lịch ${newBooking.booking_code} ngày ${newBooking.date} lúc ${newBooking.start_time}.`,
      is_read: false,
      created_at: nowIso,
      booking_id: newBooking.id
    });

    // 3. Notification for Assigned Staff
    if (chosenStaffId && chosenStaffId !== 'any') {
      newNotifs.push({
        id: `notif-${Date.now()}-staff`,
        user_id: chosenStaffId,
        branch_id: newBooking.branch_id,
        title: 'Lịch làm việc mới được phân công',
        type: 'booking_created',
        message: `Bạn có lịch hẹn ${newBooking.booking_code} với khách ${newBooking.customer_name} ngày ${newBooking.date} lúc ${newBooking.start_time}.`,
        is_read: false,
        created_at: nowIso,
        booking_id: newBooking.id
      });
    }

    setNotifications(prev => [...newNotifs, ...prev]);

    return newBooking;
  };

  // Cancel booking (with policy check)
  const cancelBooking = (bookingId: string, reason?: string) => {
    const bk = bookings.find(b => b.id === bookingId);
    if (!bk) return { success: false, message: 'Không tìm thấy lịch hẹn' };

    if (bk.status === 'cancelled') {
      return { success: false, message: 'Lịch hẹn này đã bị hủy từ trước.' };
    }

    if (bk.status === 'completed') {
      return { success: false, message: 'Lịch hẹn đã hoàn thành, không thể hủy.' };
    }

    // Check cancellation deadline if client is doing it
    if (currentUser.role === 'client') {
      const bookingDateTime = new Date(`${bk.date}T${bk.start_time}:00`);
      const hoursDiff = (bookingDateTime.getTime() - Date.now()) / (1000 * 3600);
      if (hoursDiff < settings.cancel_deadline_hours) {
        return {
          success: false,
          message: `Rất tiếc, theo quy định bạn chỉ có thể tự hủy lịch hẹn trước giờ hẹn ít nhất ${settings.cancel_deadline_hours} giờ. Vui lòng liên hệ hotline ${settings.contact_phone} để được hỗ trợ trực tiếp.`
        };
      }
    }

    const cancelReasonText = reason || (currentUser.role === 'client' ? 'Khách hàng hủy' : 'Quản lý/Nhân viên hủy');

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'cancelled',
      cancel_reason: cancelReasonText,
      cancelled_at: new Date().toISOString()
    } : b));

    const newNotifs: Notification[] = [];
    const nowIso = new Date().toISOString();

    // 1. Notification for Client
    if (bk.customer_id) {
      newNotifs.push({
        id: `notif-${Date.now()}-client-cancel`,
        user_id: bk.customer_id,
        branch_id: bk.branch_id,
        title: 'Lịch hẹn đã bị hủy',
        type: 'cancelled',
        message: `Lịch hẹn ${bk.booking_code} ngày ${bk.date} đã được hủy thành công. Lý do: ${cancelReasonText}`,
        is_read: false,
        created_at: nowIso,
        booking_id: bk.id
      });
    }

    // 2. Notification for Branch Manager / Admin
    newNotifs.push({
      id: `notif-${Date.now()}-admin-cancel`,
      target_role: 'branch_manager',
      branch_id: bk.branch_id,
      title: 'Lịch hẹn đã bị hủy',
      type: 'cancelled',
      message: `Lịch hẹn ${bk.booking_code} của khách ${bk.customer_name} ngày ${bk.date} đã hủy. Lý do: ${cancelReasonText}`,
      is_read: false,
      created_at: nowIso,
      booking_id: bk.id
    });

    // 3. Notification for Assigned Staff
    if (bk.staff_id) {
      newNotifs.push({
        id: `notif-${Date.now()}-staff-cancel`,
        user_id: bk.staff_id,
        branch_id: bk.branch_id,
        title: 'Lịch phục vụ bị hủy',
        type: 'cancelled',
        message: `Lịch hẹn ${bk.booking_code} ngày ${bk.date} của khách ${bk.customer_name} đã bị hủy.`,
        is_read: false,
        created_at: nowIso,
        booking_id: bk.id
      });
    }

    setNotifications(prev => [...newNotifs, ...prev]);

    return { success: true, message: 'Hủy lịch hẹn thành công.' };
  };

  // Reschedule booking
  const rescheduleBooking = (bookingId: string, newDate: string, newStartTime: string) => {
    const bk = bookings.find(b => b.id === bookingId);
    if (!bk) return { success: false, message: 'Không tìm thấy lịch hẹn' };

    if (bk.status === 'cancelled' || bk.status === 'completed') {
      return { success: false, message: 'Lịch hẹn đã hoàn tất hoặc bị hủy, không thể đổi lịch.' };
    }

    // Calculate new end time
    const totalDuration = bk.services.reduce((acc, s) => acc + s.duration_minutes, 0);
    const newEndTime = calculateEndTime(newStartTime, totalDuration);

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      date: newDate,
      start_time: newStartTime,
      end_time: newEndTime,
      status: 'pending' // Re-enter pending status for confirmation
    } : b));

    const newNotifs: Notification[] = [];
    const nowIso = new Date().toISOString();

    // Client Notif
    if (bk.customer_id) {
      newNotifs.push({
        id: `notif-${Date.now()}-client-resched`,
        user_id: bk.customer_id,
        branch_id: bk.branch_id,
        title: 'Đổi lịch hẹn thành công',
        type: 'status_changed',
        message: `Lịch hẹn ${bk.booking_code} đã được đổi sang ngày ${newDate} lúc ${newStartTime}. Trạng thái: Chờ xác nhận.`,
        is_read: false,
        created_at: nowIso,
        booking_id: bk.id
      });
    }

    // Admin / Branch Manager Notif
    newNotifs.push({
      id: `notif-${Date.now()}-admin-resched`,
      target_role: 'branch_manager',
      branch_id: bk.branch_id,
      title: 'Khách hàng yêu cầu đổi lịch',
      type: 'status_changed',
      message: `Khách hàng ${bk.customer_name} đã chuyển lịch hẹn ${bk.booking_code} sang ngày ${newDate} lúc ${newStartTime}.`,
      is_read: false,
      created_at: nowIso,
      booking_id: bk.id
    });

    setNotifications(prev => [...newNotifs, ...prev]);

    return { success: true, message: 'Đổi ngày/giờ hẹn thành công.' };
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, reason?: string) => {
    const bk = bookings.find(b => b.id === bookingId);
    if (!bk) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status,
      cancel_reason: reason || b.cancel_reason
    } : b));

    const statusTextMap: Record<BookingStatus, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      no_show: 'Khách không đến (No-show)'
    };

    const newNotifs: Notification[] = [];
    const nowIso = new Date().toISOString();

    // Notification for Customer
    if (bk.customer_id) {
      newNotifs.push({
        id: `notif-${Date.now()}-cust-status`,
        user_id: bk.customer_id,
        branch_id: bk.branch_id,
        title: `Lịch hẹn ${bk.booking_code}: ${statusTextMap[status]}`,
        type: status === 'cancelled' ? 'cancelled' : 'status_changed',
        message: `Lịch hẹn ${bk.booking_code} ngày ${bk.date} của bạn hiện chuyển sang trạng thái: ${statusTextMap[status]}.${reason ? ` Ghi chú: ${reason}` : ''}`,
        is_read: false,
        created_at: nowIso,
        booking_id: bk.id
      });
    }

    // Notification for Assigned Staff
    if (bk.staff_id) {
      newNotifs.push({
        id: `notif-${Date.now()}-staff-status`,
        user_id: bk.staff_id,
        branch_id: bk.branch_id,
        title: `Cập nhật lịch ${bk.booking_code}`,
        type: 'status_changed',
        message: `Lịch hẹn ${bk.booking_code} (${bk.customer_name}) chuyển sang: ${statusTextMap[status]}.`,
        is_read: false,
        created_at: nowIso,
        booking_id: bk.id
      });
    }

    setNotifications(prev => [...newNotifs, ...prev]);
  };

  // Service CRUD
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newSrv: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`
    };
    setServices(prev => [...prev, newSrv]);
  };

  const updateService = (id: string, serviceData: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...serviceData } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Staff CRUD
  const addStaff = (staffData: Omit<User, 'id' | 'created_at'>, assignedServiceIds: string[]) => {
    const newStaffId = `usr-staff-${Date.now()}`;
    const newStaff: User = {
      ...staffData,
      id: newStaffId,
      role: 'staff',
      created_at: new Date().toISOString()
    };
    setUsers(prev => [...prev, newStaff]);

    // Map staff services
    const newMappings = assignedServiceIds.map(srvId => ({
      staff_id: newStaffId,
      service_id: srvId
    }));
    setStaffServices(prev => [...prev, ...newMappings]);
  };

  const updateStaff = (id: string, staffData: Partial<User>, assignedServiceIds?: string[]) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...staffData } : u));
    if (assignedServiceIds) {
      setStaffServices(prev => [
        ...prev.filter(ss => ss.staff_id !== id),
        ...assignedServiceIds.map(srvId => ({ staff_id: id, service_id: srvId }))
      ]);
    }
  };

  const deleteStaff = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setStaffServices(prev => prev.filter(ss => ss.staff_id !== id));
  };

  // Branch CRUD
  const addBranch = (branchData: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: `br-${Date.now()}`
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = (id: string, branchData: Partial<Branch>) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...branchData } : b));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  // Customer Management
  const updateCustomerNotes = (userId: string, notes: string, is_blacklisted?: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      notes, 
      is_blacklisted: is_blacklisted !== undefined ? is_blacklisted : u.is_blacklisted 
    } : u));
  };

  const updateCustomerProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'created_at'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setBranches(initialBranches);
    setServices(initialServices);
    setBookings(initialBookings);
    setReviews(initialReviews);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    setStaffServices(initialStaffServices);
    setCurrentUser(initialUsers.find(u => u.role === 'client') || initialUsers[0]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      isAuthenticated,
      login,
      quickLogin,
      logout,
      register,
      switchRole,
      users,
      branches,
      services,
      bookings,
      reviews,
      notifications,
      settings,
      schedules,
      staffServices,
      createBooking,
      cancelBooking,
      rescheduleBooking,
      addReview,
      updateBookingStatus,
      addService,
      updateService,
      deleteService,
      addStaff,
      updateStaff,
      deleteStaff,
      addBranch,
      updateBranch,
      deleteBranch,
      updateCustomerProfile,
      updateCustomerNotes,
      updateSettings,
      markNotificationRead,
      clearAllNotifications,
      resetDemoData,
      getAvailableSlots
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
