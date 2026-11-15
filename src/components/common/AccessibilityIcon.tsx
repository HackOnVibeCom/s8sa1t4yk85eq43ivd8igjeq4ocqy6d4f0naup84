import React from 'react';
import { 
  Footprints, 
  ArrowUpDown, 
  HelpCircle, 
  Car, 
  Volume2, 
  Eye, 
  Baby, 
  Utensils, 
  Coffee, 
  Building2, 
  Hospital, 
  TreePine, 
  Check, 
  X, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface AccessibilityIconProps {
  type: string;
  className?: string;
  size?: number;
}

export const WheelchairIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size || 20} 
    height={size || 20} 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-1.5 7h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-3.5h1.2l1.6 3.8A4.98 4.98 0 0 0 11 18.5a5 5 0 1 0 5-5c-.4 0-.79.05-1.16.14l-1.3-3.1a2 2 0 0 0-1.84-1.24h-.2zM16 16.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

export const RestroomIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size || 20} 
    height={size || 20} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM17 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
    <path d="M5.5 8h3l1 7h-1.5L7 21H6l-1-6H3.5l1-7z" />
    <path d="M14.5 8h5l1 5h-1.5L18 21h-2l-1-8h-1.5l1-5z" />
  </svg>
);

export const RampIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size || 20} 
    height={size || 20} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 19h18" />
    <path d="M5 19L19 7" />
    <path d="M19 7v6" />
    <path d="M13 7h6" />
  </svg>
);

export const SeatingIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size || 20} 
    height={size || 20} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 4v10a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V4" />
    <path d="M4 11h16" />
    <path d="M6 17v4" />
    <path d="M18 17v4" />
  </svg>
);

export const CanigoRobotIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    width={size || 28} 
    height={size || 28} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Antenna with rounded ball */}
    <circle cx="16" cy="4.5" r="2" fill="currentColor" stroke="none" />
    <line x1="16" y1="6.5" x2="16" y2="10" />
    {/* Head */}
    <rect x="5.5" y="10" width="21" height="16" rx="6" />
    {/* Friendly Eyes */}
    <circle cx="11.5" cy="16.5" r="2" fill="currentColor" stroke="none" />
    <circle cx="20.5" cy="16.5" r="2" fill="currentColor" stroke="none" />
    {/* Gentle Smile */}
    <path d="M12.5 21a4.5 4.5 0 0 0 7 0" />
    {/* Cute Ears / Screws */}
    <line x1="3" y1="16.5" x2="5.5" y2="16.5" strokeWidth="2.5" />
    <line x1="26.5" y1="16.5" x2="29" y2="16.5" strokeWidth="2.5" />
  </svg>
);

export const AccessibilityIcon: React.FC<AccessibilityIconProps> = ({ type, className = "w-5 h-5", size }) => {
  const t = type.toLowerCase();
  if (t.includes('wheelchair') || t.includes('access')) {
    return <WheelchairIcon className={className} size={size} />;
  }
  if (t.includes('ramp') || t.includes('step-free')) {
    return <RampIcon className={className} size={size} />;
  }
  if (t.includes('restroom') || t.includes('toilet') || t.includes('washroom')) {
    return <RestroomIcon className={className} size={size} />;
  }
  if (t.includes('lift') || t.includes('elevator')) {
    return <ArrowUpDown className={className} size={size || 20} />;
  }
  if (t.includes('seating') || t.includes('chair')) {
    return <SeatingIcon className={className} size={size} />;
  }
  if (t.includes('parking')) {
    return <Car className={className} size={size || 20} />;
  }
  if (t.includes('quiet') || t.includes('sound')) {
    return <Volume2 className={className} size={size || 20} />;
  }
  if (t.includes('tactile') || t.includes('visual') || t.includes('braille') || t.includes('path')) {
    return <Eye className={className} size={size || 20} />;
  }
  if (t.includes('stroller')) {
    return <Baby className={className} size={size || 20} />;
  }
  return <HelpCircle className={className} size={size || 20} />;
};
