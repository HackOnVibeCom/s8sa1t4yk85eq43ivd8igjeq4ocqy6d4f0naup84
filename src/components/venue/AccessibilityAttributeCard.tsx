import React from 'react';
import { AccessibilityAttribute } from '../../types';
import { AccessibilityIcon } from '../common/AccessibilityIcon';
import { Check, Clock, X, HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AttributeCardProps {
  attribute: AccessibilityAttribute;
  onPhotoClick?: (photoUrl: string) => void;
}

export const AccessibilityAttributeCard: React.FC<AttributeCardProps> = ({ attribute, onPhotoClick }) => {
  const { navigateTo } = useApp();

  const getStatusBadge = () => {
    switch (attribute.status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF4EA] text-forest">
            <Check className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'Reported':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FBF1DC] text-[#976B20]">
            <Clock className="w-3.5 h-3.5" />
            Reported
          </span>
        );
      case 'Not Available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FCEBE7] text-[#C8795B]">
            <X className="w-3.5 h-3.5" />
            Not Available
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FCEBE7] text-[#C8795B]">
            <AlertTriangle className="w-3.5 h-3.5" />
            Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
            <HelpCircle className="w-3.5 h-3.5" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 flex flex-col justify-between hover:shadow-subtle transition-shadow h-full">
      <div>
        {/* Top Header: Icon + Title + Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
              <AccessibilityIcon type={attribute.type} className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-[#263C3A] leading-tight">
              {attribute.type}
            </h4>
          </div>
          {getStatusBadge()}
        </div>

        {/* Description */}
        <p className="text-xs text-[#74817B] leading-relaxed mt-2">
          {attribute.description}
        </p>
      </div>

      {/* Optional Photo Attachment */}
      {attribute.photoUrl ? (
        <div className="mt-3 pt-2">
          <div 
            onClick={() => {
              if (onPhotoClick) {
                onPhotoClick(attribute.photoUrl!);
              } else {
                navigateTo('/evidence/photo-1');
              }
            }}
            className="w-full h-24 rounded-xl overflow-hidden cursor-pointer relative group border border-gray-100"
          >
            <img
              src={attribute.photoUrl}
              alt={attribute.type}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-[10px] bg-white/90 text-[#263C3A] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ExternalLink className="w-2.5 h-2.5" /> View Evidence
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-2 text-[11px] text-gray-400 italic">
          {attribute.lastObserved && `Observed: ${attribute.lastObserved}`}
        </div>
      )}
    </div>
  );
};
