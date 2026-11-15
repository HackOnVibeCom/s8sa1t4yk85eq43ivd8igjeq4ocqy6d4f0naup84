import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { LocationPickerMap } from '../components/maps/LocationPickerMap';
import { CameraCaptureModal } from '../components/forms/CameraCaptureModal';
import { 
  Building2, 
  MapPin, 
  Camera, 
  Check, 
  X, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  Lightbulb, 
  CheckCircle2, 
  Edit2, 
  UploadCloud, 
  FileCheck,
  LocateFixed,
  Navigation,
  Sparkles
} from 'lucide-react';

export const ContributePage: React.FC = () => {
  const { navigateTo, addContribution } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [placeName, setPlaceName] = useState('The Garden Café');
  const [placeType, setPlaceType] = useState('Restaurant');
  const [locationAddress, setLocationAddress] = useState('Cathedral Road, Chennai, Tamil Nadu - 600086');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 13.0458,
    lng: 80.2520,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [showOsmPicker, setShowOsmPicker] = useState(true);

  const [contributorNote, setContributorNote] = useState('Visited today. The entrance has a wheelchair ramp with handrail. The seating area is spacious and easily accessible.');

  // Camera & Device Upload state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ id: string; url: string; category: string }>>([
    {
      id: 'p-1',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
      category: 'Entrance'
    },
    {
      id: 'p-2',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80',
      category: 'Lift'
    },
    {
      id: 'p-3',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      category: 'Restroom'
    }
  ]);

  const [accessibilityChecks, setAccessibilityChecks] = useState({
    entranceStepFree: true,
    rampWithRail: true,
    elevatorOperational: true,
    accessibleRestroom: true,
    seatingSpacious: true,
    reservedParking: false,
    tactileAid: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Remove photo handler
  const removePhoto = (id: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Live Camera capture handler
  const handlePhotoCaptured = (photoDataUrl: string) => {
    if (uploadedPhotos.length >= 10) {
      alert('Maximum of 10 photos allowed.');
      return;
    }
    const newPhoto = {
      id: `captured-${Date.now()}`,
      url: photoDataUrl,
      category: uploadedPhotos.length === 0 ? 'Entrance' : 'Ramp'
    };
    setUploadedPhotos(prev => [...prev, newPhoto]);
  };

  // Device File Upload handler (reads files as Data URLs)
  const handleDeviceFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      if (uploadedPhotos.length + index >= 10) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto = {
            id: `file-${Date.now()}-${index}`,
            url: event.target.result as string,
            category: 'Entrance'
          };
          setUploadedPhotos(prev => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be chosen again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Location Pinning on OpenStreetMap (for people with disabilities who cannot type)
  const handleMapLocationChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    const formatted = `Pinned Location (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E) - Chennai`;
    setLocationAddress(formatted);
  };

  // Geolocation API: Use My Current Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationAddress(`Current GPS Position (${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E)`);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        alert('Could not retrieve current location. Please tap directly on the map to pin your location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContribution({
      venueId: 'venue-1',
      venueName: placeName,
      venueCategory: placeType,
      venueCity: 'Chennai',
      contributorName: 'Kanish Mathew M',
      contributorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      note: contributorNote,
      photos: uploadedPhotos.map(p => ({
        id: p.id,
        url: p.url,
        category: p.category
      })),
      claim: 'Step-free entrance and accessible seating confirmed'
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hidden file input for device upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleDeviceFiles}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Live Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onPhotoCapture={handlePhotoCaptured}
      />

      {/* Page Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-forest" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
            Contribute a Place
          </h1>
          <p className="text-xs sm:text-sm text-[#74817B]">
            Share real accessibility information and help make places more inclusive for everyone.
          </p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto py-2">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold">
          
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </span>
            <span className={step === 1 ? 'text-forest font-bold' : 'text-[#74817B]'}>
              Place Details
            </span>
          </div>

          <div className="w-6 sm:w-10 h-0.5 bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </span>
            <span className={step === 2 ? 'text-forest font-bold' : 'text-[#74817B]'}>
              Upload Photos
            </span>
          </div>

          <div className="w-6 sm:w-10 h-0.5 bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'text-forest font-bold' : 'text-[#74817B]'}>
              Accessibility Info
            </span>
          </div>

          <div className="w-6 sm:w-10 h-0.5 bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 4 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </span>
            <span className={step === 4 ? 'text-forest font-bold' : 'text-[#74817B]'}>
              Review & Submit
            </span>
          </div>

        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl border border-[#E5E5DC] p-8 text-center max-w-2xl mx-auto space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center mx-auto">
            <FileCheck className="w-8 h-8 text-forest" />
          </div>
          <h2 className="text-2xl font-bold text-[#263C3A]">Contribution Submitted!</h2>
          <p className="text-sm text-[#74817B]">
            Thank you for contributing to CANIGO! Your observation for <strong>{placeName}</strong> has been queued for verification. Our AI and community reviewers will review your photos and details shortly.
          </p>
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigateTo('/profile')}
              className="px-5 py-2.5 bg-forest text-white text-sm font-bold rounded-xl hover:bg-forest-hover"
            >
              View in My Contributions
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
              }}
              className="px-5 py-2.5 bg-white border border-[#E5E5DC] text-[#263C3A] text-sm font-semibold rounded-xl hover:bg-[#F7F6F0]"
            >
              Contribute Another
            </button>
          </div>
        </div>
      ) : (
        /* Main Layout: Form + Right Sidebar Tips */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Main Form Container */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs space-y-6">
            
            {/* STEP 1: Place Details & Location Pinning & Photos Preview */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#263C3A]">Place Details</h2>
                  <p className="text-xs sm:text-sm text-[#74817B]">
                    Basic information about the place you are adding. You can pin directly on the map without typing.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Place Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#263C3A] mb-1">
                      Place Name <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      placeholder="e.g., The Garden Café"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E5DC] rounded-xl text-[#263C3A] focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>

                  {/* Place Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#263C3A] mb-1">
                      Place Type <span className="text-terracotta">*</span>
                    </label>
                    <select
                      value={placeType}
                      onChange={(e) => setPlaceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E5DC] rounded-xl text-[#263C3A] focus:outline-none focus:ring-2 focus:ring-forest"
                    >
                      <option value="Restaurant">Restaurant</option>
                      <option value="Cafes">Café</option>
                      <option value="Shopping Mall">Shopping Mall</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Public Place">Public Place / Park</option>
                      <option value="Educational">Educational Institute</option>
                    </select>
                  </div>

                  {/* Location & OSM Pinning section (Accessible for disabilities) */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-[#263C3A]">
                        Location / Entrance Pinning <span className="text-terracotta">*</span>
                      </label>

                      {/* Accessible Geolocation Button: Use My Location */}
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF4EA] hover:bg-[#DDEBE1] text-forest rounded-full text-xs font-bold transition-colors border border-[#C3D8CE]"
                      >
                        <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
                      </button>
                    </div>

                    {/* Address Text Field */}
                    <div className="flex items-center gap-2 px-3.5 py-2.5 border border-[#E5E5DC] rounded-xl bg-white shadow-2xs">
                      <MapPin className="w-4 h-4 text-forest flex-shrink-0" />
                      <input
                        type="text"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="Click map below or type address..."
                        className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-[#263C3A]"
                      />
                    </div>

                    {/* Accessibility Note for Disabled Users */}
                    <div className="p-2.5 bg-[#EDF4EA]/60 rounded-xl border border-[#C3D8CE] flex items-center justify-between text-xs text-forest">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        <span><strong>Accessibility Feature:</strong> Click or tap anywhere on the OpenStreetMap below to drop a pin. No typing needed!</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold hidden sm:inline">
                        {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
                      </span>
                    </div>

                    {/* Interactive OSM Pinning Map */}
                    <div className="pt-1">
                      <LocationPickerMap
                        latitude={coordinates.lat}
                        longitude={coordinates.lng}
                        onLocationChange={handleMapLocationChange}
                        className="h-60 sm:h-72 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Photos Section with BOTH Live Camera & Device Upload */}
                <div className="pt-4 border-t border-[#E5E5DC] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#263C3A]">Upload Photos</h3>
                      <p className="text-xs text-[#74817B]">
                        Add clear and recent photos. Use live camera capture or upload files from your device.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#74817B]">
                      {uploadedPhotos.length}/10 photos added
                    </span>
                  </div>

                  {/* Dual Action Buttons: Live Camera Capture + Upload from Device */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Option 1: Live Camera Capturing */}
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="p-3.5 rounded-2xl border-2 border-[#155E4B] bg-[#EDF4EA] hover:bg-[#DDEBE1] flex items-center justify-center gap-2.5 text-forest font-bold text-xs sm:text-sm transition-all shadow-xs group"
                    >
                      <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span>Capture with Live Camera</span>
                    </button>

                    {/* Option 2: Upload from Device */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3.5 rounded-2xl border-2 border-dashed border-[#80A995] bg-white hover:bg-[#F7F6F0] flex items-center justify-center gap-2.5 text-[#263C3A] font-bold text-xs sm:text-sm transition-all shadow-xs group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#F7F6F0] text-forest flex items-center justify-center group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <span>Upload from Device / Files</span>
                    </button>
                  </div>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {uploadedPhotos.map((photo) => (
                      <div key={photo.id} className="relative rounded-xl overflow-hidden border border-[#E5E5DC] group h-28">
                        <img
                          src={photo.url}
                          alt={photo.category}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-xs text-forest text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          {photo.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DC]">
                  <button
                    type="button"
                    onClick={() => navigateTo('/explore')}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#74817B] hover:text-[#263C3A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Next: Categorize Photos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Photo Organization & Categorization */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#263C3A]">Tag Photo Categories</h2>
                  <p className="text-xs sm:text-sm text-[#74817B]">
                    Tag each photo with its accessibility component to help our AI and reviewers corroborate evidence.
                  </p>
                </div>

                <div className="space-y-4">
                  {uploadedPhotos.map((photo, i) => (
                    <div key={photo.id} className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC] flex items-center gap-4">
                      <img src={photo.url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <label className="text-xs font-bold text-[#263C3A] block mb-1">
                          Photo #{i + 1} Feature Category:
                        </label>
                        <select
                          value={photo.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setUploadedPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, category: val } : p));
                          }}
                          className="px-3 py-1.5 bg-white border border-[#E5E5DC] rounded-lg text-xs font-medium text-[#263C3A] focus:outline-none"
                        >
                          <option value="Entrance">Entrance & Threshold</option>
                          <option value="Ramp">Ramp & Railing</option>
                          <option value="Lift">Lift / Elevator</option>
                          <option value="Restroom">Accessible Restroom</option>
                          <option value="Seating">Wheelchair Seating Area</option>
                          <option value="Parking">Accessible Parking Bay</option>
                          <option value="Tactile Paving">Tactile Ground Indicator</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DC]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#74817B] hover:text-[#263C3A] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Next: Accessibility Info
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Accessibility Info Checklist */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#263C3A]">Accessibility Information</h2>
                  <p className="text-xs sm:text-sm text-[#74817B]">
                    Confirm what you observed during your visit. Leave unchecked if unknown.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilityChecks.entranceStepFree}
                      onChange={(e) => setAccessibilityChecks({ ...accessibilityChecks, entranceStepFree: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#263C3A]">Step-free entrance</p>
                      <p className="text-[11px] text-[#74817B]">No threshold steps or lip</p>
                    </div>
                  </label>

                  <label className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilityChecks.rampWithRail}
                      onChange={(e) => setAccessibilityChecks({ ...accessibilityChecks, rampWithRail: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#263C3A]">Ramp with handrail</p>
                      <p className="text-[11px] text-[#74817B]">Gentle slope (&lt; 1:12)</p>
                    </div>
                  </label>

                  <label className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilityChecks.elevatorOperational}
                      onChange={(e) => setAccessibilityChecks({ ...accessibilityChecks, elevatorOperational: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#263C3A]">Lift / Elevator operational</p>
                      <p className="text-[11px] text-[#74817B]">Wide door with low buttons</p>
                    </div>
                  </label>

                  <label className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilityChecks.accessibleRestroom}
                      onChange={(e) => setAccessibilityChecks({ ...accessibilityChecks, accessibleRestroom: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#263C3A]">Accessible Restroom</p>
                      <p className="text-[11px] text-[#74817B]">Grab rails & wide turn radius</p>
                    </div>
                  </label>

                  <label className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilityChecks.seatingSpacious}
                      onChange={(e) => setAccessibilityChecks({ ...accessibilityChecks, seatingSpacious: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#263C3A]">Wheelchair-friendly seating</p>
                      <p className="text-[11px] text-[#74817B]">Moveable chairs, wide aisle</p>
                    </div>
                  </label>

                  <label className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilityChecks.reservedParking}
                      onChange={(e) => setAccessibilityChecks({ ...accessibilityChecks, reservedParking: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#263C3A]">Reserved accessible parking</p>
                      <p className="text-[11px] text-[#74817B]">Designated marked bays</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263C3A] mb-1">
                    Contributor's Notes & Observations
                  </label>
                  <textarea
                    rows={3}
                    value={contributorNote}
                    onChange={(e) => setContributorNote(e.target.value)}
                    placeholder="Share any useful observations regarding slope, door width, lighting or staff support..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E5E5DC] rounded-xl text-[#263C3A] focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DC]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#74817B] hover:text-[#263C3A] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Next: Review & Submit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[#263C3A]">Review Your Contribution</h2>
                  <p className="text-xs sm:text-sm text-[#74817B]">
                    Please verify that all information is honest, accurate, and reflects actual on-site observations.
                  </p>
                </div>

                <div className="bg-[#F7F6F0] rounded-2xl p-4 border border-[#E5E5DC] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-[#263C3A]">{placeName}</h3>
                      <p className="text-xs text-[#74817B]">{placeType} • {locationAddress}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-forest hover:underline">
                      Edit
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#E5E5DC] text-xs text-[#263C3A]">
                    <p className="font-semibold mb-1">Attached Photographs ({uploadedPhotos.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {uploadedPhotos.map(p => (
                        <img key={p.id} src={p.url} alt="" className="w-16 h-14 rounded-lg object-cover border border-white shadow-2xs" />
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E5DC] text-xs text-[#74817B]">
                    <p className="font-semibold text-[#263C3A]">Notes:</p>
                    <p className="italic">{contributorNote}</p>
                  </div>
                </div>

                <div className="p-3 bg-[#EDF4EA] rounded-xl border border-[#C3D8CE] text-xs text-forest flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    By submitting, you declare that these observations represent genuine visits and are provided in good faith to assist travelers with accessibility requirements.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5DC]">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#74817B] hover:text-[#263C3A] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Submit Contribution
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Contribution Tips & Verification Process (Page 4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Contribution Tips Card */}
            <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                  Contribution Tips
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#263C3A]">
                <div className="flex items-start gap-2.5">
                  <Camera className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Take clear and recent photos.</p>
                    <p className="text-xs text-[#74817B]">Use live camera or upload entrance, ramps, and restroom photos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Pin location directly on map.</p>
                    <p className="text-xs text-[#74817B]">If typing is difficult, tap the map or use current GPS.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Be accurate and honest.</p>
                    <p className="text-xs text-[#74817B]">Share what you actually observed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Add useful details.</p>
                    <p className="text-xs text-[#74817B]">For example, ramp slope, lift availability or seating space.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Verification Process Card */}
            <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-forest" />
                <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                  Our Verification Process
                </h3>
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {/* Stepper Vertical List */}
              <div className="space-y-3 text-xs sm:text-sm text-[#74817B] relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DDEBE1]">
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-forest border-2 border-white ring-1 ring-forest flex items-center justify-center text-[8px] text-white">✓</span>
                  <p className="font-medium text-[#263C3A]">You submit the information.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#DDEBE1] border-2 border-white ring-1 ring-[#80A995]" />
                  <p className="font-medium text-[#263C3A]">Our AI reviews the photos and details.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#DDEBE1] border-2 border-white ring-1 ring-[#80A995]" />
                  <p className="font-medium text-[#263C3A]">The community can verify, comment and provide additional evidence.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#DDEBE1] border-2 border-white ring-1 ring-[#80A995]" />
                  <p className="font-medium text-[#263C3A]">The place gets a verification status (e.g., Reported, Community Verified, Verified).</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
