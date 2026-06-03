/**
 * Mock Data & Schema Definitions for ServiceFlow Pro
 * Supporting AC Techs, ISPs, CCTV installers, Home Services, and Facility Management.
 */

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo: string;
  totalEmployees: number;
  createdAt: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Company Admin' | 'Dispatcher' | 'Technician' | 'Customer';
  companyId: string;
  avatar: string;
}

export interface Technician {
  id: string;
  employeeId: string;
  name: string;
  mobile: string;
  skills: string[];
  experienceYears: number;
  availability: 'Available' | 'Busy' | 'Offline';
  currentLocation: { lat: number; lng: number; address: string };
  performanceScore: number; // 1-100 scale
  completedJobsCount: number;
  activeJobId?: string;
  dailyRoute: Array<{ lat: number; lng: number; label: string }>;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  type: 'Residential' | 'Commercial';
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isPrimary: boolean;
    lat: number;
    lng: number;
  }>;
  notes: string;
}

export interface Asset {
  id: string;
  customerId: string;
  name: string;
  serialNumber: string;
  category: string;
  purchaseDate: string;
  installationDate: string;
  warrantyStatus: 'Active' | 'Expired';
  nextServiceDueDate: string;
  serviceHistoryCount: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  locationId: string; // references customer address
  locationText: string;
  slaLimitHours: number;
  slaTargetTime: string;
  status: 'New' | 'Assigned' | 'Accepted' | 'On The Way' | 'Arrived' | 'Work In Progress' | 'Pending Parts' | 'Completed' | 'Closed' | 'Cancelled';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  ticketId: string;
  ticketNumber: string;
  technicianId: string;
  scheduledDate: string;
  estimatedHours: number;
  actualHours?: number;
  serviceCost: number;
  partsCost: number;
  checklist: Array<{ task: string; done: boolean }>;
  notes: string;
  signature?: string; // Data URL
  photoBefore?: string;
  photoAfter?: string;
}

export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  cost: number;
  supplier: string;
  safetyThreshold: number;
  category: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  customerName: string;
  laborCharges: number;
  partsCharges: number;
  discount: number;
  taxRate: number; // e.g. 0.18 for 18% GST
  total: number;
  status: 'Unpaid' | 'Paid';
  paymentDate?: string;
  paymentMethod?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface NotificationMsg {
  id: string;
  timestamp: string;
  recipient: string;
  channel: 'SMS' | 'Email' | 'Push' | 'WhatsApp';
  event: string;
  message: string;
  status: 'Sent' | 'Failed';
}

