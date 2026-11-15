import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Megaphone, 
  FileWarning, 
  Image as ImageIcon, 
  Clock, 
  AlertCircle, 
  UploadCloud, 
  Send, 
  Scale, 
  CheckCircle2, 
  Info,
  Edit2
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { navigateTo, submitReport, contributions } = useApp();

  const [selectedReason, setSelectedReason] = useState<'Incorrect Information' | 'Misleading Photo' | 'Outdated Information' | 'Other Issue'>('Incorrect Information');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitReport({
      contributionId: 'contrib-1',
      venueName: 'The Garden Café',
      reason: selectedReason,
      description: description.trim(),
    });

    setIsSubmitted(true);
  };

  const reportOptions = [
    {
      title: 'Incorrect Information' as const,
      desc: 'The details are not accurate',
      icon: <FileWarning className="w-5 h-5 text-forest" />
    },
    {
      title: 'Misleading Photo' as const,
      desc: 'The photo does not represent the place',
      icon: <ImageIcon className="w-5 h-5 text-forest" />
    },
    {
      title: 'Outdated Information' as const,
      desc: 'The accessibility may have changed',
      icon: <Clock className="w-5 h-5 text-forest" />
    },
    {
      title: 'Other Issue' as const,
      desc: 'Something else is wrong',
      icon: <AlertCircle className="w-5 h-5 text-forest" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-5 h-5 text-forest" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
            Report a Contribution
          </h1>
          <p className="text-xs sm:text-sm text-[#74817B]">
            Help us keep CANIGO accurate, reliable and trustworthy for everyone.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl border border-[#E5E5DC] p-8 text-center max-w-xl mx-auto space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-forest" />
          </div>
          <h2 className="text-2xl font-bold text-[#263C3A]">Report Submitted</h2>
          <p className="text-sm text-[#74817B]">
            Thank you for helping keep CANIGO trustworthy. Our moderation team will investigate your report for <strong>The Garden Café</strong>. You will receive an update in Notifications when action is taken.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('/explore')}
              className="px-6 py-2.5 bg-forest text-white text-sm font-bold rounded-xl hover:bg-forest-hover"
            >
              Back to Explore
            </button>
          </div>
        </div>
      ) : (
        /* Main Layout: Form + Process Sidebar (PDF Page 8) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form Left Column */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs space-y-6">
            
            {/* Select What to Report */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#263C3A]">
                Select What to Report
              </h2>
              <p className="text-xs sm:text-sm text-[#74817B] mt-0.5">
                Tell us what seems wrong with this contribution.
              </p>

              {/* 4 Cards in a Row / 2x2 on Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                {reportOptions.map((opt) => {
                  const isSelected = selectedReason === opt.title;
                  return (
                    <div
                      key={opt.title}
                      onClick={() => setSelectedReason(opt.title)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-forest bg-[#EDF4EA]/40 ring-1 ring-forest'
                          : 'border-[#E5E5DC] hover:bg-[#F7F6F0]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-gray-100">
                            {opt.icon}
                          </div>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-forest bg-forest' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#263C3A]">
                          {opt.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#74817B] mt-2 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Describe the Issue * */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#263C3A] mb-1">
                Describe the Issue <span className="text-terracotta">*</span>
              </label>
              <textarea
                rows={4}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is incorrect or misleading. Be specific and honest."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
                required
              />
              <div className="flex justify-end text-[11px] text-gray-400 mt-1">
                {description.length}/500
              </div>
            </div>

            {/* Add Evidence (Optional) */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#263C3A] mb-1">
                Add Evidence (Optional)
              </label>
              <p className="text-xs text-[#74817B] mb-2">
                You can upload additional photos or documents to support your report.
              </p>

              <div className="h-28 rounded-2xl border-2 border-dashed border-[#80A995] hover:border-forest bg-[#EDF4EA]/20 hover:bg-[#EDF4EA]/40 flex flex-col items-center justify-center text-center p-3 transition-colors cursor-pointer">
                <UploadCloud className="w-7 h-7 text-forest mb-1" />
                <span className="text-xs font-bold text-forest">Upload Photos / Files</span>
                <span className="text-[10px] text-[#74817B]">PNG, JPG, or PDF (up to 10 MB each)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5DC]">
              <button
                type="button"
                onClick={() => navigateTo('/explore')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#74817B] hover:text-[#263C3A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="px-6 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-40 shadow-xs"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </button>
            </div>

          </form>

          {/* Right Sidebar: About Report Process & Dispute */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* About the Report Process Card */}
            <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-forest" />
                <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                  About the Report Process
                </h3>
              </div>

              {/* Stepper Vertical List */}
              <div className="space-y-3.5 text-xs sm:text-sm relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DDEBE1]">
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  <p className="font-bold text-[#263C3A]">Submit Report</p>
                  <p className="text-xs text-[#74817B]">Share what's wrong with the contribution.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  <p className="font-bold text-[#263C3A]">Review by Moderators</p>
                  <p className="text-xs text-[#74817B]">Our team and community will verify the report.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  <p className="font-bold text-[#263C3A]">Action Taken</p>
                  <p className="text-xs text-[#74817B]">The contribution will be updated, removed or marked as disputed.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">4</span>
                  <p className="font-bold text-[#263C3A]">Get Notified</p>
                  <p className="text-xs text-[#74817B]">You'll receive an update on the decision.</p>
                </div>
              </div>
            </div>

            {/* Dispute a Decision Card (PDF Page 8) */}
            <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                  Dispute a Decision?
                </h3>
              </div>

              <p className="text-xs text-[#74817B] leading-relaxed">
                If you believe your contribution was incorrectly rejected or flagged, you can raise a dispute with additional information.
              </p>

              <button
                type="button"
                onClick={() => alert('Dispute workflow opened. You can attach on-site measurements and timestamped photos.')}
                className="w-full py-2.5 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-forest" />
                Raise a Dispute
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
