import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import { ExternalLink, Layers, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  projects: Project[];
  selectedSector?: string;
  onSectorChange?: (sector: string) => void;
  height?: string;
}

const createCustomIcon = (status: string, sector: string) => {
  let bgColor = '#2563EB'; // Royal Blue default
  if (status === 'Completed') bgColor = '#10B981'; // Green
  else if (status === 'Delayed') bgColor = '#F59E0B'; // Amber

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${bgColor}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -38]
  });
};

export const GISMap: React.FC<Props> = ({ 
  projects, 
  selectedSector = 'All', 
  onSectorChange,
  height = '540px' 
}) => {
  const [internalSector, setInternalSector] = useState(selectedSector);
  const activeSector = onSectorChange ? selectedSector : internalSector;

  const handleFilter = (sec: string) => {
    if (onSectorChange) onSectorChange(sec);
    else setInternalSector(sec);
  };

  const sectors = ['All', 'Roads', 'Schools', 'Hospitals', 'Water', 'Infrastructure'];

  const filteredProjects = projects.filter((p) => {
    if (activeSector === 'All') return true;
    return p.sector === activeSector;
  });

  // Default center: Karnataka, India
  const centerPosition: [number, number] = [13.2, 76.8];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden flex flex-col">
      
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              GIS Infrastructure Map
            </h3>
            <p className="text-[10px] text-slate-400">
              OpenStreetMap Geotagged Works &bull; Showing {filteredProjects.length} Projects
            </p>
          </div>
        </div>

        {/* Sector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => handleFilter(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSector === sec
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div style={{ height }} className="w-full relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredProjects.map((p) => {
            if (!p.locationLat || !p.locationLng) return null;
            const icon = createCustomIcon(p.status, p.sector);

            return (
              <Marker
                key={p.id}
                position={[p.locationLat, p.locationLng]}
                icon={icon}
              >
                <Popup className="fundchain-custom-popup">
                  <div className="p-1 min-w-[220px] max-w-[280px]">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-royal-700 bg-royal-50 px-1.5 py-0.5 rounded border border-royal-200">
                        {p.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {p.sector}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-navy-900 leading-snug line-clamp-2">
                      {p.title}
                    </h4>

                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                      {p.locationAddress}, {p.district}
                    </p>

                    <div className="my-2 p-2 rounded bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-1 text-center">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">Budget</div>
                        <div className="text-xs font-black text-navy-900">
                          ₹{(p.totalBudget / 10000000).toFixed(2)} Cr
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">Progress</div>
                        <div className="text-xs font-black text-emerald-600">
                          {p.physicalProgress}%
                        </div>
                      </div>
                    </div>

                    {p.financialProgress > (p.physicalProgress + 15) && (
                      <div className="mb-2 p-1.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-medium leading-tight">
                        Review Required: Financial progress exceeds physical progress.
                      </div>
                    )}

                    <Link
                      to={`/project/${p.id}`}
                      className="w-full py-1.5 px-2 rounded-lg bg-navy-900 hover:bg-royal-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 text-center transition-colors"
                    >
                      View Full Audit Trail
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Map Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span> Active / Ongoing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Delayed / Audit Review
          </span>
        </div>
        <div className="text-[10px] text-slate-500">
          Click any pin to inspect verified tranche records
        </div>
      </div>

    </div>
  );
};
