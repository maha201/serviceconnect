import React, { useState } from 'react';
import { Technician, Customer, Asset, InventoryItem, Invoice, AuditLog } from '../../data/mockData';
import { User, Plus, Edit, Trash, Package, Receipt, Award, CheckCircle, AlertTriangle, ShieldCheck, Download, Sparkles } from 'lucide-react';

interface CompanyAdminViewProps {
  technicians: Technician[];
  customers: Customer[];
  assets: Asset[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  logs: AuditLog[];
  onAddTechnician: (tech: Technician) => void;
  onAddCustomer: (customer: Customer) => void;
  onAddAsset: (asset: Asset) => void;
  onAddInventory: (item: InventoryItem) => void;
  onGenerateInvoice: (invoice: Invoice) => void;
}

export default function CompanyAdminView({
  technicians,
  customers,
  assets,
  inventory,
  invoices,
  logs,
  onAddTechnician,
  onAddCustomer,
  onAddAsset,
  onAddInventory,
  onGenerateInvoice
}: CompanyAdminViewProps) {
  const [adminTab, setAdminTab] = useState<'technicians' | 'customers' | 'assets' | 'inventory' | 'invoices'>('technicians');

  // Modal / Form States
  const [techForm, setTechForm] = useState({ name: '', mobile: '', skills: '', experience: 3 });
  const [custForm, setCustForm] = useState({ name: '', email: '', mobile: '', address: '', type: 'Residential' as 'Residential' | 'Commercial', notes: '' });
  const [assetForm, setAssetForm] = useState({ customerId: '', name: '', serial: '', category: 'HVAC', warranty: 'Active' as 'Active' | 'Expired' });
  const [invForm, setInvForm] = useState({ productName: '', sku: '', quantity: 10, cost: 500, supplier: '', safetyThreshold: 3, category: 'General' });
  const [invoiceForm, setInvoiceForm] = useState({ customerName: '', labor: 500, parts: 300, discount: 0 });

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const displayMessage = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const currentCompany = {
    name: 'CoolBreeze Air Conditioning Ltd',
    industry: 'HVAC & Smart Home Services',
    location: 'Bangalore, India'
  };

  return (
    <div id="company-admin-view" className="space-y-6 text-left">
      {/* Header Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-sm shadow-md">
        <div>
          <span className="bg-indigo-500/10 text-indigo-300 text-xs px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider border border-indigo-500/20">Company Workspace</span>
          <h2 className="text-2xl font-black tracking-tight mt-2">{currentCompany.name}</h2>
          <p className="text-slate-400 text-sm">{currentCompany.industry} • Multi-Tenant Node ID: <code className="text-indigo-400 font-mono">tenant_coolbreeze_01</code></p>
        </div>
        <div className="flex gap-3 select-none">
          <div className="p-3 bg-slate-950/60 rounded-xl text-center border border-slate-800 min-w-[100px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Technicians</p>
            <p className="text-xl font-black text-white mt-1">{technicians.length}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl text-center border border-slate-800 min-w-[100px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assets Tracked</p>
            <p className="text-xl font-black text-indigo-400 mt-1">{assets.length}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl text-center border border-slate-800 min-w-[120px]">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Invoiced Revenue</p>
            <p className="text-xl font-black text-emerald-400 mt-1">
              ₹{invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Navigation and Actions Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column Controls */}
        <div className="w-full lg:w-3/4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-950/40 pb-px">
              {[
                { id: 'technicians', label: `Staff & Techs (${technicians.length})` },
                { id: 'customers', label: `Customers (${customers.length})` },
                { id: 'assets', label: `Client Assets (${assets.length})` },
                { id: 'inventory', label: `SKU Inventory (${inventory.length})` },
                { id: 'invoices', label: `GST Billing (${invoices.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`px-5 py-4 text-xs font-bold whitespace-nowrap transition-colors border-b-2 uppercase tracking-wider cursor-pointer ${
                    adminTab === tab.id
                      ? 'border-indigo-500 text-white bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Technicians Tab */}
              {adminTab === 'technicians' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="font-extrabold text-white text-base">Active Field Engineers</h3>
                    <span className="text-xs text-slate-400 font-medium">Auto-tracking status indicators</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead className="bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left">Employee</th>
                          <th className="px-4 py-3 text-left">Skills Core</th>
                          <th className="px-4 py-3 text-left">Availability</th>
                          <th className="px-4 py-3 text-left">Exp</th>
                          <th className="px-4 py-3 text-right">Performance Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {technicians.map((tech) => (
                          <tr key={tech.id} className="hover:bg-slate-900/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold uppercase text-xs">
                                  {tech.name.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-extrabold text-white text-sm">{tech.name}</p>
                                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tech.employeeId} • {tech.mobile}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {tech.skills.map((skill, i) => (
                                  <span key={i} className="bg-slate-950 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800 font-mono">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                tech.availability === 'Available' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                                tech.availability === 'Busy' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${tech.availability === 'Available' ? 'bg-emerald-400' : 'bg-violet-400'}`} />
                                {tech.availability}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-400">{tech.experienceYears} yrs</td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-mono font-bold text-violet-300 bg-violet-500/5 px-2 py-1 rounded border border-violet-500/10 text-xs">
                                ★ {tech.performanceScore}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Customers Tab */}
              {adminTab === 'customers' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="font-extrabold text-white text-base">Registered Company Accounts</h3>
                    <span className="text-xs text-slate-400 font-medium">Auto-filtering matching Multi-Tenant scope</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead className="bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left">Customer Account</th>
                          <th className="px-4 py-3 text-left">Sector type</th>
                          <th className="px-4 py-3 text-left">Primary Address Location</th>
                          <th className="px-4 py-3 text-right">Site count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {customers.map((cust) => (
                          <tr key={cust.id} className="hover:bg-slate-900/30">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-extrabold text-white text-sm">{cust.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{cust.email} • {cust.mobile}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase border ${
                                cust.type === 'Commercial' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}>
                                {cust.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-[280px] truncate text-slate-400 font-medium">
                              {cust.addresses[0]?.street}, {cust.addresses[0]?.city}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-300">
                              {cust.addresses.length} Site(s)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Assets Tab */}
              {adminTab === 'assets' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="font-extrabold text-white text-base">Client Contracted Machines (Assets Index)</h3>
                    <span className="text-xs text-slate-400 font-medium">Continuous telemetry mapping logs</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead className="bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left">Asset / Model Model</th>
                          <th className="px-4 py-3 text-left">Owner client Name</th>
                          <th className="px-4 py-3 text-left">Sector category</th>
                          <th className="px-4 py-3 text-left">Warranty lock status</th>
                          <th className="px-4 py-3 text-right">Job card history</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {assets.map((asset) => {
                          const owner = customers.find(c => c.id === asset.customerId);
                          return (
                            <tr key={asset.id} className="hover:bg-slate-900/30">
                              <td className="px-4 py-3 font-semibold text-slate-205">
                                <div>
                                  <p className="font-extrabold text-white text-sm">{asset.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Serial: {asset.serialNumber}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-300 font-medium">{owner ? owner.name : 'Unknown Account'}</td>
                              <td className="px-4 py-3 font-medium text-slate-400">{asset.category}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                                  asset.warrantyStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                }`}>
                                  {asset.warrantyStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-indigo-400">
                                {asset.serviceHistoryCount || 0} history
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SKU Inventory Tab */}
              {adminTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="font-extrabold text-white text-base">Warehouse Spares & Core Stock Holding</h3>
                    <span className="text-xs text-rose-400 font-medium animate-pulse">Low stock threshold triggers set to auto-requisition</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead className="bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left">SKU description</th>
                          <th className="px-4 py-3 text-left">Material barcode ID</th>
                          <th className="px-4 py-3 text-left">Supplier origin</th>
                          <th className="px-4 py-3 text-left">Holding levels</th>
                          <th className="px-4 py-3 text-right">Unit Price (cost)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {inventory.map((inv) => {
                          const isLowStock = inv.quantity <= inv.safetyThreshold;
                          return (
                            <tr key={inv.id} className="hover:bg-slate-900/30">
                              <td className="px-4 py-3">
                                <span className="font-extrabold text-white text-sm">{inv.productName}</span>
                              </td>
                              <td className="px-4 py-3 font-mono font-medium text-slate-400">{inv.sku}</td>
                              <td className="px-4 py-3 font-medium text-slate-500">{inv.supplier}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border ${
                                  isLowStock ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-slate-800 text-slate-200 border-slate-700'
                                }`}>
                                  {inv.quantity} units {isLowStock ? '(Low Stock)':''}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-violet-300">
                                ₹{inv.cost.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* GST Billing Tab */}
              {adminTab === 'invoices' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="font-extrabold text-white text-base">Invoices Ledger & Compliance Registry</h3>
                    <span className="text-xs text-slate-400 font-medium">Standard tax calculation @ 18% IGST</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead className="bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left">Invoice serial</th>
                          <th className="px-4 py-3 text-left">Billed Account</th>
                          <th className="px-4 py-3 text-left">SLA labor</th>
                          <th className="px-4 py-3 text-left">Material costs</th>
                          <th className="px-4 py-3 text-left">Aggregate Taxed</th>
                          <th className="px-4 py-3 text-right">Payment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {invoices.map((inv) => {
                          return (
                            <tr key={inv.id} className="hover:bg-slate-900/30">
                              <td className="px-4 py-3">
                                <p className="font-mono font-bold text-indigo-400">{inv.invoiceNumber}</p>
                                <p className="text-[10px] text-slate-500">{inv.workOrderId === 'wo_manual' ? 'Manual Invoice':'W.O. Linked'}</p>
                              </td>
                              <td className="px-4 py-3 font-semibold text-white">{inv.customerName}</td>
                              <td className="px-4 py-3 font-mono text-slate-400">₹{inv.laborCharges.toLocaleString()}</td>
                              <td className="px-4 py-3 font-mono text-slate-400">₹{inv.partsCharges.toLocaleString()}</td>
                              <td className="px-4 py-3 font-mono font-black text-white text-sm">
                                ₹{inv.total.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                                  inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20 animate-pulse'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column Form Creators */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Quick Creator contextual to chosen tab */}
          {adminTab === 'technicians' && (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center gap-1.5 text-white font-bold text-sm">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Onboard Engineer</span>
              </div>
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Sundar R"
                    value={techForm.name}
                    onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 90000 00000"
                    value={techForm.mobile}
                    onChange={(e) => setTechForm({ ...techForm, mobile: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Specialist Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Router splicing, FTTH config"
                    value={techForm.skills}
                    onChange={(e) => setTechForm({ ...techForm, skills: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Years of Experience ({techForm.experience} yrs)</label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={techForm.experience}
                    onChange={(e) => setTechForm({ ...techForm, experience: Number(e.target.value) })}
                    className="w-full cursor-pointer accent-indigo-500 h-1 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!techForm.name || !techForm.mobile) {
                      displayMessage('⚠️ Validation Warning: Technician name and mobile contact are both required.');
                      return;
                    }
                    const newTech: Technician = {
                      id: `t_${Date.now()}`,
                      employeeId: `TECH-${Math.floor(Math.random() * 900) + 100}`,
                      name: techForm.name,
                      mobile: techForm.mobile,
                      skills: techForm.skills ? techForm.skills.split(',').map(s => s.trim()) : ['General Repairs'],
                      experienceYears: techForm.experience,
                      availability: 'Available',
                      currentLocation: { lat: 12.9716, lng: 77.5946, address: 'Central Bangalore' },
                      performanceScore: 90,
                      completedJobsCount: 0,
                      dailyRoute: [{ lat: 12.9716, lng: 77.5946, label: 'Base Office' }]
                    };
                    onAddTechnician(newTech);
                    setTechForm({ name: '', mobile: '', skills: '', experience: 3 });
                    displayMessage(`✨ Success: Technician ${newTech.name} has been onboarded!`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer focus:outline-none shadow"
                >
                  Confirm Entry
                </button>
              </div>
            </div>
          )}

          {adminTab === 'customers' && (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center gap-1.5 text-white font-bold text-sm">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Onboard Customer</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Client name or Company"
                    value={custForm.name}
                    onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    value={custForm.type}
                    onChange={(e) => setCustForm({ ...custForm, type: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={custForm.email}
                    onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mobile</label>
                  <input
                    type="text"
                    placeholder="+91 xxxxx xxxxx"
                    value={custForm.mobile}
                    onChange={(e) => setCustForm({ ...custForm, mobile: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Site Address</label>
                  <textarea
                    placeholder="Full street address..."
                    value={custForm.address}
                    onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-16"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!custForm.name || !custForm.address) {
                      displayMessage('⚠️ Validation Warning: Please fill in at least the client Name and Site Address.');
                      return;
                    }
                    const newCust: Customer = {
                      id: `cust_${Date.now()}`,
                      name: custForm.name,
                      mobile: custForm.mobile || '+91 99999 99999',
                      email: custForm.email || 'customer@gmail.com',
                      type: custForm.type,
                      addresses: [
                        {
                          id: `addr_${Date.now()}`,
                          street: custForm.address,
                          city: 'Bangalore',
                          state: 'Karnataka',
                          pincode: '560001',
                          isPrimary: true,
                          lat: 12.9716 + (Math.random() - 0.5) * 0.05,
                          lng: 77.5946 + (Math.random() - 0.5) * 0.05
                        }
                      ],
                      notes: custForm.notes
                    };
                    onAddCustomer(newCust);
                    setCustForm({ name: '', email: '', mobile: '', address: '', type: 'Residential', notes: '' });
                    displayMessage(`✨ Success: Customer ${newCust.name} has been successfully registered.`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-colors cursor-pointer focus:outline-none shadow"
                >
                  Add Customer Record
                </button>
              </div>
            </div>
          )}

          {adminTab === 'assets' && (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center gap-1.5 text-white font-bold text-sm">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Register Machine Asset</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Customer Owner</label>
                  <select
                    value={assetForm.customerId}
                    onChange={(e) => setAssetForm({ ...assetForm, customerId: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-slate-300 bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">-- Choose Account --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-slate-205">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Asset Machine Model Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Daikin Inverter split 1.5T"
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="E.g. SN-903281-W"
                    value={assetForm.serial}
                    onChange={(e) => setAssetForm({ ...assetForm, serial: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Industry Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-slate-300 bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="HVAC">HVAC Services</option>
                    <option value="Security CCTV">Security CCTV</option>
                    <option value="Broadband Fiber">Broadband Fiber</option>
                    <option value="Home Appliance">Home Appliance</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (!assetForm.customerId || !assetForm.name || !assetForm.serial) {
                      displayMessage('⚠️ Validation Warning: Owner customer selection, item name, and serial serial key are required.');
                      return;
                    }
                    const newAsset: Asset = {
                      id: `a_${Date.now()}`,
                      customerId: assetForm.customerId,
                      name: assetForm.name,
                      serialNumber: assetForm.serial,
                      category: assetForm.category,
                      purchaseDate: '2025-06-03',
                      installationDate: '2025-06-04',
                      warrantyStatus: assetForm.warranty,
                      nextServiceDueDate: '2026-12-03',
                      serviceHistoryCount: 0
                    };
                    onAddAsset(newAsset);
                    setAssetForm({ customerId: '', name: '', serial: '', category: 'HVAC', warranty: 'Active' });
                    displayMessage(`✨ Success: Contractor machine asset ${newAsset.name} has been added under customer catalog!`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-colors cursor-pointer focus:outline-none shadow"
                >
                  Onboard Machine Asset
                </button>
              </div>
            </div>
          )}

          {adminTab === 'inventory' && (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center gap-1.5 text-white font-bold text-sm">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Onboard Inventory SKU</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Copper Pipe Coil 5m"
                    value={invForm.productName}
                    onChange={(e) => setInvForm({ ...invForm, productName: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">SKU Unique Identifier</label>
                  <input
                    type="text"
                    placeholder="INV-COPPER-PIPE"
                    value={invForm.sku}
                    onChange={(e) => setInvForm({ ...invForm, sku: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Qty</label>
                    <input
                      type="number"
                      value={invForm.quantity}
                      onChange={(e) => setInvForm({ ...invForm, quantity: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Cost (₹)</label>
                    <input
                      type="number"
                      value={invForm.cost}
                      onChange={(e) => setInvForm({ ...invForm, cost: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Supplier Tag</label>
                  <input
                    type="text"
                    placeholder="E.g. MetalTube Ltd"
                    value={invForm.supplier}
                    onChange={(e) => setInvForm({ ...invForm, supplier: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!invForm.productName || !invForm.sku) {
                      displayMessage('⚠️ Validation Warning: Part description and barcode SKU are required.');
                      return;
                    }
                    const newItem: InventoryItem = {
                      id: `sku_${Date.now()}`,
                      productName: invForm.productName,
                      sku: invForm.sku,
                      quantity: invForm.quantity,
                      cost: invForm.cost,
                      supplier: invForm.supplier || 'Warehouse Direct',
                      safetyThreshold: invForm.safetyThreshold,
                      category: invForm.category
                    };
                    onAddInventory(newItem);
                    setInvForm({ productName: '', sku: '', quantity: 10, cost: 500, supplier: '', safetyThreshold: 3, category: 'General' });
                    displayMessage(`✨ Success: SKU item ${newItem.productName} updated in warehouse holdings.`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-colors cursor-pointer focus:outline-none shadow"
                >
                  Onboard Warehouse Core
                </button>
              </div>
            </div>
          )}

          {adminTab === 'invoices' && (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center gap-1.5 text-white font-bold text-sm">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Write GST Invoice</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Customer Account</label>
                  <select
                    value={invoiceForm.customerName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, customerName: e.target.value })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-slate-300 bg-slate-950/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">-- Choose Account --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name} className="bg-slate-900 text-slate-205">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Labor (₹)</label>
                    <input
                      type="number"
                      value={invoiceForm.labor}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, labor: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Parts (₹)</label>
                    <input
                      type="number"
                      value={invoiceForm.parts}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, parts: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Special Discount (₹)</label>
                  <input
                    type="number"
                    value={invoiceForm.discount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-800 rounded-lg text-white bg-slate-950/60 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!invoiceForm.customerName) {
                      displayMessage('⚠️ Validation Warning: Please select a registered customer to anchor this invoice.');
                      return;
                    }
                    const baseTotal = invoiceForm.labor + invoiceForm.parts - invoiceForm.discount;
                    const taxRate = 0.18; // 18% GST standard
                    const newInvoice: Invoice = {
                      id: `inv_${Date.now()}`,
                      invoiceNumber: `INV-FLOW-${Math.floor(Math.random() * 8999) + 1000}`,
                      workOrderId: 'wo_manual',
                      customerName: invoiceForm.customerName,
                      laborCharges: invoiceForm.labor,
                      partsCharges: invoiceForm.parts,
                      discount: invoiceForm.discount,
                      taxRate,
                      total: Math.round(baseTotal * (1 + taxRate)),
                      status: 'Unpaid'
                    };
                    onGenerateInvoice(newInvoice);
                    displayMessage(`✨ Success: Manual invoice ${newInvoice.invoiceNumber} recorded!`);
                    setInvoiceForm({ customerName: '', labor: 500, parts: 300, discount: 0 });
                  }}
                  className="w-full bg-emerald-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer focus:outline-none shadow"
                >
                  Confirm GST Invoice
                </button>
              </div>
            </div>
          )}

          {/* SLA Metrics Sidebar Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950/50 text-white rounded-xl border border-slate-800 p-5 space-y-3 shadow shadow-indigo-950/30">
            <h4 className="font-bold text-sm flex items-center gap-1.5 text-indigo-300">
              <Award className="w-4 h-4 text-violet-300" />
              <span>SLA Target Quality</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-200 font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-300">First Response Mean:</span>
                <span className="font-mono font-bold text-violet-300">14 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Job Completed SLA:</span>
                <span className="font-mono font-bold text-emerald-400">96.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">NPS Satisfaction:</span>
                <span className="font-mono font-bold text-sky-400">4.8 / 5.0</span>
              </div>
            </div>
            <div className="bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-900/40 text-[10px] text-slate-400 italic font-medium leading-relaxed mt-2">
              "Continuous geofence proximity dispatches reduce overall travel and match workloads by automatically tracking local availability scores."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
