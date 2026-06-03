import React, { useState } from 'react';
import { Company, AuditLog, NotificationMsg } from '../../data/mockData';
import { Shield, Settings, Server, Plus, CheckCircle, Database, ToggleLeft, ArrowRight, UserCheck, Key, HelpCircle } from 'lucide-react';

interface SuperAdminViewProps {
  companies: Company[];
  logs: AuditLog[];
  notifications: NotificationMsg[];
  onAddCompany: (company: Company) => void;
  onUpdateCompanyPlan: (companyId: string, plan: Company['plan']) => void;
}

export default function SuperAdminView({
  companies,
  logs,
  notifications,
  onAddCompany,
  onUpdateCompanyPlan
}: SuperAdminViewProps) {
  const [superTab, setSuperTab] = useState<'companies' | 'audit' | 'notifications' | 'settings'>('companies');
  
  // Create Company form state
  const [compName, setCompName] = useState('');
  const [compIndustry, setCompIndustry] = useState('HVAC Services');
  const [compPlan, setCompPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Starter');

  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div id="super-admin-view-root" className="space-y-6 text-left animate-fade-in">
      
      {/* Super banner widgets */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md backdrop-blur-sm">
        <div>
          <span className="bg-violet-500/10 text-violet-300 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border border-violet-500/20">
            System Overseer Suite
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>ServiceFlow Pro Global Systems Administrator</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Global Tenant isolation, subscriptions management, secure audit trails logging.</p>
        </div>

        <div className="flex gap-4 select-none shrink-0 font-mono text-xs">
          <div className="px-4 py-2 bg-slate-950/60 rounded-lg border border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Tenant Companies</p>
            <p className="text-sm font-bold text-white mt-0.5">{companies.length}</p>
          </div>
          <div className="px-4 py-2 bg-slate-950/60 rounded-lg border border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Logs Tracked</p>
            <p className="text-sm font-bold text-violet-400 mt-0.5">{logs.length}</p>
          </div>
          <div className="px-4 py-2 bg-slate-950/60 rounded-lg border border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Sec. Token Lease</p>
            <p className="text-sm font-bold text-teal-400 mt-0.5">24 Hours</p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left main pane */}
        <div className="w-full md:w-3/4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-950/40">
              {[
                { id: 'companies', label: `Registered Tenant Companies (${companies.length})` },
                { id: 'audit', label: `Audit Security Trails (${logs.length})` },
                { id: 'notifications', label: `Outbound SMS/Mail Centre (${notifications.length})` },
                { id: 'settings', label: 'Cloud Clusters config' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSuperTab(tab.id as any)}
                  className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 uppercase tracking-wide cursor-pointer ${
                    superTab === tab.id
                      ? 'border-indigo-500 text-white bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              
              {/* Companies management */}
              {superTab === 'companies' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-400 leading-tight">
                      <strong>Multi-Tenant Database Level:</strong> Sharded storage enforces row-level filters matching <code className="bg-indigo-950 text-indigo-300 px-1.5 py-0.5 font-mono rounded border border-indigo-500/20">tenant_id</code> security parameters across collections.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead className="bg-slate-950/50 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left">Tenant Name</th>
                          <th className="px-4 py-3 text-left">Operation Target</th>
                          <th className="px-4 py-3 text-left">Created On</th>
                          <th className="px-4 py-3 text-left">License Plan Tier</th>
                          <th className="px-4 py-3 text-right">Settings Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {companies.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg bg-slate-950 p-1 rounded border border-slate-800">{c.logo}</span>
                                <div>
                                  <p className="font-extrabold text-white text-sm">{c.name}</p>
                                  <p className="text-[10px] text-slate-500 font-mono">Company ID: tn_{c.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-300">{c.industry}</td>
                            <td className="px-4 py-3 font-mono text-slate-455">{c.createdAt}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                                c.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                                c.plan === 'Professional' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {c.plan}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <select
                                value={c.plan}
                                onChange={(e) => {
                                  onUpdateCompanyPlan(c.id, e.target.value as any);
                                  triggerFeedback(`Updated company ${c.name} plan tier successfully to ${e.target.value}!`);
                                }}
                                className="bg-slate-950 border border-slate-800 p-1.5 rounded font-semibold text-[10px] text-slate-300 focus:ring-1 focus:ring-indigo-500 cursor-pointer focus:outline-none"
                              >
                                <option value="Starter">Starter Plan</option>
                                <option value="Professional">Professional Tier</option>
                                <option value="Enterprise">Enterprise Elite</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Audit logs listing */}
              {superTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-slate-400">Continuous ledger recording security access keys, user sign-on transactions, and write modifications.</p>
                    <span className="text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded border border-violet-500/20 font-bold uppercase tracking-wider text-[10px]">
                      JWT Cryptographically Signed
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 font-mono text-[10.5px] text-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-200">
                            [{log.action}] <span className="text-indigo-400 font-bold">{log.userName}</span>
                          </p>
                          <p className="text-slate-400 italic text-xs">Details: {log.details}</p>
                          <p className="text-[9.5px] text-slate-505">Timestamp: {log.timestamp} • IP Key: {log.ipAddress}</p>
                        </div>
                        <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 font-bold rounded shrink-0 uppercase text-[9px]">
                          {log.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Push logs center */}
              {superTab === 'notifications' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">Outbound push notifications triggered across client, dispatcher, and WhatsApp notification nodes.</p>
                  
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                    {notifications.map((msg) => (
                      <div key={msg.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/30 flex justify-between items-start text-xs gap-3">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-slate-800 text-slate-200 font-bold px-2 py-0.5 border border-slate-700 rounded uppercase text-[10px]">
                              {msg.channel}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">{msg.timestamp}</span>
                          </div>
                          <p className="font-semibold text-white text-sm mt-1">Recipient Unit: {msg.recipient}</p>
                          <p className="text-slate-300 leading-relaxed font-sans">{msg.message}</p>
                        </div>

                        <span className="bg-emerald-500/10 text-emerald-350 font-bold border border-emerald-500/20 uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-full flex items-center gap-0.5">
                          ● {msg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General cluster configuration */}
              {superTab === 'settings' && (
                <div className="space-y-6 text-left text-xs">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">SaaS System Core Environment Knobs</h4>
                    <p className="text-slate-400 mt-0.5">Global operational flags affecting dispatch routines and security authentications.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg space-y-3">
                      <p className="font-bold text-white text-sm">Authentication Cryptography</p>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex justify-between items-center">
                          <span>Token Lease Validity:</span>
                          <span className="font-mono font-bold text-white">24h Hours (Default)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Salting Round Cost:</span>
                          <span className="font-mono font-bold text-white">12 Rounds (Bcrypt)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>MFA Enforcements:</span>
                          <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 font-bold px-1.5 py-0.5 rounded uppercase text-[10px]">Disabled for demo</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg space-y-3">
                      <p className="font-bold text-white text-sm">Geofencing & SLA Defaults</p>
                      <div className="space-y-2 text-slate-300">
                        <div className="flex justify-between items-center">
                          <span>Live Map Sweep Range:</span>
                          <span className="font-mono font-bold text-white">10 Kilometers max</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Critical SLA Resolution Block:</span>
                          <span className="font-mono font-bold text-white">4 Hours max threshold</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Auto-Backup Sync interval:</span>
                          <span className="font-mono font-bold text-white">Every Sunday 02:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right contextual creator pane */}
        <div className="w-full md:w-1/4 space-y-6">
          {superTab === 'companies' && (
            <div className="bg-slate-900/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 font-extrabold text-white text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Onboard SaaS Tenant</span>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-1">Company / Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. TVS Appliance Service"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full p-2.5 border border-slate-800 rounded-lg font-sans focus:ring-1 focus:ring-indigo-500 text-white bg-slate-950/60 focus:outline-none"
                  />
                  {compName && compName.length < 3 && (
                    <p className="text-[10px] text-violet-300 mt-1 font-semibold">Name should be at least 3 characters.</p>
                  )}
                  {!compName && (
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Required field</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Operation Industry</label>
                  <select
                    value={compIndustry}
                    onChange={(e) => setCompIndustry(e.target.value)}
                    className="w-full p-2.5 border border-slate-800 rounded-lg bg-slate-950/60 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="HVAC Services">Air Conditioning Repair</option>
                    <option value="ISP Services">Broadband Telecom ISP</option>
                    <option value="CCTV Installation">CCTV Surveillance Config</option>
                    <option value="Facility Management">Corporate Facility Mgmt</option>
                    <option value="Home Repairs">Electrical & Plumbing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">SaaS Subscription tier</label>
                  <select
                    value={compPlan}
                    onChange={(e) => setCompPlan(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-800 rounded-lg bg-slate-950/60 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Starter">Starter Plan</option>
                    <option value="Professional">Professional Tier</option>
                    <option value="Enterprise">Enterprise Elite</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!compName) {
                      triggerFeedback('⚠️ Error: Company name is required to onboard a tenant.');
                      return;
                    }
                    if (compName.length < 3) {
                      triggerFeedback('⚠️ Error: Company name must be at least 3 characters.');
                      return;
                    }
                    const logos = ['❄️', '🌐', '🛡️', '🔌', '🚰', '🧼'];
                    const chosenLogo = logos[Math.floor(Math.random() * logos.length)];
                    const newComp: Company = {
                      id: `c_${Date.now()}`,
                      name: compName,
                      industry: compIndustry,
                      logo: chosenLogo,
                      totalEmployees: 1,
                      createdAt: new Date().toISOString().split('T')[0],
                      plan: compPlan
                    };
                    onAddCompany(newComp);
                    setCompName('');
                    triggerFeedback(`✨ Success: Onboarded newly authenticated SaaS tenant company: ${newComp.name}!`);
                  }}
                  className="w-full bg-indigo-600 hover:bg-slate-100 hover:text-slate-950 text-white font-extrabold py-2.5 px-3 rounded-lg text-xs transition-all cursor-pointer shadow-sm focus:outline-none"
                >
                  Confirm SaaS Registry
                </button>
              </div>
            </div>
          )}

          {/* Database Specs Indicator card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/50 text-white rounded-xl border border-slate-800 p-5 space-y-3.5">
            <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-violet-300">
              <Database className="w-4 h-4" />
              <span>Multi-Tenant Cluster Node Security</span>
            </h4>
            <div className="text-slate-300 text-xs leading-relaxed space-y-2">
              <p>JWT payload verification is carried out strictly in our gateways. It validates claims matching Tenant scopes prior to running database aggregations.</p>
              <p className="bg-slate-950/85 p-2 text-[10px] rounded border border-slate-800 text-violet-200 leading-snug font-mono">
                "tenantId: ObjectId('tenant_coolbreeze_01')"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
