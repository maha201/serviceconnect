import React, { useState } from 'react';
import { Ticket, Technician, WorkOrder } from '../../data/mockData';
import { MapPin, Calendar, Clock, Sparkles, Navigation, UserCheck, AlertCircle, RefreshCw, Layers, CheckCircle } from 'lucide-react';

interface DispatcherViewProps {
  tickets: Ticket[];
  technicians: Technician[];
  workOrders: WorkOrder[];
  onAssignTicket: (ticketId: string, technicianId: string) => void;
  onAutoAssignAI: (ticketId: string) => void;
}

export const CATEGORIES_LIST = [
  'HVAC Services',
  'Broadband Fiber',
  'Security CCTV',
  'Home Appliance Repair',
  'Electrical Services',
  'Plumbing Services'
];

export default function DispatcherView({
  tickets,
  technicians,
  workOrders,
  onAssignTicket,
  onAutoAssignAI
}: DispatcherViewProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets.find(t => t.status === 'New')?.id || null);
  const [mapLayer, setMapLayer] = useState<'all' | 'technicians' | 'jobs'>('all');
  const [scheduledTechId, setScheduledTechId] = useState<string>(technicians[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-06-03');
  const [scheduledHour, setScheduledHour] = useState<string>('11:00');
  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4005);
  };

  const mapCenter = { lat: 12.9716, lng: 77.5946 };

  const getSimulatedXY = (lat: number, lng: number) => {
    const scaleY = 3000;
    const scaleX = 3000;
    const y = 170 - (lat - mapCenter.lat) * scaleY;
    const x = 200 + (lng - mapCenter.lng) * scaleX;
    return { x, y };
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Compute AI Dispatch suggestions for selected ticket
  const getAIDispatchSuggestions = (ticket: Ticket | undefined) => {
    if (!ticket) return [];
    return technicians.map(tech => {
      // Calculate distance score
      const ticketLat = 12.9716 + (Math.random() - 0.5) * 0.05;
      const ticketLng = 77.5946 + (Math.random() - 0.5) * 0.05;
      const dLat = tech.currentLocation.lat - ticketLat;
      const dLng = tech.currentLocation.lng - ticketLng;
      const distanceKm = Number((Math.sqrt(dLat * dLat + dLng * dLng) * 111).toFixed(1));

      // Skill match score
      const matchesSkill = tech.skills.some(skill => 
        ticket.category.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(ticket.category.toLowerCase()) || 
        (ticket.category === 'HVAC Services' && skill === 'AC Maintenance') ||
        (ticket.category === 'Broadband Fiber' && skill === 'FTTH Splicing')
      );
      const skillScore = matchesSkill ? 40 : 10;

      // Workload optimization math
      const isOnline = tech.availability !== 'Offline';
      const availabilityScore = tech.availability === 'Available' ? 40 : tech.availability === 'Busy' ? 20 : 0;
      const distancePen = Math.max(0, 20 - distanceKm * 2);

      const computedMatchPercent = Math.min(100, Math.round(skillScore + availabilityScore + distancePen));

      return {
        tech,
        distanceKm,
        matchesSkill,
        computedMatchPercent,
        reason: matchesSkill 
          ? `Expert matching skills in ${tech.skills[0]}`
          : 'Capable service mechanic (General Skills)'
      };
    }).sort((a, b) => b.computedMatchPercent - a.computedMatchPercent);
  };

  const aiSuggestions = getAIDispatchSuggestions(selectedTicket);

  return (
    <div id="dispatcher-view-root" className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left animate-fade-in">
      
      {feedback && (
        <div className="col-span-12 bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 p-4 rounded-xl flex items-center gap-2.5 text-xs shadow-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
      
      {/* LEFT COLUMN: Queue & AI Engine panel */}
      <div className="xl:col-span-4 space-y-6 flex flex-col">
        {/* Ticket queue */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 flex flex-col h-[340px] overflow-hidden">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
              <span>Unassigned Operations</span>
              <span className="bg-red-500/10 text-red-300 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-red-500/20">
                {tickets.filter(t => t.status === 'New').length} New
              </span>
            </h3>
            <button className="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="divide-y divide-slate-800 overflow-y-auto mt-2 space-y-2 pr-1 select-none">
            {tickets.map((t) => {
              const isSelected = t.id === selectedTicketId;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border text-left flex flex-col gap-1.5 ${
                    isSelected 
                      ? 'bg-indigo-500/10 border-indigo-500/35 ring-1 ring-indigo-500/20' 
                      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-slate-500">{t.ticketNumber}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${
                      t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                      t.priority === 'High' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs truncate">{t.customerName}</h4>
                    <p className="text-[11px] text-slate-450 italic truncate mt-0.5">{getSimulatedXY(12.97, 77.59) && t.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mt-1">
                    <span className="bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800 font-mono">{t.category}</span>
                    <span className={`font-extrabold uppercase ${t.status === 'New' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Smart Dispatcher Panel */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 text-white rounded-xl p-5 space-y-4 flex-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="w-4 h-4 text-violet-300 animate-pulse font-bold" />
              <span>AI Smart Dispatch recommendation</span>
            </h3>
            <span className="text-[9px] uppercase font-extrabold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded tracking-widest text-indigo-300">
              Auto Pilot
            </span>
          </div>

          {selectedTicket ? (
            <div className="space-y-4 text-xs font-semibold">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-indigo-200 text-xs">{selectedTicket.customerName}</p>
                <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">
                  Requested Task: <span className="text-white">{selectedTicket.category}</span> - <span className="italic text-slate-500">"{selectedTicket.description}"</span>
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Top Recommended Technicians</p>
                {aiSuggestions.map((sug, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 hover:bg-slate-950/60 transition-colors">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-xs">{sug.tech.name}</span>
                        <span className="text-[9.5px] text-slate-550 font-mono">({sug.distanceKm} km raw)</span>
                      </div>
                      <p className="text-[10px] text-slate-450 italic mt-1 font-medium">{sug.reason}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 select-none shrink-0 border-l border-slate-800 pl-2.5 min-w-[70px]">
                      <div className="bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/20 text-center text-[9px] text-slate-350">
                        <span className="font-black text-violet-300 font-mono text-[10px]">{sug.computedMatchPercent}%</span> Match
                      </div>
                      <button
                        onClick={() => {
                          onAssignTicket(selectedTicket.id, sug.tech.id);
                        }}
                        className="bg-indigo-650 hover:bg-slate-100 hover:text-slate-950 font-extrabold px-3 py-1 text-[10px] rounded text-white transition-all cursor-pointer shadow-sm"
                      >
                        Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onAutoAssignAI(selectedTicket.id);
                }}
                className="w-full bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-md focus:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                Auto-Assign Best Engineer (Recommended)
              </button>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <p className="text-xs font-semibold">No ticket chosen in the Queue list yet.</p>
              <p className="text-[10px] text-indigo-400 mt-1 font-semibold">Select an unassigned ticket above to run geospatial dispatcher matches.</p>
            </div>
          )}
        </div>
      </div>

      {/* CENTER & RIGHT COLUMN: Map & Calendar scheduling */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Geographic dispatch board map */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col">
          <div className="bg-slate-950/40 px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-white text-sm">Geospatial Operations Map (Bangalore Hub)</h3>
              <p className="text-[11px] text-slate-450 mt-0.5">Visually tracking live geofences, mechanics locations, and customer job cards.</p>
            </div>
            
            <div className="flex gap-1 bg-slate-950/60 p-1 rounded-lg text-[11px] border border-slate-800 select-none">
              {[
                { id: 'all', label: 'All Markers' },
                { id: 'technicians', label: 'Techs only' },
                { id: 'jobs', label: 'Active Jobs' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMapLayer(opt.id as any)}
                  className={`px-3 py-1 font-bold rounded transition-colors cursor-pointer ${
                    mapLayer === opt.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-450 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulated Map Box */}
          <div className="relative bg-slate-950 h-[380px] overflow-hidden flex items-center justify-center select-none">
            {/* Background Map Visualizer Grid Lines */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Roads Simulation lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none">
              <line x1="0" y1="180" x2="800" y2="180" stroke="white" strokeWidth="4" />
              <line x1="400" y1="0" x2="400" y2="400" stroke="white" strokeWidth="4" />
              <line x1="100" y1="100" x2="700" y2="300" stroke="white" strokeWidth="3" />
              <line x1="100" y1="300" x2="700" y2="100" stroke="white" strokeWidth="3" />
              <circle cx="400" cy="180" r="120" stroke="white" strokeWidth="2" fill="none" strokeDasharray="4" />
            </svg>

            {/* Hub Base Station Marker */}
            <div className="absolute text-center" style={{ left: '400px', top: '170px' }}>
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 animate-ping absolute -left-1 -top-1" />
              <div className="w-4 h-4 rounded-full bg-indigo-500 border border-indigo-400/40 flex items-center justify-center text-[8px] text-white font-extrabold shadow-md">
                H
              </div>
              <span className="absolute left-5 -top-1.5 bg-slate-900 border border-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold whitespace-nowrap">
                Base Hub
              </span>
            </div>

            {/* active geofence range indicators */}
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
              <circle cx="400" cy="170" r="160" fill="indigo" />
            </svg>

            {/* render technicians */}
            {(mapLayer === 'all' || mapLayer === 'technicians') && technicians.map((tech) => {
              const coords = getSimulatedXY(tech.currentLocation.lat, tech.currentLocation.lng);
              const colorClassName = tech.availability === 'Available' ? 'bg-emerald-400' : 'bg-violet-400';
              return (
                <div
                  key={tech.id}
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  title={`${tech.name} (${tech.availability})`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${colorClassName} border-2 border-slate-900 flex items-center justify-center shadow-lg relative`}>
                    <div className="absolute -inset-1.5 rounded-full border border-teal-400 opacity-20 bg-teal-400/20 animate-pulse" />
                  </div>
                  {/* labels labels */}
                  <div className="absolute -left-10 -bottom-5 bg-slate-900 text-white text-[8px] px-1.5 py-1 rounded border border-slate-800 font-mono flex items-center gap-1 shadow whitespace-nowrap">
                    <span className={`w-1 h-1 rounded-full ${tech.availability === 'Available' ? 'bg-emerald-400' : 'bg-violet-400'}`} />
                    <span>{tech.name.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}

            {/* render tickets with locations */}
            {(mapLayer === 'all' || mapLayer === 'jobs') && tickets.map((t) => {
              const seedIdNum = t.id.length;
              const fakeLat = mapCenter.lat + Math.sin(seedIdNum * 43) * 0.04;
              const fakeLng = mapCenter.lng + Math.cos(seedIdNum * 82) * 0.045;
              const coords = getSimulatedXY(fakeLat, fakeLng);

              return (
                <div
                  key={t.id}
                  className="absolute cursor-pointer transition-transform hover:scale-115"
                  style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                  title={`${t.customerName} - ${t.category}`}
                  onClick={() => setSelectedTicketId(t.id)}
                >
                  <MapPin className="w-5 h-5 text-indigo-400 hover:text-indigo-300 drop-shadow-md" />
                  <div className="absolute left-5 -top-1 bg-slate-900 text-[8px] border border-slate-800 px-1 py-0.5 rounded shadow whitespace-nowrap text-slate-200 font-bold uppercase tracking-wide">
                    {t.customerName.split(' ')[0]} ({t.priority})
                  </div>
                </div>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 rounded border border-slate-800 p-2 text-[9px] text-slate-350 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Available Field Engineer</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                <span>Busy Engineer (WIP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Customer Active Location</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drag & Drop Calendar Schedule Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-white text-sm">Direct Operational Scheduler (Hourly Slots)</h3>
              <p className="text-[11px] text-slate-455 mt-0.5">Click any technician's row slot to schedule or reassign active tickets immediately.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="p-1 text-xs border border-slate-800 rounded bg-slate-950/60 text-slate-300 font-mono focus:outline-none"
              />
              <span className="bg-slate-950 px-2 py-1 rounded text-slate-400 font-bold uppercase select-none text-[10px] border border-slate-800">
                Daily Grid
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px] divide-y divide-slate-800 font-semibold">
              
              {/* Day hours header */}
              <div className="grid grid-cols-12 bg-slate-950/40 p-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                <div className="col-span-3 text-slate-450 text-left">Technician</div>
                <div className="col-span-1.5 text-center">09:00 AM</div>
                <div className="col-span-1.5 text-center">11:00 AM</div>
                <div className="col-span-1.5 text-center">01:00 PM</div>
                <div className="col-span-1.5 text-center">03:00 PM</div>
                <div className="col-span-1.5 text-center">05:00 PM</div>
                <div className="col-span-1 text-right">Load Score</div>
              </div>

              {/* Rows */}
              {technicians.map((tech) => {
                const assignedCount = tickets.filter(t => t.assignedTechnicianId === tech.id).length;
                return (
                  <div key={tech.id} className="grid grid-cols-12 p-3 items-center hover:bg-slate-900/30">
                    <div className="col-span-3 text-left">
                      <p className="font-extrabold text-white text-xs">{tech.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{tech.skills[0]}</p>
                    </div>

                    {/* Time slots */}
                    {[
                      { time: '09:00', label: '09:00 AM' },
                      { time: '11:00', label: '11:00 AM' },
                      { time: '13:00', label: '01:00 PM' },
                      { time: '15:00', label: '03:00 PM' },
                      { time: '17:00', label: '05:00 PM' },
                    ].map((slot, i) => {
                      const isAssigned = (tech.id === 't1' && i === 1) || (tech.id === 't2' && i === 2);
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (selectedTicketId) {
                              onAssignTicket(selectedTicketId, tech.id);
                              triggerFeedback(`✨ Success: Assigned ticket successfully to ${tech.name} at ${slot.label}!`);
                            } else {
                              triggerFeedback('⚠️ Validation Warning: Choose an unassigned ticket from the queue on the left first.');
                            }
                          }}
                          className={`col-span-1.5 mx-1 p-1.5 rounded transition-all cursor-pointer font-bold text-[9.5px] uppercase select-none text-center border ${
                            isAssigned 
                              ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' 
                              : 'bg-slate-950/60 hover:bg-indigo-500/10 hover:text-indigo-200 text-slate-500 border-slate-800'
                          }`}
                        >
                          {isAssigned ? 'Active WO' : '+ Free'}
                        </div>
                      );
                    })}

                    {/* Load */}
                    <div className="col-span-1 text-right font-mono font-bold text-slate-400 text-xs">
                      {assignedCount * 2}0%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
