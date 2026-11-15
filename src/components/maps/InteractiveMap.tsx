import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../contexts/AppContext';
import { Venue } from '../../types';
import { Navigation, Star, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

const MapViewport: React.FC<{
  venues: Venue[];
  activeVenueId?: string | null;
  zoomLevel: number;
}> = ({ venues, activeVenueId, zoomLevel }) => {
  const map = useMap();
  const previousVenueIds = useRef('');
  const previousActiveVenueId = useRef<string | null | undefined>();
  const venueIds = venues.map((venue) => venue.id).join('|');

  useEffect(() => {
    map.invalidateSize();

    const positions = venues.map((venue) => [venue.coordinates.lat, venue.coordinates.lng] as [number, number]);
    if (venueIds !== previousVenueIds.current) {
      previousVenueIds.current = venueIds;
      previousActiveVenueId.current = activeVenueId;
      if (positions.length > 1) {
        map.fitBounds(L.latLngBounds(positions), { padding: [24, 24], maxZoom: zoomLevel });
      } else if (positions.length === 1) {
        map.setView(positions[0], zoomLevel);
      }
      return;
    }

    if (activeVenueId !== previousActiveVenueId.current) {
      previousActiveVenueId.current = activeVenueId;
      const activeVenue = venues.find((venue) => venue.id === activeVenueId);
      if (activeVenue) {
        map.flyTo([activeVenue.coordinates.lat, activeVenue.coordinates.lng], zoomLevel, { duration: 0.4 });
      }
    }
  }, [activeVenueId, map, venueIds, venues, zoomLevel]);

  return null;
};

const MapClickHandler: React.FC<{ onMapClick?: () => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: () => onMapClick?.(),
  });
  return null;
  return null;
};

// SVG Markers Generator for Accessible venues
const createCustomIcon = (type: 'verified' | 'cafe' | 'hospital' | 'mall' | 'warning' | 'beach' | 'user') => {
  let bgColor = '#155E4B'; // Forest Green
  let svgContent = `<path d="M12 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm-1.5 7h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-3.5h1.2l1.6 3.8A4.98 4.98 0 0 0 11 18.5a5 5 0 1 0 5-5c-.4 0-.79.05-1.16.14l-1.3-3.1a2 2 0 0 0-1.84-1.24h-.2zM16 16.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="white"/>`;

  if (type === 'cafe') {
    bgColor = '#155E4B';
    svgContent = `<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  } else if (type === 'hospital') {
    bgColor = '#D64545';
    svgContent = `<path d="M12 5v14M5 12h14" stroke="white" stroke-width="3" stroke-linecap="round"/>`;
  } else if (type === 'warning') {
    bgColor = '#D6A34B';
    svgContent = `<path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  } else if (type === 'user') {
    return L.divIcon({
      className: 'user-pin-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(21, 94, 75, 0.2); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 16px; height: 16px; background-color: #155E4B; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }

  return L.divIcon({
    className: 'custom-canigo-marker',
    html: `
      <div style="
        background-color: ${bgColor}; 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.25); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        transition: transform 0.2s ease;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16">
          ${svgContent}
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

interface InteractiveMapProps {
  venuesList?: Venue[];
  activeVenueId?: string | null;
  onSelectVenue?: (venue: Venue) => void;
  showRoute?: boolean;
  className?: string;
  zoomLevel?: number;
  onMapClick?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  venuesList,
  activeVenueId,
  onSelectVenue,
  showRoute = false,
  className = "h-[500px] w-full",
  zoomLevel = 13,
  onMapClick,
}) => {
  const { venues, selectVenue, navigateTo, activeRoutePlan } = useApp();
  const list = venuesList || venues;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#E5E5DC] shadow-xs ${className}`}>
      <MapContainer
        center={[13.0600, 80.2500]}
        zoom={zoomLevel}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <MapViewport venues={list} activeVenueId={activeVenueId} zoomLevel={zoomLevel} />
        <MapClickHandler onMapClick={onMapClick} />

        {/* Pure OpenStreetMap standard tiles - 100% free, open, and requires no API key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* User Location Pulse */}
        <Marker position={[13.0600, 80.2500]} icon={createCustomIcon('user')}>
          <Popup>
            <div className="p-2 text-center text-xs font-semibold text-[#263C3A]">
              Your Current Location (Chennai)
            </div>
          </Popup>
        </Marker>

        {/* Route Geometry Line if Route is Active */}
        {showRoute && activeRoutePlan && (
          <Polyline
            positions={activeRoutePlan.coordinates}
            pathOptions={{
              color: '#155E4B',
              weight: 5,
              opacity: 0.85,
              dashArray: '2, 6',
            }}
          />
        )}

        {/* Venue Markers */}
        {list.map((venue) => {
          let iconType: 'verified' | 'cafe' | 'hospital' | 'mall' | 'warning' | 'beach' = 'verified';
          if (venue.category === 'Restaurant' || venue.category === 'Cafes') iconType = 'cafe';
          else if (venue.category === 'Hospital') iconType = 'hospital';
          else if (venue.verificationStatus === 'Reported' || venue.verificationStatus === 'Disputed') iconType = 'warning';

          return (
            <Marker
              key={venue.id}
              position={[venue.coordinates.lat, venue.coordinates.lng]}
              icon={createCustomIcon(iconType)}
              eventHandlers={{
                click: () => {
                  if (onSelectVenue) onSelectVenue(venue);
                  selectVenue(venue);
                }
              }}
            >
              {/* Floating Popup Card matching Page 12 */}
              <Popup className="canigo-venue-popup">
                <div className="w-64 sm:w-72 p-3 bg-white rounded-xl">
                  <div className="flex gap-2.5">
                    <img
                      src={venue.heroImage}
                      alt={venue.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-sm text-[#263C3A] truncate">{venue.name}</h4>
                        {venue.verificationStatus === 'Verified' && (
                          <CheckCircle className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#74817B] truncate">
                        {venue.categoryLabel} • {venue.distance}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] font-semibold text-[#263C3A]">
                        <Star className="w-3 h-3 fill-[#D6A34B] text-[#D6A34B]" />
                        <span>{venue.rating} ({venue.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Accessibility feature chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-gray-100 text-[10px] font-medium text-forest">
                    {venue.features.wheelchairAccess && (
                      <span className="bg-[#EDF4EA] px-2 py-0.5 rounded-full">✓ Wheelchair Access</span>
                    )}
                    {venue.features.stepFree && (
                      <span className="bg-[#EDF4EA] px-2 py-0.5 rounded-full">✓ Ramp</span>
                    )}
                    {venue.features.accessibleRestroom && (
                      <span className="bg-[#EDF4EA] px-2 py-0.5 rounded-full">✓ Accessible Restroom</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-1">
                    <button
                      onClick={() => navigateTo(`/venues/${venue.slug}`)}
                      className="flex-1 py-1.5 px-2 bg-white border border-[#E5E5DC] hover:bg-[#F7F6F0] text-[#263C3A] text-xs font-semibold rounded-lg text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigateTo('/map')}
                      className="flex-1 py-1.5 px-2 bg-forest hover:bg-forest-hover text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3" /> Get Route
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
