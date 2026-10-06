import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  MapPin, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building2
} from 'lucide-react';

const createCustomIcon = (status: string, sector: string) => {
  let bgColor = '#2563EB'; // Royal Blue
  if (status === 'Completed') bgColor = '#10B981'; // Green
  else if (status === 'Delayed') bgColor = '#F59E0B'; // Amber

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="44">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${bgColor}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [30, 44],
    iconAnchor: [15, 44],
    popupAnchor: [0, -40]
  });
};

export const GISMapPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to load GIS projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const sectors = ['All', 'Roads', 'Schools', 'Hospitals', 'Water', 'Infrastructure'];
  const statuses = ['All', 'Completed', 'Ongoing', 'Delayed'];

  const filteredProjects = projects.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = p.title.toLowerCase().includes(q) ||
                    p.code.toLowerCase().includes(q) ||
                    p.locationAddress.toLowerCase().includes(q) ||
                    p.district.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedSector !== 'All' && p.sector !== selectedSector) return false;

    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Ongoing' && p.status !== 'Active') return false;
      if (selectedStatus !== 'Ongoing' && p.status !== selectedStatus) return false;
    }

    return true;
  });

  const center: [number, number] = [13.25, 76.85];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              OpenStreetMap Geospatial Layer
            </span>
            <span className="text-xs text-slate-500">
              {filteredProjects.length} Infrastructure Sites Geotagged
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            GIS Public Infrastructure Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize state civic works, inspect physical progress on-site, and audit disbursements by region.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Ongoing
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Delayed / Review
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search map by name, code, district, or address..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Sector Filter Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 hidden sm:inline">Sector:</span>
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSector(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSector === s
                    ? 'bg-royal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 hidden sm:inline">Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Map View */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden h-[640px] relative z-0">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={7}
              scrollWheelZoom={true}
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
                    eventHandlers={{
                      click: () => setSelectedProject(p)
                    }}
                  >
                    <Popup>
                      <div className="p-1 min-w-[220px] max-w-[280px]">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-royal-700 bg-royal-50 px-1.5 py-0.5 rounded border border-royal-200">
                            {p.code}
                          </span>
                          <span className="text-slate-500 uppercase">{p.sector}</span>
                        </div>

                        <h4 className="font-bold text-xs text-navy-900 line-clamp-2">
                          {p.title}
                        </h4>

                        <div className="my-2 p-2 rounded bg-slate-50 border border-slate-200 grid grid-cols-2 gap-1 text-center">
                          <div>
                            <div className="text-[9px] uppercase font-bold text-slate-400">Budget</div>
                            <div className="text-xs font-bold text-navy-900">
                              ₹{(p.totalBudget / 10000000).toFixed(2)} Cr
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-bold text-slate-400">Physical Progress</div>
                            <div className="text-xs font-bold text-emerald-600">
                              {p.physicalProgress}%
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/project/${p.id}`}
                          className="w-full py-1.5 rounded-lg bg-navy-900 hover:bg-royal-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          View Full Audit <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Selected Project Quick Inspector Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-card p-5 flex flex-col justify-between h-[640px] overflow-y-auto space-y-4">
          {selectedProject ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-royal-600 bg-royal-50 px-2 py-0.5 rounded border border-royal-200">
                  {selectedProject.code}
                </span>
                <h3 className="font-bold text-sm text-navy-900 mt-2 leading-snug">
                  {selectedProject.title}
                </h3>
                <span className="text-xs text-slate-500 block mt-1">
                  {selectedProject.locationAddress}, {selectedProject.district}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sector:</span>
                  <span className="font-bold text-slate-800">{selectedProject.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Outlay:</span>
                  <span className="font-bold text-navy-900">₹{(selectedProject.totalBudget / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Disbursed:</span>
                  <span className="font-bold text-royal-600">₹{(selectedProject.releasedFunds / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Physical Progress:</span>
                  <span className="font-bold text-emerald-600">{selectedProject.physicalProgress}%</span>
                </div>
              </div>

              {selectedProject.financialProgress > (selectedProject.physicalProgress + 15) && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-tight flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Review Required — Financial progress ({selectedProject.financialProgress}%) is higher than reported physical progress.</span>
                </div>
              )}

              <Link
                to={`/project/${selectedProject.id}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:from-royal-500 hover:to-cyan-500 transition-all"
              >
                Inspect Ledger Trail
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-medium">
                Click any project pin on the map to inspect location parameters and financial milestones.
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-normal">
            * GIS markers update dynamically with on-chain milestone submissions and verified GPS geotagging.
          </div>
        </div>

      </div>

    </div>
  );
};