// Global seed data for testing
export const INITIAL_COMPANIES: Company[] = [
  { id: 'c1', name: 'CoolBreeze Air Conditioning Ltd', industry: 'HVAC Services', logo: '❄️', totalEmployees: 48, createdAt: '2025-01-10', plan: 'Enterprise' },
  { id: 'c2', name: 'FiberPulse Broadband Specialists', industry: 'ISP Services', logo: '🌐', totalEmployees: 32, createdAt: '2025-03-24', plan: 'Professional' },
  { id: 'c3', name: 'SafeEye Security Installations', industry: 'CCTV Installation', logo: '🛡️', totalEmployees: 18, createdAt: '2025-08-15', plan: 'Starter' }
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 't1',
    employeeId: 'TECH-101',
    name: 'Karthik Raja',
    mobile: '+91 98401 22354',
    skills: ['AC Maintenance', 'Duct Repair', 'VRV Installation'],
    experienceYears: 6,
    availability: 'Available',
    currentLocation: { lat: 12.9716, lng: 77.5946, address: 'Koramangala, Bangalore' },
    performanceScore: 94,
    completedJobsCount: 142,
    dailyRoute: [
      { lat: 12.9716, lng: 77.5946, label: 'Base' },
      { lat: 12.9610, lng: 77.6380, label: 'Customer A' },
      { lat: 12.9279, lng: 77.6271, label: 'Customer B' }
    ]
  },
  {
    id: 't2',
    employeeId: 'TECH-102',
    name: 'Arun Kumar',
    mobile: '+91 97908 43521',
    skills: ['FTTH Splicing', 'Router Config', 'GPON Diagnostics'],
    experienceYears: 4,
    availability: 'Busy',
    currentLocation: { lat: 12.9279, lng: 77.6271, address: 'HSR Layout, Bangalore' },
    performanceScore: 88,
    completedJobsCount: 95,
    activeJobId: 'w2',
    dailyRoute: [
      { lat: 12.9279, lng: 77.6271, label: 'Base' },
      { lat: 12.9080, lng: 77.6000, label: 'Active Job 2' }
    ]
  },
  {
    id: 't3',
    employeeId: 'TECH-103',
    name: 'Manish Sharma',
    mobile: '+91 91234 56789',
    skills: ['CCTV Mounting', 'NVR Integration', 'IP Configuration', 'Optical Alignment'],
    experienceYears: 5,
    availability: 'Available',
    currentLocation: { lat: 13.0012, lng: 77.5124, address: 'Malleshwaram, Bangalore' },
    performanceScore: 91,
    completedJobsCount: 110,
    dailyRoute: [
      { lat: 13.0012, lng: 77.5124, label: 'Base' }
    ]
  },
  {
    id: 't4',
    employeeId: 'TECH-104',
    name: 'Rebecca D\'Souza',
    mobile: '+91 88765 43210',
    skills: ['Appliance Repair', 'Electrical Wiring', 'Inverter Servicing'],
    experienceYears: 7,
    availability: 'Offline',
    currentLocation: { lat: 12.9562, lng: 77.5721, address: 'Jayanagar, Bangalore' },
    performanceScore: 97,
    completedJobsCount: 184,
    dailyRoute: []
  },
  {
    id: 't5',
    employeeId: 'TECH-105',
    name: 'Vikas Patel',
    mobile: '+91 99012 34567',
    skills: ['AC Maintenance', 'VRV Installation', 'Leak Detection'],
    experienceYears: 3,
    availability: 'Available',
    currentLocation: { lat: 12.9141, lng: 77.6413, address: 'Bellandur, Bangalore' },
    performanceScore: 85,
    completedJobsCount: 38,
    dailyRoute: [
      { lat: 12.9141, lng: 77.6413, label: 'Base' }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    name: 'Venkatesh Prasad',
    mobile: '+91 94440 88771',
    email: 'venky.prasad@gmail.com',
    type: 'Residential',
    addresses: [
      { id: 'addr1_1', street: 'No 45, 12th Cross ROAD, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', isPrimary: true, lat: 12.9718, lng: 77.6411 }
    ],
    notes: 'Premium residential AC services customer. Prefers evening scheduling.'
  },
  {
    id: 'cust2',
    name: 'TechPark Co-Working Spaces',
    mobile: '+91 80234 56789',
    email: 'facilities@corptechpark.com',
    type: 'Commercial',
    addresses: [
      { id: 'addr2_1', street: 'Tower B, Global Tech Park, Outer Ring Rd', city: 'Bangalore', state: 'Karnataka', pincode: '560103', isPrimary: true, lat: 12.9279, lng: 77.6800 },
      { id: 'addr2_2', street: 'Branch Office, 100ft Rd, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560095', isPrimary: false, lat: 12.9320, lng: 77.6220 }
    ],
    notes: 'Require constant optical fiber network monitoring and immediate CCTV SLAs.'
  },
  {
    id: 'cust3',
    name: 'Anjali Hegde',
    mobile: '+91 98860 11223',
    email: 'anjali.hegde@hotmail.com',
    type: 'Residential',
    addresses: [
      { id: 'addr3_1', street: 'Flat 402, Shanthi Enclave, Malleshwaram', city: 'Bangalore', state: 'Karnataka', pincode: '560003', isPrimary: true, lat: 13.0034, lng: 77.5684 }
    ],
    notes: 'Warranty appliance customer. Call 30 mins before arrival.'
  },
  {
    id: 'cust4',
    name: 'Elite Hotel Suites',
    mobile: '+91 99120 44556',
    email: 'operations@elitehotels.in',
    type: 'Commercial',
    addresses: [
      { id: 'addr4_1', street: '8, MG Road, Trinity Circle', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isPrimary: true, lat: 12.9739, lng: 77.6166 }
    ],
    notes: 'Large industrial HVAC system contract. Monthly check-ins required.'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  { id: 'a1', customerId: 'cust1', name: 'Daikin 2.0-Ton split inverter AC', serialNumber: 'DAIK-983271-X', category: 'HVAC', purchaseDate: '2024-04-12', installationDate: '2024-04-13', warrantyStatus: 'Active', nextServiceDueDate: '2026-07-15', serviceHistoryCount: 4 },
  { id: 'a2', customerId: 'cust2', name: 'Hikvision 16-Channel NVR System', serialNumber: 'HIK-662512-V', category: 'Security CCTV', purchaseDate: '2023-11-20', installationDate: '2023-11-22', warrantyStatus: 'Active', nextServiceDueDate: '2026-06-18', serviceHistoryCount: 2 },
  { id: 'a3', customerId: 'cust2', name: 'Cisco Live Catalytic Optical Switch Plus', serialNumber: 'CIS-003321-NET', category: 'Broadband Fiber', purchaseDate: '2022-01-15', installationDate: '2022-01-16', warrantyStatus: 'Expired', nextServiceDueDate: '2026-05-30', serviceHistoryCount: 8 },
  { id: 'a4', customerId: 'cust3', name: 'IFB Front Load 8kg Washing Machine', serialNumber: 'IFB-9023812', category: 'Home Appliance', purchaseDate: '2025-05-01', installationDate: '2025-05-03', warrantyStatus: 'Active', nextServiceDueDate: '2026-08-01', serviceHistoryCount: 1 }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt1',
    ticketNumber: 'TKT-2026-0031',
    customerId: 'cust1',
    customerName: 'Venkatesh Prasad',
    category: 'HVAC Services',
    priority: 'High',
    description: 'Indoor unit is causing strong rattling sounds and water dripping. No cooling effect when set to Turbo.',
    locationId: 'addr1_1',
    locationText: 'No 45, 12th Cross ROAD, Indiranagar',
    slaLimitHours: 24,
    slaTargetTime: '2026-06-04T08:10:00Z',
    status: 'Assigned',
    assignedTechnicianId: 't1',
    assignedTechnicianName: 'Karthik Raja',
    createdAt: '2026-06-03T02:00:00Z'
  },
  {
    id: 'tkt2',
    ticketNumber: 'TKT-2026-0032',
    customerId: 'cust2',
    customerName: 'TechPark Co-Working Spaces',
    category: 'Broadband Fiber',
    priority: 'Critical',
    description: 'Complete optical fiber link down causing network blackouts across Floor 3. High urgency SLA active.',
    locationId: 'addr2_1',
    locationText: 'Tower B, Global Tech Park, Outer Ring Rd',
    slaLimitHours: 4,
    slaTargetTime: '2026-06-03T12:00:00Z',
    status: 'Work In Progress',
    assignedTechnicianId: 't2',
    assignedTechnicianName: 'Arun Kumar',
    createdAt: '2026-06-03T08:00:00Z'
  },
  {
    id: 'tkt3',
    ticketNumber: 'TKT-2026-0033',
    customerId: 'cust3',
    customerName: 'Anjali Hegde',
    category: 'Home Appliance Repair',
    priority: 'Medium',
    description: 'Washing machine not spinning, displaying "E10" motor stall warning on digital interface screen.',
    locationId: 'addr3_1',
    locationText: 'Flat 402, Shanthi Enclave, Malleshwaram',
    slaLimitHours: 48,
    slaTargetTime: '2026-06-05T08:10:00Z',
    status: 'New',
    createdAt: '2026-06-03T07:30:00Z'
  },
  {
    id: 'tkt4',
    ticketNumber: 'TKT-2026-0034',
    customerId: 'cust4',
    customerName: 'Elite Hotel Suites',
    category: 'HVAC Services',
    priority: 'Critical',
    description: 'Main chiller bank Compressor shut down. Backups thermal overheating. Urgent diagnostic required.',
    locationId: 'addr4_1',
    locationText: '8, MG Road, Trinity Circle',
    slaLimitHours: 4,
    slaTargetTime: '2026-06-03T12:10:20Z',
    status: 'New',
    createdAt: '2026-06-03T08:10:00Z'
  }
];

