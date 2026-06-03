import React, { useState } from 'react';
import { Database, FileText, Settings, Shield, Terminal, ArrowRight, Layers, Workflow, CheckCircle, HelpCircle } from 'lucide-react';

export default function ArchitectureView() {
  const [activeTab, setActiveTab] = useState<'system' | 'schemas' | 'apis' | 'matrix' | 'ci-cd' | 'roadmap'>('system');

  return (
    <div id="architecture-view-root" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* View Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white text-left">
        <h2 className="text-xl font-bold tracking-tight">Technical Specifications & Blueprints</h2>
        <p className="text-slate-300 text-sm mt-1">
          Complete production deliverables for ServiceFlow Pro: System architecture, MongoDB schemas, REST APIs, and deployment guides.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
        {[
          { id: 'system', label: 'System Architecture', icon: Layers },
          { id: 'schemas', label: 'DB Schemas', icon: Database },
          { id: 'apis', label: 'REST APIs', icon: Terminal },
          { id: 'matrix', label: 'RBAC Grid', icon: Shield },
          { id: 'ci-cd', label: 'CI/CD & Deploy', icon: Settings },
          { id: 'roadmap', label: 'Enterprise Roadmap', icon: Workflow },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {activeTab === 'system' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">SaaS Multi-Tenant Cloud Architecture</h3>
              <p className="text-sm text-slate-600 mt-1">
                Designed for 100,000+ active customers and 10,000+ daily operational repair dispatches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                <span className="font-semibold text-indigo-900 text-xs uppercase tracking-wider block mb-1">Layer 1: Entry Point</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">DNS & High-Performance Cloud CDN</h4>
                <p className="text-xs text-slate-600">
                  Cloudflare Enterprise TLS termination, static asset edge caching, and DDoS shield proxying directly to target pods.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-teal-50 border border-teal-100">
                <span className="font-semibold text-teal-900 text-xs uppercase tracking-wider block mb-1">Layer 2: Compute Unit</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Node/Express API Cluster (ECS)</h4>
                <p className="text-xs text-slate-600">
                  Auto-scaling containers managed by AWS ECS/Fargate within a private subnet. Inter-process cache sync via shared Redis rings.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                <span className="font-semibold text-purple-900 text-xs uppercase tracking-wider block mb-1">Layer 3: Data Core</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">MongoDB Atlas Sharded Cluster</h4>
                <p className="text-xs text-slate-600">
                  Tenant-partitioned collections utilizing tenant_id shard keys. Scaled with read-replicas for operations analytics pipelines.
                </p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg p-5 bg-slate-50 space-y-4">
              <h4 className="font-semibold text-slate-950 text-sm">Design Safeguards & Multi-Tenancy Protection</h4>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
                <li>
                  <strong className="text-slate-800">Database Tenant Isolation:</strong> Every record contains a critical <code className="bg-slate-200 px-1 py-0.5 rounded">tenant_id</code> attribute. High-performance global database queries deploy strict query rewrite hooks in Mongoose to prohibit cross-tenant data leaks.
                </li>
                <li>
                  <strong className="text-slate-800">Operational Queue Routing:</strong> Express.js clusters utilize BullMQ backed by highly available AWS ElastiCache Redis queues to isolate long-running background tasks (PDF invoice compilation and offline webhook notifications).
                </li>
                <li>
                  <strong className="text-slate-800">Real-Time Dispatch Pipeline:</strong> WebSocket client coordinates are funneled through Socket.IO servers clustered behind Application Load Balancers with sticky sessions, allowing seamless instant coordinates on dispatch tables.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'schemas' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Database Models & MongoDB Schemas</h3>
              <p className="text-sm text-slate-600 mt-1">
                Strict MongoDB index constraints optimized for geo-location lookups and tenant queries.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-mono text-xs text-slate-700 font-bold border-b border-slate-200 flex justify-between">
                  <span>collection: companies</span>
                  <span className="text-indigo-600">Tenant Container</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-600 bg-slate-50 overflow-x-auto">
{`{
  _id: ObjectId,
  name: { type: String, required: true },
  industry: { type: String, required: true },
  subscription: {
    plan: { type: String, enum: ['Starter', 'Professional', 'Enterprise'], default: 'Starter' },
    status: { type: String, enum: ['active', 'trialing', 'past_due', 'canceled'] },
    stripeCustomerId: String
  },
  settings: {
    gstNumber: String,
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' }
  },
  createdAt: Date
}
// Indexes:
// - { name: "text" }`}
                </pre>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-mono text-xs text-slate-700 font-bold border-b border-slate-200 flex justify-between">
                  <span>collection: technicians</span>
                  <span className="text-teal-600">Geo-Location Optimized</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-600 bg-slate-50 overflow-x-auto">
{`{
  _id: ObjectId,
  tenantId: { type: ObjectId, ref: 'Company', required: true },
  employeeId: { type: String, unique: true },
  name: { type: String, required: true },
  mobile: String,
  skills: [{ type: String }],
  experienceYears: Number,
  availability: { type: String, enum: ['Available', 'Busy', 'Offline'] },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude] for geospatial search query
  },
  performanceScore: Number,
  lastUpdated: Date
}
// Indexes:
// - { tenantId: 1, availability: 1 }
// - { currentLocation: "2dsphere" }  // Enables 2D-Sphere geoNear indexing`}
                </pre>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-mono text-xs text-slate-700 font-bold border-b border-slate-200 flex justify-between">
                  <span>collection: tickets</span>
                  <span className="text-violet-500">Service Tickets</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-600 bg-slate-50 overflow-x-auto">
{`{
  _id: ObjectId,
  tenantId: { type: ObjectId, ref: 'Company', required: true },
  ticketNumber: { type: String, unique: true },
  customerId: { type: ObjectId, ref: 'Customer' },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  description: String,
  photoUrls: [String],
  scheduledTime: Date,
  slaLimitHours: Number,
  status: { type: String, enum: ['New', 'Assigned', 'Accepted', 'On The Way', 'Arrived', 'Work In Progress', 'Completed'] },
  assignedTechnician: { type: ObjectId, ref: 'Technician' },
  location: {
    address: String,
    coordinates: [Number] // [lng, lat]
  }
}
// Indexes:
// - { tenantId: 1, status: 1 }
// - { ticketNumber: 1 }`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apis' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">REST API Reference (Node / Express)</h3>
              <p className="text-sm text-slate-600 mt-1">
                Interactive API routing definitions secured via JWT authentication header and standard role permissions checking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span className="text-slate-800 font-semibold">/api/v1/auth/login</span>
                </div>
                <p className="text-slate-600 font-sans mt-1">Exchanges company email and login hash to produce user JWS Token, payload role context, and lease expiration parameters.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">GET</span>
                  <span className="text-slate-800 font-semibold">/api/v1/technicians/nearby-smart-dispatch?ticketId=xyz</span>
                </div>
                <p className="text-slate-600 font-sans mt-1">Invokes Geospatial aggregate pipeline in MongoDB combined with heuristic filtering (skills match & active scheduling workloads) to sort best dispatchable techs.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-violet-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">PUT</span>
                  <span className="text-slate-800 font-semibold">/api/v1/workorders/:woId/signature-complete</span>
                </div>
                <p className="text-slate-600 font-sans mt-1">Uploads user binary signatures as asset buffers to secured AWS S3 bucket, updates active status to "Completed", and fires automated WhatsApp/SMS receipts.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span className="text-slate-800 font-semibold">/api/v1/payments/razorpay-initiate-order</span>
                </div>
                <p className="text-slate-600 font-sans mt-1">Requests customized order ID triggers from Razorpay backend interface. Supports auto-verifying client HMAC signatures upon successful online charge capture.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Role-Based Access Control (RBAC) Permissive Matrix</h3>
              <p className="text-sm text-slate-600 mt-1">
                Ensures proper security isolation between super-level multi-tenants, operators, and localized customer nodes.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                  <tr>
                    <th className="px-4 py-3">Permission Block</th>
                    <th className="px-4 py-3 text-center">Super Admin</th>
                    <th className="px-4 py-3 text-center">Company Admin</th>
                    <th className="px-4 py-3 text-center">Dispatcher</th>
                    <th className="px-4 py-3 text-center">Technician</th>
                    <th className="px-4 py-3 text-center">Customer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Manage Tenant Company Registries</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Manage Master Tech / Employee Rosters</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Schedule Tickets / Direct Dispatch Drag-Drop</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Modify Assigned Work Order Status</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes (Own)</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Raise Issue Tickets on Registered Assets</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✔ Yes (Managed)</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes (Operator)</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">✘ No</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✔ Yes (Own)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ci-cd' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Production Deployment Guide & CI/CD Pipeline</h3>
              <p className="text-sm text-slate-600 mt-1">
                Automated continuous integration patterns targeting elastic containerized environments.
              </p>
            </div>

            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 space-y-3">
                <span className="font-semibold text-indigo-900 text-xs uppercase tracking-wider block">GitHub Actions Continuous Delivery (.github/workflows/deploy.yml)</span>
                <pre className="text-xs font-mono text-slate-700 bg-white/70 p-3 rounded border border-indigo-200 overflow-x-auto">
{`name: Build and Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test --passWithNoTests

  dockerize-and-publish:
    needs: test-and-lint
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1
      - name: Build, tag, and push image to Amazon ECR
        run: |
          docker build -t serviceflow-api:latest .
          docker tag serviceflow-api:latest 123456789012.dkr.ecr.ap-south-1.amazonaws.com/serviceflow-api:\${{ github.sha }}
          docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/serviceflow-api:\${{ github.sha }}
      - name: Force ECS Fargate Deployment Refresh
        run: |
          aws ecs update-service --cluster serviceflow-cluster --service api-service --force-new-deployment`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">Production Checklist</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    <li>Activate CORS configuration mapping targeting exclusively whitelisted domains.</li>
                    <li>Utilize Helmet.js headers to suppress express identify footprints.</li>
                    <li>Provision SSL certificates with HTTP Strict Transport Security (HSTS) turned on.</li>
                    <li>Configure automated mongodump snapshots to AWS S3 weekly with SSE-S3 encryption.</li>
                  </ul>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">SLA Scaling Configuration</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    <li>CPU utilization auto-scale limits set: Scale up at 70% mean cluster load.</li>
                    <li>Redis replication settings configured to avoid memory spills when WebSocket client bursts occur.</li>
                    <li>Enable MongoDB read preference with <code className="bg-slate-200 px-1 font-mono rounded">secondaryPreferred</code> to run revenue data analytics reports without throttling transactional databases.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">ServiceFlow Pro Product Roadmap</h3>
              <p className="text-sm text-slate-600 mt-1">
                Strategic evolution phases driving continuous automation and platform utility.
              </p>
            </div>

            <div className="relative border-l-2 border-indigo-200 ml-4 pl-6 space-y-6 text-xs">
              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-indigo-600 rounded-full w-4 h-4 border-2 border-slate-100"></span>
                <h4 className="font-bold text-slate-900 text-sm">Phase 1: Foundation Operations (Current)</h4>
                <p className="text-slate-600 mt-1">
                  Deploying multi-tenant billing models, scheduling views, manual technician dispatch, inventory logs, automated SMS alerts and customer rating controls.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-purple-500 rounded-full w-4 h-4 border-2 border-purple-100"></span>
                <h4 className="font-bold text-slate-900 text-sm">Phase 2: Automated Dispatch & IoT Assets</h4>
                <p className="text-slate-600 mt-1">
                  Integration with smart IoT sensors in AC chilling lines and CCTV routers. Automatically raise low-pressure and offline triggers directly inside our smart Ticket management queues.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 bg-sky-400 rounded-full w-4 h-4 border-2 border-sky-100"></span>
                <h4 className="font-bold text-slate-900 text-sm">Phase 3: Hyperlocal Route Optimization</h4>
                <p className="text-slate-600 mt-1">
                  Deploy machine learning route profiles that read historical urban traffic congestion statistics to trim fuel consumption costs by 18-20% for local appliance service operations.
                </p>
              </div>

              <div className="relative bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-indigo-900">
                <p className="font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> High Scalability Assured:
                </p>
                <p className="mt-1 text-slate-600">
                  By isolating tenant requests utilizing sharded databases and deploying asynchronous event pipelines, ServiceFlow Pro easily manages over 10K concurrent operations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
