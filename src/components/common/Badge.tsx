import React from 'react';
import { BookingStatus } from '../../types';

interface BadgeProps {
  status: BookingStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let colorStyle = 'bg-zinc-100 text-zinc-800 border-zinc-200';
  let label = status;

  switch (status) {
    case 'pending':
      colorStyle = 'bg-amber-50 text-amber-800 border-amber-200/80';
      label = 'Chờ xác nhận';
      break;
    case 'confirmed':
      colorStyle = 'bg-blue-50 text-blue-800 border-blue-200/80';
      label = 'Đã xác nhận';
      break;
    case 'completed':
      colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      label = 'Hoàn thành';
      break;
    case 'cancelled':
      colorStyle = 'bg-rose-50 text-rose-800 border-rose-200/80';
      label = 'Đã hủy';
      break;
    case 'no_show':
      colorStyle = 'bg-purple-50 text-purple-800 border-purple-200/80';
      label = 'Vắng mặt (No-show)';
      break;
    case 'paid':
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'Đã thanh toán';
      break;
    case 'unpaid':
      colorStyle = 'bg-zinc-100 text-zinc-600 border-zinc-200';
      label = 'Chưa thanh toán';
      break;
    case 'deposited':
      colorStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      label = 'Đã đặt cọc';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[5px] text-xs font-medium border ${colorStyle} ${className}`}>
      {label}
    </span>
  );
};