export const INITIAL_WORKORDERS: WorkOrder[] = [
  {
    id: 'wo1',
    workOrderNumber: 'WO-2026-9081',
    ticketId: 'tkt1',
    ticketNumber: 'TKT-2026-0031',
    technicianId: 't1',
    scheduledDate: '2026-06-03',
    estimatedHours: 2,
    serviceCost: 1200,
    partsCost: 350,
    checklist: [
      { task: 'Check coil cleanliness', done: true },
      { task: 'Leak testing nitrogen load', done: false },
      { task: 'Fan motor lubrication', done: false },
      { task: 'Condenser current rating draw test', done: false }
    ],
    notes: 'Inspect main drainage tube for leaves blockages first.'
  },
  {
    id: 'wo2',
    workOrderNumber: 'WO-2026-9082',
    ticketId: 'tkt2',
    ticketNumber: 'TKT-2026-0032',
    technicianId: 't2',
    scheduledDate: '2026-06-03',
    estimatedHours: 3,
    actualHours: 1,
    serviceCost: 2500,
    partsCost: 1500,
    checklist: [
      { task: 'Inspect physical cable bend tags', done: true },
      { task: 'Splice physical connector core to core', done: true },
      { task: 'OTDR link loss profiling', done: false },
      { task: 'Gateway route check confirmation', done: false }
    ],
    notes: 'Fiber link has high loss near the lobby riser conduit. Needs cleaning.'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'p1', productName: 'R32 Refrigerant Gas Cylinder (10kg)', sku: 'INV-GAS-R32', quantity: 18, cost: 4200, supplier: 'GasMakers India', safetyThreshold: 5, category: 'Refrigerants' },
  { id: 'p2', productName: 'Optical Fiber Splicing Tube (100-pack)', sku: 'INV-NET-TUBE', quantity: 45, cost: 850, supplier: 'ProNetwork Supplies', safetyThreshold: 10, category: 'Broadband Components' },
  { id: 'p3', productName: 'Hikvision Dome Outdoor CCTV 4MP', sku: 'INV-CAM-HKDOM', quantity: 3, cost: 3100, supplier: 'Hikvision Distribution', safetyThreshold: 5, category: 'CCTV Hardware' },
  { id: 'p4', productName: 'Universal Washing Machine Drain Pump', sku: 'INV-APP-PUMP1', quantity: 12, cost: 1400, supplier: 'SparesHQ', safetyThreshold: 3, category: 'Appliance Spares' },
  { id: 'p5', productName: 'VRV Solenoid Control Coil Type 4', sku: 'INV-HVAC-COIL', quantity: 2, cost: 5500, supplier: 'Daikin OEM Spares', safetyThreshold: 3, category: 'HVAC Controls' }
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-FLOW-4011', workOrderId: 'wo1', customerName: 'Venkatesh Prasad', laborCharges: 1200, partsCharges: 350, discount: 100, taxRate: 0.18, total: 1711, status: 'Unpaid' },
  { id: 'inv2', invoiceNumber: 'INV-FLOW-4012', workOrderId: 'wo2', customerName: 'TechPark Co-Working Spaces', laborCharges: 2500, partsCharges: 1500, discount: 0, taxRate: 0.18, total: 4720, status: 'Paid', paymentDate: '2026-06-03', paymentMethod: 'UPI' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log1', timestamp: '2026-06-03T08:00:10Z', userId: 'usr_disp1', userName: 'Anil Kumar (Dispatcher)', role: 'Dispatcher', action: 'ASSIGN_TICKET', details: 'Assigned Ticket TKT-2026-0031 to Technician Karthik Raja', ipAddress: '192.168.1.144' },
  { id: 'log2', timestamp: '2026-06-03T08:05:43Z', userId: 'usr_tech2', userName: 'Arun Kumar (Technician)', role: 'Technician', action: 'STATUS_UPDATE', details: 'Changed status of Ticket TKT-2026-0032 to WORK_IN_PROGRESS', ipAddress: '157.44.11.203' },
  { id: 'log3', timestamp: '2026-06-03T08:08:21Z', userId: 'usr_admin', userName: 'Mahadevan (Company Admin)', role: 'Company Admin', action: 'INVENTORY_ADD', details: 'Added 5 units of Hikvision Dome Outdoor CCTV 4MP', ipAddress: '106.51.242.12' }
];

export const INITIAL_NOTIFICATIONS: NotificationMsg[] = [
  { id: 'n1', timestamp: '2026-06-03T08:00:15Z', recipient: 'Karthik Raja (+91 98401 22354)', channel: 'WhatsApp', event: 'Technician Assigned', message: 'Hello Karthik, Ticket TKT-2026-0031 (Indoor rattling AC cooling check) is assigned to you. SLA limit: 24h. Reach site ASAP.', status: 'Sent' },
  { id: 'n2', timestamp: '2026-06-03T08:00:17Z', recipient: 'venky.prasad@gmail.com', channel: 'Email', event: 'Technician Assigned', message: 'Dear Venkatesh Prasad, technician Karthik Raja has been assigned to service your AC. ETA holds 20 mins.', status: 'Sent' }
];
