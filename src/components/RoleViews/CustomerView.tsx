import React, { useState, useEffect } from 'react';
import { Ticket, Customer, Asset, Invoice, Technician } from '../../data/mockData';
import { 
  Crown,
  Sparkles, 
  Send, 
  MapPin, 
  Star, 
  Shield, 
  Clock, 
  CreditCard, 
  Layers, 
  Phone, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  Cpu,
  BadgeAlert,
  ThumbsUp,
  XSquare,
  HelpCircle,
  Gem,
  Wrench,
  Receipt
} from 'lucide-react';

interface CustomerViewProps {
  customer: Customer;
  tickets: Ticket[];
  assets: Asset[];
  invoices: Invoice[];
  technicians: Technician[];
  onCreateTicket: (ticket: Ticket) => void;
  onPayInvoice: (invoiceId: string) => void;
  onSubmitFeedback: (rating: number, review: string) => void;
}

export default function CustomerView({
  customer,
  tickets,
  assets,
  invoices,
  technicians,
  onCreateTicket,
  onPayInvoice,
  onSubmitFeedback
}: CustomerViewProps) {
  // Tabs: 'raise' (Request Service), 'tickets' (Deployments), 'invoices' (Ledger), 'feedback' (NPS)
  const [activeCustTab, setActiveCustTab] = useState<'raise' | 'tickets' | 'invoices' | 'feedback'>('raise');

  // New Ticket Form State
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('HVAC Services');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  
  // Smart Diagnostics assist
  const [aiDetected, setAiDetected] = useState<{
    text: string;
    confidence: number;
    suggestedCategory: string;
    suggestedPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  } | null>(null);

  // Ratings NPS
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitRating, setIsSubmitRating] = useState(false);

  // Invoice Payment simulated modal
  const [activePayingInvoice, setActivePayingInvoice] = useState<Invoice | null>(null);
  const [isPayingSim, setIsPayingSim] = useState(false);
  
  // Local active diagnosis simulator
  const [simulatingAssetId, setSimulatingAssetId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  // Feedback notifications standard
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Filter lists matching this customer
  const customerTickets = tickets.filter(t => t.customerId === customer.id);
  const customerInvoices = invoices.filter(inv => inv.customerName === customer.name);
  const unpaidInvoices = customerInvoices.filter(inv => inv.status === 'Unpaid');
  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);

  // Dynamic AI Triage Categorization Engine
  useEffect(() => {
    const text = desc.toLowerCase().trim();
    if (text.length < 5) {
      setAiDetected(null);
      return;
    }

    if (text.includes('leak') || text.includes('drip') || text.includes('cooling') || text.includes('compressor') || text.includes('hvac') || text.includes('rattle') || text.includes('heating') || text.includes('filter')) {
      setAiDetected({
        text: 'Smart Copilot: Detected Climate/HVAC system malfunction. Recommending priority SLA response.',
        confidence: 94,
        suggestedCategory: 'HVAC Services',
        suggestedPriority: 'High'
      });
      setCategory('HVAC Services');
      setPriority('High');
    } else if (text.includes('fiber') || text.includes('internet') || text.includes('cable') || text.includes('broadband') || text.includes('wifi') || text.includes('routing') || text.includes('offline') || text.includes('isp')) {
      setAiDetected({
        text: 'Smart Copilot: Detected Broadband Fiber outage. Network topology indicates diagnostic routing review needed.',
        confidence: 98,
        suggestedCategory: 'Broadband Fiber',
        suggestedPriority: 'Critical'
      });
      setCategory('Broadband Fiber');
      setPriority('Critical');
    } else if (text.includes('camera') || text.includes('cctv') || text.includes('nvr') || text.includes('mounting') || text.includes('vision') || text.includes('night') || text.includes('security') || text.includes('surveillance')) {
      setAiDetected({
        text: 'Smart Copilot: Surveillance system feed interruption detected. Recommending medium urgency routing.',
        confidence: 89,
        suggestedCategory: 'Security CCTV',
        suggestedPriority: 'Medium'
      });
      setCategory('Security CCTV');
      setPriority('Medium');
    } else if (text.includes('spin') || text.includes('machine') || text.includes('washing') || text.includes('pump') || text.includes('appliance') || text.includes('dryer') || text.includes('motor')) {
      setAiDetected({
        text: 'Smart Copilot: Power transmission or rotor issue detected. Matching local appliance technician.',
        confidence: 85,
        suggestedCategory: 'Home Appliance Repair',
        suggestedPriority: 'Medium'
      });
      setCategory('Home Appliance Repair');
      setPriority('Medium');
    } else {
      setAiDetected(null);
    }
  }, [desc]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      triggerFeedback('⚠️ Validation Warning: Please explain your equipment symptoms first.');
      return;
    }

    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-2026-00${Math.floor(Math.random() * 89) + 10}`,
      customerId: customer.id,
      customerName: customer.name,
      category,
      priority,
      description: desc,
      locationId: customer.addresses[0]?.id || 'addr_1',
      locationText: customer.addresses[0]?.street || 'Primary Bangalore Tech Hub',
      slaLimitHours: priority === 'Critical' ? 4 : priority === 'High' ? 24 : 48,
      slaTargetTime: new Date(Date.now() + (priority === 'Critical' ? 4 : 24) * 60 * 60 * 1000).toISOString(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    onCreateTicket(newTicket);
    setDesc('');
    setSelectedAssetId('');
    setActiveCustTab('tickets');
    triggerFeedback('Royal Assignment Confirmed: Your premium service dispatcher has fast-tracked your technician.');
  };

  const runHardwareSelfTest = (assetId: string) => {
    setSimulatingAssetId(assetId);
    setSimulationResult(null);
    
    setTimeout(() => {
      setSimulationResult("Telemetry Secured. Voltages: Optimal (234V). Local thermal thresholds report safe state. Digital transceiver signal is peak at -44dBm.");
    }, 1500);
  };

  return (
    <div id="customer-view-root" className="space-y-8 animate-fade-in text-left font-sans text-slate-100 max-w-7xl mx-auto px-1">
      
      {/* Toast Alert Notification */}
      {feedbackMsg && (
        <div className="bg-violet-500/10 border-l-4 border-violet-500 text-violet-200 p-4 rounded-r-xl flex items-center gap-3 text-xs shadow-lg backdrop-blur font-semibold transition-all duration-300">
          <Sparkles className="w-4 h-4 text-violet-400 shrink-0 animate-pulse" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* TOP COMPREHENSIVE CUSTOMER VIP HUD HEADER */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
             {/* VIP Badging header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-slate-900 pb-6 mb-6">
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-violet-500/10 text-violet-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-550/20 shadow-sm flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-violet-450" /> Royal Diamond Elite Account
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">{customer.type} Partner</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white flex items-center gap-2">
              Greetings, {customer.name}
            </h2>
            
            <p className="text-xs text-slate-350 max-w-xl leading-relaxed">
              Welcome to your dedicated Imperial Service suite. Command live engineering deployments, log instantaneous UPI clearings, and configure high-tier custom warranties.
            </p>
          </div>
          
          {/* Quick Hot actions but in Violet style */}
          <div className="flex items-center gap-3 select-none shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveCustTab('raise')}
              className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-violet-300" /> Request Service
            </button>
            <button
              onClick={() => setActiveCustTab('invoices')}
              className="flex-1 md:flex-initial bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-900 text-slate-300 text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Open Ledger ({unpaidInvoices.length})
            </button>
          </div>
        </div>

        {/* CUSTOMER BENTO HERO KPIs with No Harsh White borders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 shadow-lg flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xl shrink-0 border border-indigo-500/10">
              <Gem className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-left leading-snug">
              <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-widest block">Device Fleet Size</span>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">{assets.length} Active assets</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 shadow-lg flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xl shrink-0 border border-indigo-500/10">
              <Activity className="w-5 h-5 text-violet-400" />
            </div>
            <div className="text-left leading-snug">
              <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-widest block">Active Deployments</span>
              <span className="text-lg font-black text-violet-400">
                {customerTickets.filter(t => t.status !== 'Completed').length} Pending
              </span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 shadow-lg flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xl shrink-0 border border-indigo-500/10">
              <Crown className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-left leading-snug">
              <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-widest block">Outstanding Due</span>
              <span className={`text-lg font-black ${unpaidTotal > 0 ? 'text-violet-400' : 'text-emerald-400'}`}>
                ₹{unpaidTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 shadow-lg flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xl shrink-0 border border-indigo-500/10">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-left leading-snug">
              <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-widest block">Elite Level Rank</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-slate-200">SLA Rank 1</span>
                <Crown className="w-3.5 h-3.5 text-violet-450 shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED CONTENT DECKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPARTMENT: Principal Work Desks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Futuristic Rounded Menu Selector - Violet/Purple border hints, zero cheap whites */}
          <div className="bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/40 flex gap-1 select-none overflow-x-auto">
            {[
              { id: 'raise', label: 'Request Service', icon: Wrench },
              { id: 'tickets', label: 'Monitor Deployments', icon: Activity },
              { id: 'invoices', label: 'Ledger & Instant UPI', icon: Receipt },
              { id: 'feedback', label: 'NPS Quality Audit', icon: Star }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCustTab(tab.id as any)}
                  className={`flex-1 min-w-[145px] py-3.5 px-4 rounded-lg font-black text-xs transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
                    activeCustTab === tab.id
                      ? 'bg-gradient-to-r from-violet-500/15 to-indigo-500/15 border border-violet-500/30 text-violet-300 shadow-md scale-[1.01]'
                      : 'text-slate-400 hover:text-white border border-transparent hover:bg-slate-900/40'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: REQUEST METICULOUS DEPLOYMENT */}
          {activeCustTab === 'raise' && (
            <div className="bg-slate-950/50 border border-slate-900 p-6 sm:p-8 rounded-xl space-y-6 shadow-xl backdrop-blur-lg">
              
              <div className="border-b border-slate-900 pb-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-450 animate-bounce" />
                      <span>Request Premium Service Desk</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Briefly describe mechanical or structural symptoms. Our custom dispatcher uses real-time metrics to reserve local certified specialists for you.
                    </p>
                  </div>
                  <Gem className="w-5 h-5 text-violet-400 animate-pulse shrink-0" />
                </div>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-6">
                
                {/* Text description with neat focus ring glow */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                    Symptom Analysis Input Desk:
                  </label>
                  <textarea
                    required
                    placeholder="E.g., HVAC dual blower exhibits rattling noises and minor condensation leak, or BroadBand optical transceivers display red alert indicator..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full p-4 border border-slate-800 rounded-xl text-white bg-slate-900/40 focus:outline-none focus:ring-1 focus:ring-violet-500/40 min-h-[110px] text-xs font-sans placeholder:text-slate-600 leading-relaxed"
                  />

                  {/* AI Prediction Hub */}
                  {aiDetected && (
                    <div className="p-4 bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-slate-950 rounded-xl border border-violet-500/20 text-xs flex gap-3 shadow-md animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-violet-450 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-violet-300 tracking-tight">VIP Copilot Recommendation</span>
                          <span className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded text-[9.5px] font-mono border border-emerald-500/20">
                            {aiDetected.confidence}% match
                          </span>
                        </div>
                        <p className="text-slate-350 text-[11px] leading-relaxed italic">
                          "{aiDetected.text}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Category dropdown */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                      Machine Category Segment
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-bold focus:outline-none focus:ring-1 focus:ring-violet-500/30 text-xs cursor-pointer"
                    >
                      <option value="HVAC Services">Elite Climate HVAC System Services</option>
                      <option value="Broadband Fiber">Premium FTTH Tech Optical Broadband</option>
                      <option value="Security CCTV">Surveillance & AI CCTV Security</option>
                      <option value="Home Appliance Repair">High-voltage Home Electrical Appliances</option>
                    </select>
                  </div>

                  {/* Priority dropdown */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                      Urgency SLA Response Time
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-bold focus:outline-none focus:ring-1 focus:ring-violet-500/30 text-xs cursor-pointer"
                    >
                      <option value="Low">Low Priority - Standard routine audit (48hr SLA)</option>
                      <option value="Medium">Medium Priority - Daily use check-up (24hr SLA)</option>
                      <option value="High">High Priority - Urgent field deployment (12hr SLA)</option>
                      <option value="Critical">Critical Priority - Imperial fast-lane dispatch (4hr SLA)</option>
                    </select>
                  </div>

                </div>

                {/* Target asset association */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                    Select Device Fleet Component (Optional Asset link)
                  </label>
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full p-3.5 bg-slate-905 border border-slate-800 rounded-lg text-slate-300 font-bold focus:outline-none focus:ring-1 focus:ring-violet-500/30 text-xs cursor-pointer"
                  >
                    <option value="">-- No specific device registered (General diagnostics) --</option>
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} • Serial: {a.serialNumber} ({a.category})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 hover:scale-[1.01] text-white font-black py-4.5 rounded-xl text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider mt-4"
                >
                  <Send className="w-4 h-4 text-indigo-100" />
                  Request Deployment of Field Specialist
                </button>

              </form>

            </div>
          )}

          {/* TAB 2: ACTIVE DEPLOYMENTS TIMELINE */}
          {activeCustTab === 'tickets' && (
            <div className="space-y-6">
              {customerTickets.length === 0 ? (
                <div className="bg-slate-950/40 p-12 rounded-xl text-center border border-slate-900 shadow-inner">
                  <p className="text-slate-400 italic text-xs leading-relaxed font-bold">
                    No active technician deployments mapped. Press "Request Premium Service" to start dispatch tracking.
                  </p>
                </div>
              ) : (
                customerTickets.map((tkt) => {
                  const assignedTech = technicians.find(tec => tec.id === tkt.assignedTechnicianId);
                  
                  return (
                    <div key={tkt.id} className="bg-slate-950/50 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
                      
                      {/* Violet subtle bar left accent */}
                      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-violet-500 via-indigo-500 to-indigo-950" />

                      {/* Header details with no cheap borders */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-900 gap-4">
                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-violet-400 font-extrabold tracking-wider">
                              {tkt.ticketNumber}
                            </span>
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                              tkt.priority === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse' :
                              tkt.priority === 'High' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' :
                              'bg-indigo-500/10 text-indigo-300 border-indigo-501/20'
                            }`}>
                              {tkt.priority} SLA Range
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-black text-white">{tkt.category}</h4>
                          
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            {tkt.locationText}
                          </span>
                        </div>

                        <div className="flex sm:flex-col items-end gap-1 shrink-0 text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Phase:</span>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest block">
                            {tkt.status}
                          </span>
                        </div>
                      </div>

                      {/* Diagnosis Logs user detail */}
                      <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-900/60 text-xs">
                        <p className="font-bold text-violet-300 text-[10.5px] uppercase tracking-wide">Symptoms logged by Corporate VIP:</p>
                        <p className="text-slate-300 leading-relaxed font-sans italic mt-1.5 font-medium">
                          "{tkt.description}"
                        </p>
                      </div>

                      {/* Dynamic Royal Progress Bar - Violet nodes */}
                      <div>
                        <div className="flex items-center justify-between text-[10.5px] text-slate-400 uppercase font-black tracking-widest pb-4">
                          <span>Live Deployments Radar</span>
                          <span className="text-violet-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Telemetry active
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 relative">
                          {[
                            { step: 'New', label: 'Registered' },
                            { step: 'Assigned', label: 'Allocated' },
                            { step: 'On The Way', label: 'Transit' },
                            { step: 'Work In Progress', label: 'Diagnosing' },
                            { step: 'Completed', label: 'De-mobbed' }
                          ].map((item, index) => {
                            const sequence = ['New', 'Assigned', 'On The Way', 'Work In Progress', 'Completed'];
                            const currentPos = sequence.indexOf(tkt.status);
                            const nodePos = sequence.indexOf(item.step);
                            const passed = nodePos <= currentPos;

                            return (
                              <div key={item.step} className="text-center group">
                                <div className="relative flex justify-center mb-2.5">
                                  {/* Violet Line connects */}
                                  {index < 4 && (
                                    <div className={`absolute top-1/2 left-[50%] right-[-50%] h-[2px] -translate-y-1/2 z-0 transition-colors duration-500 ${
                                      nodePos < currentPos ? 'bg-violet-400/80' : 'bg-slate-800'
                                    }`} />
                                  )}
                                  
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs z-10 border transition-all ${
                                    passed
                                      ? 'bg-gradient-to-br from-violet-400 to-violet-500 text-white border-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                                      : 'bg-slate-900 text-slate-600 border-slate-800'
                                  }`}>
                                    {passed ? '✓' : index + 1}
                                  </div>
                                </div>
                                <p className={`text-[9.5px] uppercase font-black tracking-wide block ${
                                  passed ? 'text-violet-400' : 'text-slate-600'
                                }`}>
                                  {item.step}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium tracking-tight block">
                                  {item.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Professional tech card on allocation */}
                      {assignedTech ? (
                        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 rounded-xl border border-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold">
                          
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full bg-slate-950 border border-violet-500/20 flex items-center justify-center text-xl shadow-lg shrink-0">
                              <Wrench className="w-5 h-5 text-violet-400" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-black tracking-wider text-violet-400 block">Lead Field Diagnostics Engineer</span>
                              <h5 className="font-black text-white text-base leading-none">{assignedTech.name}</h5>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-medium">
                                <span className="text-violet-300 font-extrabold">Service Rank: Premium</span>
                                <span>Mobile: {assignedTech.mobile}</span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto flex flex-wrap gap-2.5 shrink-0">
                            <a
                              href={`tel:${assignedTech.mobile}`}
                              className="flex-1 sm:flex-initial bg-indigo-500/10 hover:bg-indigo-550 hover:text-white border border-indigo-500/20 text-indigo-400 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-violet-450" />
                              <span>Direct Link Dial</span>
                            </a>
                            
                            <div className="flex-1 sm:flex-initial bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-left font-mono leading-tight">
                              <span className="text-violet-400 font-black block text-xs">ETA: 14 Mins</span>
                              <span className="text-[9.5px] text-slate-500 tracking-tight block">Distance: 1.8 Kilometers</span>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="p-5 bg-slate-900/40 border border-dashed border-slate-800/40 rounded-xl flex items-center gap-3.5">
                          <Clock className="w-5 h-5 text-violet-450 animate-pulse shrink-0" />
                          <div className="text-xs text-left">
                            <p className="font-extrabold text-white">Smart Match Scheduling In Progress</p>
                            <p className="text-[11.5px] text-slate-400 font-medium mt-0.5">
                              Our custom dispatch router is processing localized GPS coordinates to designate the optimal field specialist for your address.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: LEDGER PAYMENTS */}
          {activeCustTab === 'invoices' && (
            <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-900 pb-4 text-left font-sans">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-400 shrink-0" />
                  <h3 className="font-extrabold text-white text-base">Premium GST Ledger & Billing Portal</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Transact secure outstanding balances securely using UPI simulation mapping directly with standard corporate clearance checks.
                </p>
              </div>

              {customerInvoices.length === 0 ? (
                <div className="text-center py-12 text-slate-500 italic text-xs font-bold font-mono">
                  No billing invoices initialized recently in ledger databases.
                </div>
              ) : (
                <div className="space-y-4">
                  {customerInvoices.map((inv) => (
                    <div key={inv.id} className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold shadow-md hover:border-violet-500/20 transition-all duration-300">
                      
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10.5px] font-black text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/20">{inv.invoiceNumber}</span>
                          <span className="bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-mono border border-slate-900">GSTR-3B</span>
                        </div>
                        <h4 className="font-black text-white text-2xl tracking-tight">₹{inv.total.toLocaleString()}</h4>
                        
                        <div className="text-[11px] text-slate-400 mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
                          <span>Labor Charges: ₹{inv.laborCharges}</span>
                          <span>Parts Replaced: ₹{inv.partsCharges}</span>
                          <span className="text-violet-400">GST: 18% inclusive</span>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto shrink-0 select-none">
                        {inv.status === 'Unpaid' ? (
                          <button
                            onClick={() => {
                              setActivePayingInvoice(inv);
                              setIsPayingSim(true);
                            }}
                            className="w-full md:w-auto bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 hover:scale-[1.02] text-white font-black px-5 py-3.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                          >
                            <CreditCard className="w-4 h-4 text-slate-950" />
                            <span>Instant UPI Settlement</span>
                          </button>
                        ) : (
                          <div className="w-full md:w-auto bg-emerald-500/10 text-emerald-400 font-mono font-black px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 border border-emerald-500/20 uppercase text-[9.5px] tracking-widest shrink-0">
                            <CheckCircle className="w-4 h-4 text-emerald-400" /> 
                            <span>Paid Securely ({inv.paymentMethod || 'UPI Core'})</span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LEAVE METICULOUS OPERATIONS FEEDBACK */}
          {activeCustTab === 'feedback' && (
            <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="border-b border-slate-900 pb-4 text-left">
                <h3 className="font-extrabold text-white text-base">Meticulous NPS Operations Assessment</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  How was your service experience? Your rating feeds directly into our localized dispatch scorecards to prioritize assigning top-rated specialists for your machine assets.
                </p>
              </div>

              {isSubmitRating ? (
                <div className="p-8 text-center bg-indigo-950/10 rounded-xl border border-violet-500/25 max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-white text-xl mx-auto border border-violet-500/20">
                    <Crown className="w-5 h-5 text-violet-400" />
                  </div>
                  <h4 className="font-black text-violet-300 text-sm">NPS score registered securely.</h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    Your meticulous insights dynamically upgrade our technician priority routing matrixes. Thank you for your partnership.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitRating(false);
                      setReview('');
                    }}
                    className="bg-indigo-650 hover:bg-slate-100 hover:text-slate-950 text-white font-black px-5 py-2.5 rounded-lg text-xs transition-all cursor-pointer focus:outline-none"
                  >
                    Provide New Review
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  
                  {/* Real-time Hover Slider panel */}
                  <div className="space-y-2">
                    <span className="block text-xs font-black uppercase tracking-widest text-violet-400">Your Grade: {rating} / 5 Stars Elite</span>
                    <div className="flex items-center gap-2 select-none py-1">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <div
                          key={starIdx}
                          onClick={() => setRating(starIdx)}
                          onMouseEnter={() => setHoverRating(starIdx)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="cursor-pointer transition-transform duration-100 hover:scale-110 p-1"
                        >
                          <Star
                            className={`w-9 h-9 transition-colors ${
                              (hoverRating || rating) >= starIdx 
                                ? 'fill-violet-400 text-violet-400 shadow-sm' 
                                : 'text-slate-700'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                      Write some comments about diagnostics speed, tools safety, and technical capability:
                    </label>
                    <textarea
                      placeholder="Share your thoughts about diagnostics quality, expertise scores, or general helpfulness..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="w-full p-4 border border-slate-800 rounded-xl bg-slate-900/40 text-white focus:outline-none focus:ring-1 focus:ring-violet-500/40 min-h-[110px] text-xs font-sans placeholder:text-slate-600 leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={() => {
                      onSubmitFeedback(rating, review);
                      setIsSubmitRating(true);
                      triggerFeedback('Success: NPS rating registered and applied.');
                    }}
                    className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-black py-4 rounded-xl text-xs transition-all cursor-pointer shadow-lg uppercase tracking-wider block text-center"
                  >
                    Commit NPS Rating Verification
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT COMPARTMENT SIDEBAR: Machine Fleets & Locations */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* IOT MACHINE FLEET HEALTH DECK */}
          <div className="bg-slate-900/40 border border-slate-800/40 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 flex-wrap gap-2 text-xs">
              <span className="font-black text-violet-400 uppercase tracking-widest flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Fleet telemetry
              </span>
              <span className="bg-indigo-500/10 text-indigo-300 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-indigo-500/15">
                IoT Verified
              </span>
            </div>

            <div className="space-y-4">
              {assets.length === 0 ? (
                <p className="text-slate-500 italic py-4 text-xs font-bold leading-relaxed font-mono">No associated hardware detected.</p>
              ) : (
                assets.map((ast) => (
                  <div key={ast.id} className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl text-left space-y-3.5 shadow-md">
                    
                    <div className="flex justify-between items-start gap-2 text-left">
                      <div>
                        <h4 className="font-extrabold text-white text-xs block truncate">{ast.name}</h4>
                        <span className="text-[9.5px] text-slate-500 font-bold font-mono">ID: {ast.serialNumber}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[8.5px] uppercase tracking-wide font-black border shrink-0 ${
                        ast.warrantyStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'
                      }`}>
                         {ast.warrantyStatus} Warranty
                      </span>
                    </div>

                    {/* Operational telemetry tracker */}
                    <div className="text-[10.5px] leading-tight space-y-1">
                      <div className="flex justify-between items-center text-slate-400 font-bold">
                        <span>IoT Diagnostic Health:</span>
                        <span className="text-violet-450 font-bold font-mono">Normal (96%)</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-900 overflow-hidden">
                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-black uppercase tracking-wider">
                      <span>Ref: {ast.category}</span>
                      <span>Next Audit: {ast.nextServiceDueDate}</span>
                    </div>

                    {/* Simulation Console widget */}
                    <div className="pt-2 text-xs select-none">
                      {simulatingAssetId === ast.id ? (
                        <div className="space-y-2">
                          {simulationResult ? (
                            <div className="p-2.5 bg-slate-950 rounded border border-violet-500/20 text-[9px] text-violet-300 leading-relaxed font-mono select-text font-semibold">
                              {simulationResult}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 justify-center py-1.5 font-black text-[10px] text-violet-400">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
                              <span className="font-mono">Interrogating hardware logs...</span>
                            </div>
                          )}
                          
                          <button
                            onClick={() => {
                              setSimulatingAssetId(null);
                              setSimulationResult(null);
                            }}
                            className="w-full py-1.5 bg-slate-950 border border-slate-800 text-slate-400 font-bold text-[9px] hover:text-white rounded cursor-pointer transition-colors"
                          >
                            Close Diagnostic Pad
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => runHardwareSelfTest(ast.id)}
                          className="w-full py-1.5 bg-violet-500/5 hover:bg-violet-500 hover:text-white text-violet-300 text-[10px] font-black uppercase tracking-wider rounded border border-violet-500/20 transition-all cursor-pointer text-center"
                        >
                          Run IoT Diagnostics Check
                        </button>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* SERVICE SITE DIRECTORY MAP DETAILS */}
          <div className="bg-slate-900/40 border border-slate-800/40 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 text-xs">
              <span className="font-black text-white uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-400" /> Registered Sites Address
              </span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-500 font-mono">
                Verified
              </span>
            </div>

            <div className="space-y-3 font-semibold text-xs">
              {customer.addresses.map((addr, index) => (
                <div key={addr.id} className="p-3.5 bg-slate-900/30 border border-slate-900 rounded-xl leading-relaxed text-left text-[11px] space-y-1">
                  <p className="text-violet-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-400" />
                    <span>{addr.isPrimary ? 'Primary Workplace Site Address' : `Service Location ${index + 1}`}</span>
                  </p>
                  
                  <p className="text-slate-300 font-medium">
                    {addr.street}, {addr.city}, {addr.state} • {addr.pincode}
                  </p>
                  
                  <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900/60 pt-1.5 mt-1.5 flex justify-between">
                    <span>GPS Lat: {addr.lat.toFixed(4)}° N</span>
                    <span>GPS Lng: {addr.lng.toFixed(4)}° E</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* UPI INSTANT PAY DISPATCH PAYMENT MODAL GATEWAY */}
      {isPayingSim && activePayingInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-sm w-full shadow-2xl border border-violet-500/20 overflow-hidden text-left font-sans">
            
            {/* Header section with neat design */}
            <div className="bg-slate-950 p-4 border-b border-slate-900 text-white flex justify-between items-center select-none">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-400 to-indigo-500 text-white flex items-center justify-center text-sm font-black">
                  ₹
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-white leading-tight">Razorpay Premium Secure API</h3>
                  <p className="text-[10px] text-violet-400 tracking-tight">Verified Corporate Billing Gateway</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPayingSim(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer hover:rotate-90 transition-transform duration-150"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 font-semibold text-left">
              
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2 text-left">
                <p className="font-black text-violet-400 uppercase tracking-widest text-[9px]">Imperial Acc. Merchant Code</p>
                <p className="font-black text-white text-sm leading-tight">ServiceFlow Pro Cloud Operations Limited</p>
                
                <div className="flex justify-between items-center pt-2.5 text-white font-extrabold border-t border-slate-800 mt-2.5 font-mono text-xs">
                  <span>Grand Total Payable:</span>
                  <span className="text-violet-400 text-base font-black">₹{activePayingInvoice.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Settle Instantly via UPI</p>
                
                <button
                  type="button"
                  onClick={() => {
                    onPayInvoice(activePayingInvoice.id);
                    setIsPayingSim(false);
                    triggerFeedback('Secure Transaction Complete! Razorpay webhook received, marking invoice status as PAID.');
                  }}
                  className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-black py-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer focus:outline-none uppercase tracking-wider"
                >
                  <CreditCard className="w-4 h-4 text-white" />
                  Authorize Secure Instant UPI Payment
                </button>
              </div>

              <p className="text-[9.5px] text-slate-500 italic text-center font-medium leading-normal">
                Generates end-of-turn UPI cryptographic receipts directly matching dispatch status codes.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
