import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Recenter component
const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Map click handler component to capture clicks and taps anywhere on OSM
const MapClickHandler: React.FC<{ onPin: (lat: number, lng: number) => void }> = ({ onPin }) => {
  useMapEvents({
    click(e) {
      onPin(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Custom Forest Green Pin Marker for the selected location
const pinIcon = L.divIcon({
  className: 'custom-pin-marker',
  html: `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
    ">
      <div style="
        background-color: #155E4B;
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(21, 94, 75, 0.4);
      ">
        <svg style="transform: rotate(45deg); width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div style="
        width: 10px;
        height: 4px;
        background-color: rgba(0,0,0,0.3);
        border-radius: 50%;
        margin-top: 2px;
      "></div>
    </div>
  `,
  iconSize: [38, 44],
  iconAnchor: [19, 44],
});

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  className = "h-64 sm:h-80 w-full"
}) => {
  const center: [number, number] = [latitude, longitude];

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#E5E5DC] shadow-xs ${className}`}>
      <MapContainer
        center={center}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-full w-full cursor-crosshair"
      >
        <ChangeView center={center} />
        
        {/* OpenStreetMap standard tiles (No API key needed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapClickHandler onPin={onLocationChange} />

        {/* Selected Location Pin Marker */}
        <Marker 
          position={center} 
          icon={pinIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onLocationChange(position.lat, position.lng);
            }
          }}
        />
      </MapContainer>

      {/* Floating instruction pill */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:right-auto z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5E5DC] text-xs font-semibold text-[#263C3A] shadow-xs pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
        <span>Tap or click anywhere on the map to pin exact place / entrance</span>
      </div>
    </div>
  );
};
