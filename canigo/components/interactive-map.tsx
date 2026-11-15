'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Layers, MapPin, Navigation } from 'lucide-react';
import type { Venue } from '@/lib/types';

interface InteractiveMapProps {
  venues: Venue[];
  selectedVenueId?: string;
  onSelectVenue?: (venue: Venue) => void;
}

export default function InteractiveMap({ venues, selectedVenueId, onSelectVenue }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Ensure Leaflet CSS is loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const scriptId = 'leaflet-js';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

      // Default center: average of venues or Bengaluru center
      const defaultLat = venues[0]?.lat || 12.9718;
      const defaultLon = venues[0]?.lon || 77.5947;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLon],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    if (!(window as any).L) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        script.addEventListener('load', initMap);
      }
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync markers when venues change or map becomes ready
  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map || !mapReady) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: any) => marker.remove());
    markersRef.current = {};

    const bounds: [number, number][] = [];

    venues.forEach((venue, index) => {
      const lat = venue.lat || 12.9718 + (index * 0.01);
      const lon = venue.lon || 77.5947 + (index * 0.01);
      bounds.push([lat, lon]);

      // Custom HTML pin icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #087F7B;
            color: white;
            font-weight: 800;
            font-size: 12px;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid white;
          ">
            <span style="transform: rotate(45deg);">${index + 1}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '200px';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="font-family: inherit;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #087F7B; letter-spacing: 0.1em;">${venue.category}</span>
          <h4 style="margin: 4px 0 2px; font-size: 15px; font-weight: 800; color: #0C1E3C;">${venue.name}</h4>
          <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">${venue.address}</p>
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; background: #EFF8F6; color: #087F7B; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">
              ${venue.claims.length} access claims
            </span>
          </div>
          <a href="/venues/${venue.id}" style="
            display: block;
            background: #0C1E3C;
            color: white;
            text-align: center;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
          ">View Venue Details</a>
        </div>
      `;

      const marker = L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectVenue) onSelectVenue(venue);
      });

      markersRef.current[venue.id] = marker;
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [venues, mapReady, onSelectVenue]);

  // Focus on selected venue
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVenueId || !markersRef.current[selectedVenueId]) return;

    const marker = markersRef.current[selectedVenueId];
    marker.openPopup();
    map.panTo(marker.getLatLng(), { animate: true, duration: 0.5 });
  }, [selectedVenueId]);

  return (
    <div className="relative h-full w-full min-h-[520px]">
      <div ref={mapContainerRef} className="h-full w-full min-h-[520px] rounded-r-2xl z-0" />
      
      {/* Live OSM indicator */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <Navigation className="h-3.5 w-3.5 text-teal" />
        <span>Live OpenStreetMap</span>
      </div>

      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-teal border-t-transparent" />
            <span className="text-xs font-bold text-slate-500">Loading OpenStreetMap...</span>
          </div>
        </div>
      )}
    </div>
  );
}
