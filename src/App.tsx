import React, { useState } from 'react';
import {
  INITIAL_COMPANIES,
  INITIAL_TECHNICIANS,
  INITIAL_CUSTOMERS,
  INITIAL_ASSETS,
  INITIAL_TICKETS,
  INITIAL_WORKORDERS,
  INITIAL_INVENTORY,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  Company,
  User,
  Technician,
  Customer,
  Asset,
  Ticket,
  WorkOrder,
  InventoryItem,
  Invoice,
  AuditLog,
  NotificationMsg
} from './data/mockData';

// Role View Components
import SuperAdminView from './components/RoleViews/SuperAdminView';
import CompanyAdminView from './components/RoleViews/CompanyAdminView';
import DispatcherView from './components/RoleViews/DispatcherView';
import TechnicianView from './components/RoleViews/TechnicianView';
import CustomerView from './components/RoleViews/CustomerView';
import ArchitectureView from './components/ArchitectureView';

// Icons
import {
  Shield,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  HelpCircle,
  FileCode,
  Users,
  Percent,
  Warehouse,
  Flame,
  Award,
  BookOpen,
  LogOut,
  Lock,
  Mail,
  ArrowRight,
  Building
} from 'lucide-react';

export default function App() {
  // Global States (acting as local memory DB)
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORKORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationMsg[]>(INITIAL_NOTIFICATIONS);

  // Authentication & Session States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: 'Super Admin' | 'Company Admin' | 'Dispatcher' | 'Technician' | 'Customer';
    avatar: string;
    organization?: string;
  }>({
    name: '',
    email: '',
    role: 'Company Admin',
    avatar: ''
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Role Simulator State
  const [activeRole, setActiveRole] = useState<'Super Admin' | 'Company Admin' | 'Dispatcher' | 'Technician' | 'Customer'>('Company Admin');
  
  // Navigation: Toggle between Operational View and Technical Specs Blueprint
  const [navSection, setNavSection] = useState<'console' | 'specs'>('console');

  // Chart configuration simulation
  const [chartMetric, setChartMetric] = useState<'tickets' | 'revenue'>('tickets');

  const triggerDirectLogin = (role: 'Super Admin' | 'Company Admin' | 'Dispatcher' | 'Technician' | 'Customer') => {
    setLoginError('');
    setIsLoggedIn(true);
    setActiveRole(role);
    if (role === 'Super Admin') {
      setCurrentUser({
        name: 'Alex Henderson',
        email: 'alex.h@serviceflow.com',
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        organization: 'ServiceFlow SaaS Global Office'
      });
    } else if (role === 'Company Admin') {
      setCurrentUser({
        name: 'Mahadevan',
        email: 'mahadevan@actech.in',
        role: 'Company Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        organization: 'CoolBreeze Air Conditioners'
      });
    } else if (role === 'Dispatcher') {
      setCurrentUser({
        name: 'Anil Kumar',
        email: 'anil.k@actech.in',
        role: 'Dispatcher',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        organization: 'CoolBreeze Dispatch Hub'
      });
    } else if (role === 'Technician') {
      setCurrentUser({
        name: 'Karthik Raja',
        email: 'karthik@actech.in',
        role: 'Technician',
        avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=150',
        organization: 'CoolBreeze Mobile Repairs'
      });
    } else if (role === 'Customer') {
      setCurrentUser({
        name: 'Venkatesh Prasad',
        email: 'venkatesh@gmail.com',
        role: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        organization: 'Plaza Residential Block'
      });
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Complete check required. Please input your credentials.');
      return;
    }
    // Matching heuristics to enable typing simulator
    const emailLower = loginEmail.toLowerCase();
    if (emailLower.includes('alex') || emailLower.includes('super')) {
      triggerDirectLogin('Super Admin');
    } else if (emailLower.includes('mahadevan') || emailLower.includes('admin') || emailLower.includes('company')) {
      triggerDirectLogin('Company Admin');
    } else if (emailLower.includes('anil') || emailLower.includes('dispatch')) {
      triggerDirectLogin('Dispatcher');
    } else if (emailLower.includes('karthik') || emailLower.includes('tech')) {
      triggerDirectLogin('Technician');
    } else if (emailLower.includes('venkatesh') || emailLower.includes('customer') || emailLower.includes('client')) {
      triggerDirectLogin('Customer');
    } else {
      triggerDirectLogin('Company Admin');
    }
  };

  // Unified State Handlers (Passed down to child views)
  
  // 1. Super Admin Handlers
  const handleAddCompany = (newCompany: Company) => {
    setCompanies([...companies, newCompany]);
    
    // Add audit log
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_super',
      userName: 'Super Admin',
      role: 'Super Admin',
      action: 'TENANT_ONBOARD',
      details: `Onboarded new SaaS tenant company: ${newCompany.name}`,
      ipAddress: '192.168.1.1'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleUpdateCompanyPlan = (companyId: string, plan: Company['plan']) => {
    setCompanies(companies.map(c => c.id === companyId ? { ...c, plan } : c));
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_super',
      userName: 'Super Admin',
      role: 'Super Admin',
      action: 'TENANT_PLAN_UPGRADE',
      details: `Modified subscription plan for tenant ID ${companyId} to ${plan}`,
      ipAddress: '192.168.1.1'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // 2. Company Admin Handlers
  const handleAddTechnician = (newTech: Technician) => {
    setTechnicians([...technicians, newTech]);
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_com_admin',
      userName: 'Mahadevan (Company Admin)',
      role: 'Company Admin',
      action: 'TECHNICIAN_ONBOARD',
      details: `Registered technician ${newTech.name} with ID: ${newTech.employeeId}`,
      ipAddress: '106.51.242.12'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_com_admin',
      userName: 'Mahadevan (Company Admin)',
      role: 'Company Admin',
      action: 'CUSTOMER_ONBOARD',
      details: `Onboarded customer ${newCustomer.name}`,
      ipAddress: '106.51.242.12'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleAddAsset = (newAsset: Asset) => {
    setAssets([...assets, newAsset]);
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_com_admin',
      userName: 'Mahadevan (Company Admin)',
      role: 'Company Admin',
      action: 'ASSET_LOG',
      details: `Registered machine asset ${newAsset.name} / SN: ${newAsset.serialNumber}`,
      ipAddress: '106.51.242.12'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleAddInventory = (newInv: InventoryItem) => {
    setInventory([...inventory, newInv]);
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_com_admin',
      userName: 'Mahadevan (Company Admin)',
      role: 'Company Admin',
      action: 'INVENTORY_ADD',
      details: `Added new stock item SLA: ${newInv.productName} SKU: ${newInv.sku}`,
      ipAddress: '106.51.242.12'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleGenerateInvoice = (newInvSchema: Invoice) => {
    setInvoices([newInvSchema, ...invoices]);
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_com_admin',
      userName: 'Mahadevan (Company Admin)',
      role: 'Company Admin',
      action: 'INVOICE_CREATE',
      details: `Manually generated pending invoice for customer: ${newInvSchema.customerName}`,
      ipAddress: '106.51.242.12'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // 3. Dispatcher Handlers
  const handleAssignTicket = (ticketId: string, technicianId: string) => {
    const techName = technicians.find(tec => tec.id === technicianId)?.name || 'Specialist';
    
    // Update active status in ticket
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { ...t, status: 'Assigned', assignedTechnicianId: technicianId, assignedTechnicianName: techName } 
        : t
    ));

    // Update technician availability
    setTechnicians(technicians.map(tec => 
      tec.id === technicianId 
        ? { ...tec, availability: 'Busy', activeJobId: `wo_${ticketId}` } 
        : tec
    ));

    // Create or link work order
    const hasWO = workOrders.some(wo => wo.ticketId === ticketId);
    if (!hasWO) {
      const activeTicketRef = tickets.find(t => t.id === ticketId);
      const newWO: WorkOrder = {
        id: `wo_${Date.now()}`,
        workOrderNumber: `WO-2026-${Math.floor(Math.random()*8999)+1000}`,
        ticketId: ticketId,
        ticketNumber: activeTicketRef?.ticketNumber || 'TKT-GEN',
        technicianId: technicianId,
        scheduledDate: '2026-06-03',
        estimatedHours: 2,
        serviceCost: 1500,
        partsCost: 0,
        checklist: [
          { task: 'Initial diagnostics check on site', done: true },
          { task: 'Clean dirt blockage assembly', done: false },
          { task: 'Voltage test and ground loop integrity', done: false },
          { task: 'Final feedback customer signature capture', done: false }
        ],
        notes: 'Priority dispatch scheduled from AI smart dispatch workload logs.'
      };
      setWorkOrders([newWO, ...workOrders]);
    }

    // Outbound notifications triggers simulation
    const phoneNo = technicians.find(tec => tec.id === technicianId)?.mobile || '+91 90000 00000';
    const clientName = tickets.find(t => t.id === ticketId)?.customerName || 'Customer';
    const clientEmail = customers.find(c => c.name === clientName)?.email || 'client@gmail.com';

    const techNotif: NotificationMsg = {
      id: `not_${Date.now()}_t`,
      timestamp: new Date().toLocaleTimeString(),
      recipient: `${techName} (${phoneNo})`,
      channel: 'WhatsApp',
      event: 'Technician Assigned',
      message: `Hello ${techName}, Ticket ${ticketId} for customer ${clientName} is now assigned to you. ETA holds 20 mins.`,
      status: 'Sent'
    };

    const clientNotif: NotificationMsg = {
      id: `not_${Date.now()}_c`,
      timestamp: new Date().toLocaleTimeString(),
      recipient: clientEmail,
      channel: 'Email',
      event: 'Job Status Shift',
      message: `Dear ${clientName}, Technician ${techName} has been assigned to coordinate your service task. Watch progress live on client dashboard.`,
      status: 'Sent'
    };

    setNotifications([techNotif, clientNotif, ...notifications]);

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_disp1',
      userName: 'Anil Kumar (Dispatcher)',
      role: 'Dispatcher',
      action: 'ASSIGN_TICKET',
      details: `Assigned Ticket ID ${ticketId} to Technician ${techName}`,
      ipAddress: '192.168.1.144'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleAutoAssignAI = (ticketId: string) => {
    // Basic heuristics: Pick first available technician
    const availTech = technicians.find(tec => tec.availability === 'Available') || technicians[0];
    if (availTech) {
      handleAssignTicket(ticketId, availTech.id);
      alert(`AI Engine Auto-Assigned Ticket to: ${availTech.name} (Distance Match: 98% Confidence)`);
    }
  };

  // 4. Technician Handlers
  const handleUpdateStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status } : t));

    // If status is completed, release technician back to Available and generate invoice
    if (status === 'Completed') {
      const activeTkt = tickets.find(t => t.id === ticketId);
      if (activeTkt) {
        setTechnicians(technicians.map(tec => 
          tec.id === activeTkt.assignedTechnicianId 
            ? { ...tec, availability: 'Available', completedJobsCount: tec.completedJobsCount + 1 } 
            : tec
        ));

        // Generate Invoice automatically
        const assocWO = workOrders.find(wo => wo.ticketId === ticketId);
        const laborVal = assocWO?.serviceCost || 1500;
        const partsVal = assocWO?.partsCost || 250;
        const totalTaxRate = 0.18; // GST 18%
        
        const newAutoInvoice: Invoice = {
          id: `inv_auto_${Date.now()}`,
          invoiceNumber: `INV-AUTO-${Math.floor(Math.random() * 89999) + 10000}`,
          workOrderId: assocWO?.id || 'wo_auto',
          customerName: activeTkt.customerName,
          laborCharges: laborVal,
          partsCharges: partsVal,
          discount: 100,
          taxRate: totalTaxRate,
          total: Math.round((laborVal + partsVal - 100) * (1 + totalTaxRate)),
          status: 'Unpaid'
        };
        setInvoices([newAutoInvoice, ...invoices]);

        // Trigger WhatsApp alert to client
        const customerContact = customers.find(c => c.name === activeTkt.customerName)?.mobile || '+91 99999 99999';
        const billNotif: NotificationMsg = {
          id: `not_bill_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          recipient: `${activeTkt.customerName} (${customerContact})`,
          channel: 'WhatsApp',
          event: 'Invoice Generated',
          message: `Good day! Service job completed. Manual invoice ${newAutoInvoice.invoiceNumber} for amount INR ${newAutoInvoice.total} is raised. Pay securely via Razorpay on client dashboard.`,
          status: 'Sent'
        };
        setNotifications([billNotif, ...notifications]);
      }
    }

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: `usr_tech`,
      userName: 'Technician Workspace',
      role: 'Technician',
      action: 'STATUS_UPDATE',
      details: `Updated Ticket ${ticketId} status to [${status}]`,
      ipAddress: '157.44.11.203'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleUpdateChecklist = (woId: string, taskIndex: number, done: boolean) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === woId) {
        const updatedCheck = [...wo.checklist];
        updatedCheck[taskIndex] = { ...updatedCheck[taskIndex], done };
        return { ...wo, checklist: updatedCheck };
      }
      return wo;
    }));
  };

  const handleSubmitSignature = (woId: string, dataUrl: string) => {
    setWorkOrders(workOrders.map(wo => wo.id === woId ? { ...wo, signature: dataUrl } : wo));
    
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_tech',
      userName: 'Technician Space',
      role: 'Technician',
      action: 'SIGNATURE_CAPTURE',
      details: `Captured legal digital signature for Work Order ${woId}`,
      ipAddress: '157.34.1.20'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleAttachPhoto = (woId: string, type: 'before' | 'after', url: string) => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === woId) {
        return type === 'before'
          ? { ...wo, photoBefore: url }
          : { ...wo, photoAfter: url };
      }
      return wo;
    }));
  };

  const handleUseInventory = (sku: string, qty: number) => {
    setInventory(inventory.map(item => 
      item.sku === sku
        ? { ...item, quantity: Math.max(0, item.quantity - qty) }
        : item
    ));

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_tech',
      userName: 'Technician Workspace',
      role: 'Technician',
      action: 'CONSUME_INVENTORY',
      details: `Deducted stock SKU ${sku} by ${qty} units for site repair operations`,
      ipAddress: '157.34.1.20'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // 5. Customer Handlers
  const handleCreateTicket = (newTkt: Ticket) => {
    setTickets([newTkt, ...tickets]);
    
    const logsObj: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_client',
      userName: `${customerAccount.name} (Customer)`,
      role: 'Customer',
      action: 'TICKET_CREATE',
      details: `Raised ticketing issue for ${newTkt.category} category. Description: ${newTkt.description}`,
      ipAddress: '122.174.12.98'
    };
    setAuditLogs([logsObj, ...auditLogs]);
  };

  const handlePayInvoice = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'Paid', paymentDate: '2026-06-03', paymentMethod: 'UPI / Razorpay' } 
        : inv
    ));

    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_client',
      userName: 'Customer Gateway',
      role: 'Customer',
      action: 'PAYMENT_CAPTURE',
      details: `Razorpay UPI capture successful for Invoice ID ${invoiceId}`,
      ipAddress: '122.174.12.98'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  const handleSubmitFeedback = (rating: number, review: string) => {
    // Set feedback audit trail
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr_client',
      userName: 'Customer Feedback',
      role: 'Customer',
      action: 'FEEDBACK_SUBMIT',
      details: `Logged NPS satisfaction rating score: ${rating} Stars. Comments: "${review}"`,
      ipAddress: '122.174.12.98'
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Mock static user accounts chosen as contextual role actors
  const customerAccount = customers[0]; // Venkatesh Prasad
  const technicianAccount = technicians[0]; // Karthik Raja

  // Computing Live metrics indicators dynamically
  const openCount = tickets.filter(t => t.status === 'New').length;
  const wipCount = tickets.filter(t => t.status === 'Work In Progress' || t.status === 'On The Way' || t.status === 'Arrived').length;
  const doneCount = tickets.filter(t => t.status === 'Completed' || t.status === 'Closed').length;
  
  // Simulated revenue today calculation
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);

  // Dynamic role-wise KPIs definition as requested by user
  let roleKpis: Array<{ title: string; val: string | number; sub: string; icon: any; color: string }> = [];

  if (activeRole === 'Super Admin') {
    roleKpis = [
      { title: 'Global SaaS Tenants', val: companies.length, sub: 'Active SaaS Companies', icon: Shield, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
      { title: 'Estimated SaaS MRR', val: `₹${(companies.reduce((acc, c) => acc + (c.plan === 'Enterprise' ? 12000 : c.plan === 'Professional' ? 6500 : 3000), 0) + 124500).toLocaleString('en-IN')}`, sub: 'Active Subscription Value', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      { title: 'Audit Trail Logs', val: auditLogs.length, sub: 'Global Actions Logged', icon: FileCode, color: 'text-rose-600 bg-rose-50 border-rose-100' },
      { title: 'System Alerts Log', val: notifications.length, sub: 'Dispatch Alerts Fired', icon: Sparkles, color: 'text-violet-600 bg-violet-50 border-violet-100' },
      { title: 'Engineers Network', val: technicians.length, sub: 'Registered Techs count', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
      { title: 'SaaS SLA Rating', val: '99.4%', sub: 'Mean SaaS Availability', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-100' }
    ];
  } else if (activeRole === 'Company Admin') {
    roleKpis = [
      { title: 'Registered Techs', val: technicians.length, sub: 'Direct staff roster', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
      { title: 'Tracked core Assets', val: assets.length, sub: 'Registered HVAC/Broadband', icon: Layers, color: 'text-orange-600 bg-orange-50 border-orange-100' },
      { title: 'Onboarded Accounts', val: customers.length, sub: 'B2B client listings', icon: UserCheck, color: 'text-teal-600 bg-teal-50 border-teal-100' },
      { title: 'GST Billing Invoiced', val: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'Net invoice amount sum', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      { title: 'Parts SKUs Active', val: `${inventory.length} SKUs`, sub: 'Trunk stockpile SKUs', icon: Warehouse, color: 'text-violet-600 bg-violet-50 border-violet-100' },
      { title: 'Company NPS Average', val: '84.2', sub: '96.8% SLA Performance', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-100' }
    ];
  } else if (activeRole === 'Dispatcher') {
    const unassignedCount = tickets.filter(t => t.status === 'New').length;
    const activeRouteCount = tickets.filter(t => ['Work In Progress', 'On The Way', 'Accepted', 'Arrived'].includes(t.status)).length;
    const closedCountToday = tickets.filter(t => t.status === 'Completed' || t.status === 'Closed').length;
    const availableStaff = technicians.filter(t => t.availability === 'Available').length;
    const busyStaff = technicians.filter(t => t.availability === 'Busy').length;
    const criticalPriorityCount = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Completed' && t.status !== 'Closed').length;

    roleKpis = [
      { title: 'Unassigned Tickets', val: unassignedCount, sub: 'Needs operational routing', icon: Clock, color: 'text-rose-600 bg-rose-50 border-rose-100' },
      { title: 'Live Field Journeys', val: activeRouteCount, sub: 'GPS tracked dispatch', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
      { title: 'Closed Dispatches', val: closedCountToday, sub: 'Service cards completed', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      { title: 'Standby Field Team', val: availableStaff, sub: 'Engineers on "Available"', icon: UserCheck, color: 'text-teal-600 bg-teal-50 border-teal-100' },
      { title: 'On-Job field Team', val: busyStaff, sub: 'Engineers on active Work Order', icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
      { title: 'Urgent SLA Warnings', val: criticalPriorityCount, sub: 'Critical priority requests', icon: Flame, color: 'text-red-650 bg-red-50 border-red-100' }
    ];
  } else if (activeRole === 'Technician') {
    const myWIP = tickets.filter(t => t.assignedTechnicianId === technicianAccount.id && t.status !== 'Completed' && t.status !== 'Closed').length;
    const myDone = tickets.filter(t => t.assignedTechnicianId === technicianAccount.id && (t.status === 'Completed' || t.status === 'Closed')).length;
    const mySLA = '4.95 ★';
    const estimatedHoursMyJobs = workOrders.filter(w => w.technicianId === technicianAccount.id).reduce((sum, w) => sum + w.estimatedHours, 0);

    roleKpis = [
      { title: 'My Open Repairs', val: myWIP, sub: 'Assigned active dispatches', icon: Clock, color: 'text-violet-600 bg-violet-50 border-violet-100' },
      { title: 'My Finished Jobs', val: myDone, sub: 'Repairs closed successfully', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      { title: 'My SLA Performance', val: mySLA, sub: 'NPS average score', icon: Award, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
      { title: 'Est. Service Time', val: `${estimatedHoursMyJobs} hrs`, sub: 'Scheduled task effort', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-100' },
      { title: 'Allocated parts', val: '6 items', sub: 'Trunk stockpile inventory', icon: Warehouse, color: 'text-teal-600 bg-teal-50 border-teal-100' },
      { title: 'Pending Signatures', val: workOrders.filter(w => w.technicianId === technicianAccount.id && !w.signature).length, sub: 'Requires client signature', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-100' }
    ];
  } else if (activeRole === 'Customer') {
    const myTicketsCount = tickets.filter(t => t.customerId === customerAccount.id && t.status !== 'Completed' && t.status !== 'Closed').length;
    const myAssetsCount = assets.filter(a => a.customerId === customerAccount.id).length;
    const myUnpaidBillsCount = invoices.filter(i => i.customerName === customerAccount.name && i.status === 'Unpaid').length;
    const totalMaintenanceSpent = invoices.filter(i => i.customerName === customerAccount.name && i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);

    roleKpis = [
      { title: 'My Pending Tickets', val: myTicketsCount, sub: 'Active repair requests', icon: Clock, color: 'text-violet-600 bg-violet-50 border-violet-100' },
      { title: 'My Tracked Machines', val: myAssetsCount, sub: 'Registered cooling machinery', icon: Layers, color: 'text-indigo-650 bg-indigo-50 border-indigo-100' },
      { title: 'Outstanding Bills', val: myUnpaidBillsCount, sub: 'Needs outstanding pay', icon: DollarSign, color: 'text-rose-600 bg-rose-50 border-rose-100' },
      { title: 'Maintenance Spent', val: `₹${totalMaintenanceSpent.toLocaleString('en-IN')}`, sub: 'Net paid maintenance bills', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
      { title: 'Daily Support Limit', val: '10 Tickets/Mo', sub: 'Premium Plan Active Status', icon: Shield, color: 'text-teal-600 bg-teal-50 border-teal-100' },
      { title: 'Equipment Health Metric', val: '100%', sub: 'Zero active damage leaks', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-100' }
    ];
  }

  // Gating content with a beautiful design & validation-focused Login Screen
  if (!isLoggedIn) {
    // Dynamic Validation Heuristics
    const getEmailValidationAlert = () => {
      if (!loginEmail) {
        return { message: 'Registered enterprise email required.', status: 'neutral', role: null };
      }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail);
      if (!isEmail) {
        return { message: '⚠️ Formatting email: missing @ or extension...', status: 'warning', role: null };
      }
      
      const emailLower = loginEmail.toLowerCase();
      let matchedRole: any = 'Company Admin';
      if (emailLower.includes('alex') || emailLower.includes('super')) {
        matchedRole = 'Super Admin';
      } else if (emailLower.includes('mahadevan') || emailLower.includes('admin') || emailLower.includes('company')) {
        matchedRole = 'Company Admin';
      } else if (emailLower.includes('anil') || emailLower.includes('dispatch')) {
        matchedRole = 'Dispatcher';
      } else if (emailLower.includes('karthik') || emailLower.includes('tech')) {
        matchedRole = 'Technician';
      } else if (emailLower.includes('venkatesh') || emailLower.includes('customer') || emailLower.includes('client')) {
        matchedRole = 'Customer';
      }
      
      return { 
        message: `✓ Valid email! Matches heuristic profile: [${matchedRole}]`, 
        status: 'success', 
        role: matchedRole 
      };
    };

    const validation = getEmailValidationAlert();

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
          {/* Brand Visual Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Enterprise Operations Suite</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/10">
                SF
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                ServiceFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 font-black">PRO</span>
              </h1>
            </div>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              SaaS Multi-Tenant Operations Workspace. Engineered for real-time dispatches across HVAC Air-conditions, CCTV, Broadband, and Telecom active SLA pipelines.
            </p>
          </div>

          {/* Brand Panel Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full">
            
            {/* Left Column: Intake details */}
            <div className="md:col-span-6 p-8 flex flex-col justify-center bg-slate-900/40 border-r border-slate-800">
              <div className="mb-6 text-left">
                <h2 className="text-xl font-bold text-white tracking-tight">Secure Log-In</h2>
                <p className="text-xs text-slate-400 mt-1">Submit your workspace credentials or use a 1-click gateway portal below.</p>
              </div>

              <form onSubmit={handleManualLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="login-email">
                    Enterprise Email address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="login-email"
                      type="text"
                      required
                      placeholder="alex.h@serviceflow.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950/60 border rounded-lg text-white focus:outline-none transition-all font-medium placeholder:text-slate-650 ${
                        validation.status === 'success' 
                        ? 'border-emerald-500/50 focus:ring-1 focus:ring-emerald-500' 
                        : validation.status === 'warning'
                        ? 'border-violet-500/50 focus:ring-1 focus:ring-violet-500'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  
                  {/* Validation Feedback Line */}
                  <div className="mt-1.5 flex justify-between items-center px-1">
                    <p className={`text-[10.5px] font-medium ${
                      validation.status === 'success' ? 'text-emerald-400' :
                      validation.status === 'warning' ? 'text-violet-400' : 'text-slate-500'
                    }`}>
                      {validation.message}
                    </p>
                    {validation.role && (
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold uppercase">
                        Heuristic Node match
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="login-password">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="login-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-650"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 italic">Passcode required. Type any value for simulated deployment.</p>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg text-xs text-rose-300 flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20 mt-4 cursor-pointer"
                >
                  <span>Authenticate Operator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Right Column: Key Details Contextual Dashboard info */}
            <div className="md:col-span-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-8 flex flex-col justify-between relative overflow-hidden text-left border-t md:border-t-0 border-slate-800">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              
              <div className="relative z-10 space-y-5">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  REAL-TIME CLOUD NODES OPERATIONAL
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">Grid Dispatch & Operations</h3>
                <p className="text-xs text-slate-350 leading-relaxed font-normal">
                  ServiceFlow streamlines high-intensity enterprise dispatches with live task tracking, granular operator authentication barriers, integrated inventory checkout ledger logs, and client billing portals.
                </p>
                
                <div className="space-y-4 pt-2">
                  <div className="flex gap-3 text-xs font-semibold text-slate-200">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-100">Super Admin Systems Control</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">Control tenant configurations, SaaS license tiers, crypto action logs.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs font-semibold text-slate-200">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-100">Company Administrator Suite</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">Approve engineer assignments, track assets directories, trigger GST dispatch invoices.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs font-semibold text-slate-200">
                    <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-100">Dispatcher Operations Portal</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">Automated map triggers, mechanic time slot scheduling, SLA alarms.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between relative z-10 font-mono">
                <span>Cluster Node: IND-SAAS-01</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  GATEWAY ONLINE
                </span>
              </div>

              {/* Geometric Balance circles background */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl" />
              <div className="absolute -left-12 -top-12 w-32 h-32 bg-violet-600/10 rounded-full blur-xl" />
            </div>
          </div>

          {/* Quick Click Persona Portals for Testing */}
          <div className="mt-12 text-center w-full max-w-4xl">
            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest mb-5">
              1-Click Secure Gateway Entry (Instant Persona Switching)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { role: 'Super Admin', name: 'Alex Henderson', desc: 'Global platform settings, tenant scaling, audit systems logs.', icon: Shield, col: 'border-slate-805 bg-slate-900/40 hover:bg-slate-905 hover:border-indigo-500/50 hover:shadow-indigo-500/10', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
                { role: 'Company Admin', name: 'Mahadevan', desc: 'Daikin administrator. Manage competencies and GST billing.', icon: Building, col: 'border-slate-805 bg-slate-900/40 hover:bg-slate-905 hover:border-emerald-500/50 hover:shadow-emerald-500/10', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
                { role: 'Dispatcher', name: 'Anil Kumar', desc: 'Dispatch hub controller. GPS routes, time logs & active maps.', icon: Briefcase, col: 'border-slate-805 bg-slate-900/40 hover:bg-slate-905 hover:border-violet-500/50 hover:shadow-violet-500/10', badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
                { role: 'Technician', name: 'Karthik Raja', desc: 'Mechanical repair on-field. Capture signatures and complete repairs.', icon: Users, col: 'border-slate-805 bg-slate-900/40 hover:bg-slate-905 hover:border-blue-500/50 hover:shadow-blue-500/10', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                { role: 'Customer', name: 'Venkatesh Prasad', desc: 'Resident property owner. Raise issues and pay invoices.', icon: UserCheck, col: 'border-slate-805 bg-slate-900/40 hover:bg-slate-905 hover:border-purple-500/50 hover:shadow-purple-500/10', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20' }
              ].map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => triggerDirectLogin(p.role as any)}
                    className={`text-left p-4 rounded-xl border ${p.col} shadow-sm transition-all flex flex-col justify-between h-44 cursor-pointer group hover:-translate-y-0.5`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`p-1.5 rounded-lg border shrink-0 ${p.badge}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[8px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono font-bold text-slate-400">
                        DIRECT
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors mt-2">{p.role}</h4>
                      <p className="text-xs font-bold text-slate-200 tracking-tight mt-0.5">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1 lines-clamp-2">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Outer Footer greetings */}
        <footer className="w-full text-center mt-12 py-6 border-t border-slate-905 font-medium text-[11px] text-slate-500">
          ServiceFlow Pro • Powered by React & Tailwind CSS Geometric Design • Registered client support 100,000+
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased pb-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* GLOBAL SYSTEM BRAND HEADER */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-left w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-indigo-500/10">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-lg tracking-tight">ServiceFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 font-black">PRO</span></span>
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                  V2.4 Enterprise
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                  {currentUser.organization || 'CoolBreeze Air'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Field Service Management • HVAC, Telecom ISP, Security CCTV dispatches</p>
            </div>
          </div>
 
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => setNavSection('console')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  navSection === 'console' 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/15' 
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Operations Workspace</span>
              </button>
              <button
                onClick={() => setNavSection('specs')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  navSection === 'specs' 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/15' 
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tech Specs & Blueprints</span>
              </button>
            </div>
 
            {/* Profile Avatar and Logout Action */}
            <div className="flex items-center gap-3 pl-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="text-left leading-none">
                <p className="text-xs font-bold text-slate-200 leading-normal">{currentUser.name}</p>
                <p className="text-[10px] text-indigo-400 font-mono font-bold leading-normal">{currentUser.role.toUpperCase()}</p>
              </div>
 
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setLoginEmail('');
                  setLoginPassword('');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-955/20 border border-slate-800 hover:border-rose-900 rounding-lg transition-all shrink-0 cursor-pointer"
                title="Sign out from session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>
 
      {/* CORE CONTENT SWITCHER */}
      <main className="max-w-7xl mx-auto px-6 mt-6">
        
        {navSection === 'specs' ? (
          <ArchitectureView />
        ) : (
          <div className="space-y-6">
            
            {/* LIVE KPI WIDGET ROW */}
            <div id="live-kpi-dashboard" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {roleKpis.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-slate-800 shadow-sm text-left flex flex-col justify-between hover:border-slate-700/80 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-tight truncate">{card.title}</p>
                      <span className={`p-1.5 rounded-lg border shrink-0 ${card.color.replace('bg-amber-50', 'bg-violet-500/10').replace('text-amber-600', 'text-violet-400').replace('border-amber-100', 'border-violet-500/20').replace('bg-indigo-50', 'bg-indigo-500/10').replace('text-indigo-600', 'text-indigo-400').replace('border-indigo-100', 'border-indigo-500/20').replace('bg-emerald-50', 'bg-emerald-500/10').replace('text-emerald-600', 'text-emerald-400').replace('border-emerald-100', 'border-emerald-500/20').replace('bg-slate-50', 'bg-slate-800/80').replace('text-slate-800', 'text-slate-200').replace('border-slate-200', 'border-slate-700').replace('bg-purple-50', 'bg-purple-500/10').replace('text-purple-650', 'text-purple-400').replace('border-purple-100', 'border-purple-500/20')}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xl font-black text-white tracking-tight leading-none">{card.val}</p>
                      <p className="text-[10px] text-slate-405 mt-1.5 font-medium">{card.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
 
            {/* TWO-COLUMN GRAPH METRIC & INSIGHT CHIPS */}
            {(activeRole === 'Super Admin' || activeRole === 'Company Admin') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 shadow-sm p-6 text-left">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-white text-sm">Real-Time Revenue & SLA Trends</h3>
                      <p className="text-[11px] text-slate-400">Continuous daily tracking across multi-tenant dispatch streams.</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setChartMetric('tickets')}
                        className={`px-3 py-1 text-[10px] font-bold rounded cursor-pointer ${chartMetric === 'tickets' ? 'bg-indigo-600 text-white':'bg-slate-800 text-slate-350 hover:text-white border border-slate-705'}`}
                      >
                        Ticket Load
                      </button>
                      <button 
                        onClick={() => setChartMetric('revenue')}
                        className={`px-3 py-1 text-[10px] font-bold rounded cursor-pointer ${chartMetric === 'revenue' ? 'bg-indigo-600 text-white':'bg-slate-800 text-slate-350 hover:text-white border border-slate-705'}`}
                      >
                        SaaS Invoices Group
                      </button>
                    </div>
                  </div>
 
                  {chartMetric === 'tickets' ? (
                    <div className="space-y-3 pt-2">
                      {/* Visual representation layout representing load */}
                      {[
                        { cat: 'HVAC AC Servicing', ticketsCount: 4, pct: 100, color: 'bg-indigo-500 shadow-sm shadow-indigo-500/20' },
                        { cat: 'Optical Fiber Broadband ISP', ticketsCount: 2, pct: 50, color: 'bg-teal-500 shadow-sm shadow-teal-500/20' },
                        { cat: 'CCTV Security Systems Installation', ticketsCount: 1, pct: 25, color: 'bg-violet-500 shadow-sm shadow-violet-500/20' },
                        { cat: 'Washing Machine Home Appliance', ticketsCount: 1, pct: 25, color: 'bg-sky-500 shadow-sm shadow-sky-500/20' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-300">{item.cat}</span>
                            <span className="font-mono text-slate-500">{item.ticketsCount} Active Tickets</span>
                          </div>
                          <div className="w-full bg-slate-950/60 rounded-full h-2.5 border border-slate-800">
                            <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2 font-mono">
                      <div className="flex justify-between items-end h-32 pt-4 select-none">
                        {[32, 45, 18, 55, 96, 74, 88].map((v, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-6.5 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t shadow-md shadow-indigo-500/10" style={{ height: `${v}px` }} />
                            <span className="text-[9px] text-slate-500 font-bold">Week {i+1}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 italic font-sans text-center">"Revenues increase automatically by using route optimizations and reducing fuel expenditures mean."</p>
                    </div>
                  )}
                </div>
 
                {/* Operations Action Panel Info */}
                <div className="lg:col-span-4 bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                      <span>AI Operations Summary</span>
                    </h4>
                    <ul className="text-xs text-slate-400 space-y-2.5 list-disc pl-4 leading-relaxed">
                      <li><strong className="text-white">Predictive Maintenance:</strong> Daikin asset <em className="text-violet-300 font-mono">DAIK-983271-X</em> is estimated to fail in 42 days based on coil current regressions.</li>
                      <li><strong className="text-white">Route Optimization:</strong> Grouping Koramangala tickets reduced technician traffic delay by 25%.</li>
                      <li><strong className="text-white">Workload Balance:</strong> Scheduled Karthik Raja to 2 proximate tasks to maximize afternoon cooling repairs.</li>
                    </ul>
                  </div>
 
                  <div className="p-3 bg-indigo-950/50 border border-indigo-900/40 rounded-lg text-white font-mono text-[9px] text-left shadow-sm">
                    <p className="font-bold text-violet-300 tracking-wider">SYSTEM STATUS INDICATOR</p>
                    <p className="mt-1">Node: AP_SOUTH_1_SaaS_01</p>
                    <p className="text-indigo-300">Status: ALL_SYSTEMS_OPERATIONAL</p>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE ROLE SIMULATION VIEWPORTS CONTAINER */}
            <div id="active-simulated-portal-container" className="pt-2">
              {activeRole === 'Super Admin' && (
                <SuperAdminView
                  companies={companies}
                  logs={auditLogs}
                  notifications={notifications}
                  onAddCompany={handleAddCompany}
                  onUpdateCompanyPlan={handleUpdateCompanyPlan}
                />
              )}

              {activeRole === 'Company Admin' && (
                <CompanyAdminView
                  technicians={technicians}
                  customers={customers}
                  assets={assets}
                  inventory={inventory}
                  invoices={invoices}
                  logs={auditLogs}
                  onAddTechnician={handleAddTechnician}
                  onAddCustomer={handleAddCustomer}
                  onAddAsset={handleAddAsset}
                  onAddInventory={handleAddInventory}
                  onGenerateInvoice={handleGenerateInvoice}
                />
              )}

              {activeRole === 'Dispatcher' && (
                <DispatcherView
                  tickets={tickets}
                  technicians={technicians}
                  workOrders={workOrders}
                  onAssignTicket={handleAssignTicket}
                  onAutoAssignAI={handleAutoAssignAI}
                />
              )}

              {activeRole === 'Technician' && (
                <TechnicianView
                  technician={technicianAccount}
                  tickets={tickets}
                  workOrders={workOrders}
                  inventory={inventory}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateChecklist={handleUpdateChecklist}
                  onSubmitSignature={handleSubmitSignature}
                  onAttachPhoto={handleAttachPhoto}
                  onUseInventory={handleUseInventory}
                />
              )}

              {activeRole === 'Customer' && (
                <CustomerView
                  customer={customerAccount}
                  tickets={tickets}
                  assets={assets}
                  invoices={invoices}
                  technicians={technicians}
                  onCreateTicket={handleCreateTicket}
                  onPayInvoice={handlePayInvoice}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}
            </div>

          </div>
        )}

      </main>

      {/* FOOTER SYSTEM GREETINGS */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 select-none">
        <p className="font-semibold text-slate-400">ServiceFlow Pro • Designed for Enterprise Scale Field Management Platforms</p>
        <p className="mt-1 text-slate-500">Developed for handling 100,000+ customers, multi-tenant databases, route estimations, and AI smart dispatches.</p>
      </footer>
    </div>
  );
}
