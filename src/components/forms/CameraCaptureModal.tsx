import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, FlipHorizontal } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCapture: (photoDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState(false);

  // Start camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.warn('Video play error', e));
      }
      setIsLoading(false);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera permissions in your browser or use the file upload option.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device was found on this system.');
      } else {
        setError('Unable to access camera: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (!stream) {
      startCamera();
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onPhotoCapture(capturedImage);
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-[#E5E5DC] max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#EDF4EA] border-b border-[#DDEBE1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#263C3A]">Capture Live Photo</h3>
              <p className="text-[11px] text-[#74817B]">Take a clear photo of the entrance, ramp, or facility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#74817B] hover:text-[#263C3A] hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport or Snapshot Preview */}
        <div className="relative bg-black flex-1 min-h-[320px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-white space-y-3 max-w-md">
              <AlertCircle className="w-10 h-10 text-terracotta mx-auto" />
              <p className="text-sm font-semibold">{error}</p>
              <div className="pt-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-white text-forest text-xs font-bold rounded-xl hover:bg-gray-100"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            /* Review captured photo */
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain max-h-[60vh]"
            />
          ) : (
            /* Live camera video */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[60vh]"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-forest" />
                  <span>Connecting camera...</span>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Modal Controls Footer */}
        <div className="p-4 bg-white border-t border-[#E5E5DC] flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={retakePhoto}
                className="px-4 py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#74817B]" />
                Retake
              </button>
              <button
                type="button"
                onClick={confirmPhoto}
                className="px-6 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                Use Photo
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={!!error}
                className="p-2.5 bg-[#F7F6F0] hover:bg-[#EDF4EA] text-[#263C3A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                title="Switch Camera (Front/Back)"
              >
                <FlipHorizontal className="w-4 h-4 text-forest" />
                <span className="hidden sm:inline">Flip</span>
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={takeSnapshot}
                disabled={!!error || isLoading}
                className="px-6 py-3 bg-forest hover:bg-forest-hover text-white rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-floating transition-all active:scale-95 disabled:opacity-40"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white ring-2 ring-forest" />
                Capture Photo
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#74817B] hover:text-[#263C3A]"
              >
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
