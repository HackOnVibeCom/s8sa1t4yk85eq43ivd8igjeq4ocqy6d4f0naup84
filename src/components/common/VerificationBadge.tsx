import React from 'react';
import { Check, ShieldCheck, Users, Clock, AlertTriangle, Flag, Image as ImageIcon, Hourglass } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus | 'Evidence attached' | 'Needs independent confirmation' | 'Not independently verified' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true,
  className = '' 
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Verified':
        return {
          bg: 'bg-[#EDF4EA]',
          text: 'text-[#155E4B]',
          border: 'border-[#C3D8CE]',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Verified'
        };
      case 'Community Verified':
        return {
          bg: 'bg-[#DDEBE1]',
          text: 'text-[#155E4B]',
          border: 'border-[#C3D8CE]',
          icon: <Users className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Community Verified'
        };
      case 'Under Review':
        return {
          bg: 'bg-[#FBF1DC]',
          text: 'text-[#976B20]',
          border: 'border-[#EAD39E]',
          icon: <Hourglass className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Under Review'
        };
      case 'Pending Verification':
        return {
          bg: 'bg-[#FBF1DC]',
          text: 'text-[#976B20]',
          border: 'border-[#EAD39E]',
          icon: <Clock className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Pending Verification'
        };
      case 'Reported':
        return {
          bg: 'bg-[#FCEBE7]',
          text: 'text-[#C8795B]',
          border: 'border-[#F1C8BE]',
          icon: <Flag className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Reported'
        };
      case 'Disputed':
        return {
          bg: 'bg-[#FCEBE7]',
          text: 'text-[#C8795B]',
          border: 'border-[#F1C8BE]',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Disputed'
        };
      case 'Evidence attached':
        return {
          bg: 'bg-[#EDF4EA]',
          text: 'text-[#155E4B]',
          border: 'border-[#C3D8CE]',
          icon: <ImageIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Evidence attached'
        };
      case 'Needs independent confirmation':
        return {
          bg: 'bg-[#FBF1DC]',
          text: 'text-[#976B20]',
          border: 'border-[#EAD39E]',
          icon: <Hourglass className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Needs independent confirmation'
        };
      case 'Not independently verified':
        return {
          bg: 'bg-[#FBF1DC]',
          text: 'text-[#976B20]',
          border: 'border-[#EAD39E]',
          icon: <Hourglass className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: 'Not independently verified'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <Clock className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: status
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1' 
    : size === 'lg' 
      ? 'text-sm px-3.5 py-1.5 gap-2 font-medium' 
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
