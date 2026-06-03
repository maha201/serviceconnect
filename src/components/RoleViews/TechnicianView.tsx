import React, { useState, useRef, useEffect } from 'react';
import { Ticket, WorkOrder, Technician, InventoryItem } from '../../data/mockData';
import { Check, CheckSquare, Upload, Compass, Play, MapPin, ClipboardList, PenTool, CheckCircle, Package, ArrowRight, Camera } from 'lucide-react';

interface TechnicianViewProps {
  technician: Technician;
  tickets: Ticket[];
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  onUpdateStatus: (ticketId: string, status: Ticket['status']) => void;
  onUpdateChecklist: (woId: string, taskIndex: number, done: boolean) => void;
  onSubmitSignature: (woId: string, dataUrl: string) => void;
  onAttachPhoto: (woId: string, type: 'before' | 'after', url: string) => void;
  onUseInventory: (sku: string, qty: number) => void;
}

export default function TechnicianView({
  technician,
  tickets,
  workOrders,
  inventory,
  onUpdateStatus,
  onUpdateChecklist,
  onSubmitSignature,
  onAttachPhoto,
  onUseInventory
}: TechnicianViewProps) {
  // Find jobs assigned to this specific technician
  const assignedTickets = tickets.filter(t => t.assignedTechnicianId === technician.id);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    assignedTickets[0]?.id || null
  );

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const selectedWO = workOrders.find(wo => wo.ticketId === selectedTicket?.id);

  // Canvas drawing reference for signatures
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [usedPartSKU, setUsedPartSKU] = useState('');
  const [usedPartQty, setUsedPartQty] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4005);
  };

  // Status flow helper
  const statusFlow: Ticket['status'][] = [
    'Assigned',
    'Accepted',
    'On The Way',
    'Arrived',
    'Work In Progress',
    'Pending Parts',
    'Completed'
  ];

  // Set up mouse events on Canvas for drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#4f46e5'; // Premium indigo ink
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, [selectedTicketId, signatureSaved, selectedWO]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureSaved(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedWO) return;
    const dataUrl = canvas.toDataURL();
    onSubmitSignature(selectedWO.id, dataUrl);
    setSignatureSaved(true);
    triggerFeedback('✨ Success: Customer digital signature captured and locked successfully!');
  };

  const beforePhotos = [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  ];

  const afterPhotos = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  ];

  return (
    <div id="technician-view-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left animate-fade-in font-sans">
      
      {feedback && (
        <div className="col-span-12 bg-indigo-950/40 border border-indigo-500/35 text-indigo-200 p-4 rounded-xl flex items-center gap-2.5 text-xs shadow-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
      
      {/* LEFT COLUMN: Job schedule list */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-white text-lg">
              👨‍🔧
            </div>
            <div>
              <p className="font-extrabold text-white leading-tight">{technician.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">ID: {technician.employeeId} • {technician.mobile}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Your Jobs Assigned Today</p>
            {assignedTickets.length === 0 ? (
              <div className="text-center py-8 text-slate-500 italic text-xs font-semibold">
                Excellent! All assignments for today are clear.
              </div>
            ) : (
              <div className="space-y-2">
                {assignedTickets.map(t => {
                  const isCur = t.id === selectedTicketId;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTicketId(t.id);
                        setSignatureSaved(false);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer text-left transition-all ${
                        isCur 
                          ? 'bg-indigo-500/10 border-indigo-500/35 ring-1 ring-indigo-500/20' 
                          : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-[9px] font-bold text-slate-500">{t.ticketNumber}</span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border ${
                          t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-white text-xs truncate">{t.customerName}</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5 truncate">{t.locationText}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Parts Kit */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Technician Trunk Stock</span>
          </p>
          <div className="divide-y divide-slate-800 text-xs font-semibold">
            {inventory.slice(0, 3).map(part => (
              <div key={part.id} className="py-2.5 flex justify-between items-center">
                <span className="text-slate-350">{part.productName}</span>
                <span className="font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px]">
                  {part.quantity} remaining
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active job card details */}
      <div className="lg:col-span-8 space-y-6">
        {selectedTicket ? (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-6 space-y-6">
            
            {/* Ticket header details */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-3">
              <div>
                <span className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded font-mono border border-slate-800">
                  {selectedTicket.category}
                </span>
                <h3 className="text-lg font-black text-white mt-2">{selectedTicket.customerName}</h3>
                <p className="text-slate-450 text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {selectedTicket.locationText}
                </p>
              </div>

              {/* Status Update flow control dropdown */}
              <div className="flex items-center gap-2 select-none">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase whitespace-nowrap">Status Hook:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    onUpdateStatus(selectedTicket.id, e.target.value as any);
                  }}
                  className="bg-slate-950 border border-slate-800 py-1.5 px-3 rounded-lg text-xs text-slate-300 font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  {statusFlow.map((flowStatus) => (
                    <option key={flowStatus} value={flowStatus} className="bg-slate-900 text-slate-300">
                      {flowStatus}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Description details */}
            <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="font-extrabold text-slate-400">Problem Description raised by Customer:</p>
              <p className="text-slate-305 leading-relaxed font-sans mt-1.5 italic font-medium">
                "{selectedTicket.description}"
              </p>
            </div>

            {/* Checklist tasks */}
            {selectedWO ? (
              <div className="space-y-3.5 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <ClipboardList className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Field Safety Checklist</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-semibold select-none">
                  {selectedWO.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onUpdateChecklist(selectedWO.id, idx, !item.done)}
                      className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                        item.done 
                          ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-300' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        readOnly
                        className="rounded border-slate-800 text-indigo-500 focus:ring-indigo-550 focus:ring-0 cursor-pointer pointer-events-none"
                      />
                      <span className={item.done ? 'line-through text-slate-500' : ''}>{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-rose-350 p-3 bg-rose-950/20 rounded-lg border border-rose-900/30">
                Work order checklist hasn't been created for this ticket yet. Assign a technician or click "Complete" to generate one.
              </div>
            )}

            {/* Spare Parts Logging usage */}
            {selectedWO && (
              <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-4 space-y-3.5 text-xs">
                <h4 className="font-extrabold text-white uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-indigo-400" /> 
                  <span>Use Parts Stock</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                  <select
                    value={usedPartSKU}
                    onChange={(e) => setUsedPartSKU(e.target.value)}
                    className="p-2 border border-slate-800 bg-slate-950 text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-xs"
                  >
                    <option value="" className="bg-slate-900">-- Choose Spare Parts Used --</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.sku} className="bg-slate-900">
                        {item.productName} ({item.quantity} available)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={usedPartQty}
                    onChange={(e) => setUsedPartQty(Number(e.target.value))}
                    className="p-2 border border-slate-800 bg-slate-950 text-white rounded-lg w-16 font-mono text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (!usedPartSKU) {
                        triggerFeedback('⚠️ Validation Warning: Choose a spare part SKU first.');
                        return;
                      }
                      onUseInventory(usedPartSKU, usedPartQty);
                      setUsedPartSKU('');
                      triggerFeedback('✨ Success: Chosen spare part SKU deducted and logged!');
                    }}
                    className="bg-indigo-650 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors focus:outline-none shadow text-[10px] uppercase tracking-wider"
                  >
                    Post Log Check
                  </button>
                </div>
              </div>
            )}

            {/* Photo upload attachment simulator */}
            {selectedWO && (
              <div className="space-y-3.5 text-xs">
                <h4 className="font-extrabold text-white uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  <span>Upload Job Evidence Photos</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo Before */}
                  <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center bg-slate-950/40 space-y-2.5">
                    <p className="font-extrabold text-white text-xs">Before Work Photo</p>
                    {selectedWO.photoBefore ? (
                      <div className="relative group">
                        <img 
                          referrerPolicy="no-referrer"
                          src={selectedWO.photoBefore} 
                          alt="Before core work" 
                          className="mx-auto h-28 object-cover rounded-lg border border-slate-800 shadow" 
                        />
                        <button 
                          onClick={() => onAttachPhoto(selectedWO.id, 'before', '')}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5 py-2 select-none">
                        <p className="text-[10px] text-slate-500 font-medium">Faulty machine evidence snapshot</p>
                        <div className="flex gap-1 justify-center">
                          {beforePhotos.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                onAttachPhoto(selectedWO.id, 'before', url);
                                triggerFeedback('✨ Success: Faulty machine picture logged in work record!');
                              }}
                              className="bg-slate-950 border border-slate-805 hover:border-indigo-500 hover:text-white text-slate-400 text-[10px] font-bold px-2 py-1.5 rounded cursor-pointer transition-colors"
                            >
                              Fault {i+1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photo After */}
                  <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center bg-slate-950/40 space-y-2.5">
                    <p className="font-extrabold text-white text-xs">Completed Repair Photo</p>
                    {selectedWO.photoAfter ? (
                      <div className="relative group">
                        <img 
                          referrerPolicy="no-referrer"
                          src={selectedWO.photoAfter} 
                          alt="After repair work" 
                          className="mx-auto h-28 object-cover rounded-lg border border-slate-800 shadow" 
                        />
                        <button 
                          onClick={() => onAttachPhoto(selectedWO.id, 'after', '')}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5 py-2 select-none">
                        <p className="text-[10px] text-slate-500 font-medium">Repaired/Fixed outcome snapshot</p>
                        <div className="flex gap-1 justify-center">
                          {afterPhotos.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                onAttachPhoto(selectedWO.id, 'after', url);
                                triggerFeedback('✨ Success: Fixed machine outcome picture logged!');
                              }}
                              className="bg-slate-950 border border-slate-805 hover:border-emerald-500 hover:text-white text-slate-400 text-[10px] font-bold px-2 py-1.5 rounded cursor-pointer transition-colors"
                            >
                              Fixed {i+1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Digital Canvas Signature capture */}
            {selectedWO && (
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-indigo-400" />
                      <span>Capture Customer Sign Off Signature</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">Draw signature directly on the canvas grid below.</p>
                  </div>
                  <div className="flex gap-2 text-xs font-bold">
                    <button
                      onClick={clearCanvas}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1 rounded cursor-pointer transition-colors"
                    >
                      Clear Pad
                    </button>
                    <button
                      onClick={saveSignature}
                      className="bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white px-3 py-1 rounded cursor-pointer transition-all"
                    >
                      Confirm Draw
                    </button>
                  </div>
                </div>

                <div className="flex justify-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 shadow-inner">
                  {selectedWO.signature ? (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-emerald-300 font-bold text-xs flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Signature Captured and Encoded
                      </p>
                      <img
                        src={selectedWO.signature}
                        alt="Customer digital signature code"
                        className="mx-auto border border-slate-800 rounded shadow bg-slate-100/90 max-h-24 object-contain p-1 invert"
                      />
                    </div>
                  ) : (
                    <canvas
                      id="signature-canvas"
                      ref={canvasRef}
                      width={480}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="bg-slate-900 border border-slate-800 rounded cursor-crosshair max-w-full touch-none"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Action flow end trigger button */}
            {selectedTicket.status !== 'Completed' && (
              <button
                onClick={() => {
                  onUpdateStatus(selectedTicket.id, 'Completed');
                  triggerFeedback('✨ Success: Ticket closed. Automating PDF Invoice delivery details.');
                }}
                className="w-full bg-emerald-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-3.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-wider"
              >
                <CheckSquare className="w-4 h-4" /> 
                Complete Work Order & File Final Reports
              </button>
            )}
            
          </div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-12 text-center text-slate-400 font-semibold text-xs leading-relaxed max-w-md mx-auto space-y-3">
            <ClipboardList className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
            <p>Select one of your assigned tickets on the left panel to execute diagnosis repairs, checklist markings, and digital sign capture.</p>
          </div>
        )}
      </div>
    </div>
  );
}
