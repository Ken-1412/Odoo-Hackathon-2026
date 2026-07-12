import { useState } from "react";
import { 
  LayoutDashboard, Building2, Laptop, ArrowRightLeft, Calendar, 
  Wrench, ClipboardCheck, FileBarChart, Bell, LogOut, Plus,
  Sparkles, AlertTriangle, ArrowRight, TrendingUp, BarChart4
} from "lucide-react";
import FeaturedCrmDemoSection from "./ui/featured-crm-demo-section";
import Logo from "./ui/Logo";

interface Activity {
  id: string;
  text: string;
  timestamp: string;
}

interface Department {
  name: string;
  head: string;
  parent: string;
  status: "Active" | "Inactive";
}

interface Asset {
  tag: string;
  name: string;
  category: string;
  status: "Available" | "Allocated" | "Maintenance";
  location: string;
}

interface MaintenanceTicket {
  id: string;
  tag: string;
  issue: string;
  status: "Pending" | "Approved" | "Technician assigned" | "In progress" | "Resolved";
}

interface AuditAsset {
  tag: string;
  name: string;
  location: string;
  status: "Verified" | "Missing" | "Damaged";
}

interface LogEntry {
  text: string;
  time: string;
  type: "Alerts" | "Approvals" | "Bookings";
  color: string;
}

export default function Dashboard({ 
  username, 
  onLogout,
  onSwitchToAdmin
}: { 
  username: string | null; 
  onLogout: () => void; 
  onSwitchToAdmin?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [dashboardMode, setDashboardMode] = useState<"assets" | "crm">("assets");
  const [reportsMode, setReportsMode] = useState<"assets" | "crm">("assets");
  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", text: "Laptop AF-0114 - allocated to Priya shah - IT dept", timestamp: "Just now" },
    { id: "2", text: "Room B2 - booking confirmed - 2:00 to 3:00 PM", timestamp: "10 mins ago" },
    { id: "3", text: "Projector AF-0062 - maintenance resolved", timestamp: "1 hour ago" },
  ]);

  const [stats, setStats] = useState({
    availableHardware: 128,
    allocated: 76,
    availableRooms: 4,
    activeBookings: 9,
    pendingTransfers: 3,
    upcomingReturns: 12,
  });

  const [notifications, setNotifications] = useState<string[]>([
    "3 assets overdue for return - flagged for follow-up",
  ]);

  // Modal / Form States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Form Fields
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("Laptop");
  const [bookingRoom, setBookingRoom] = useState("Room B2");
  const [bookingTime, setBookingTime] = useState("2:00 to 3:00 PM");
  const [requestTitle, setRequestTitle] = useState("");

  // ─── Section 3: Organization Setup State ────────────────────────────────────
  const [orgSubTab, setOrgSubTab] = useState<"departments" | "categories" | "employees">("departments");
  const [departments, setDepartments] = useState<Department[]>([
    { name: "Engineering", head: "aditi rao", parent: "--", status: "Active" },
    { name: "Facilities", head: "rohan mehta", parent: "--", status: "Active" },
    { name: "Field ops (east)", head: "sana iqbal", parent: "Field Ops", status: "Inactive" },
  ]);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");
  const [newDeptParent, setNewDeptParent] = useState("");
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // ─── Section 4: Assets List State ──────────────────────────────────────────
  const [assets, setAssets] = useState<Asset[]>([
    { tag: "AF-0012", name: "Dell Laptop", category: "Electronics", status: "Allocated", location: "bengaluru" },
    { tag: "AF-0062", name: "Projector", category: "Electronics", status: "Maintenance", location: "HQ floor 2" },
    { tag: "AF-0201", name: "Office chair", category: "Furniture", status: "Available", location: "Warehouse" },
    { tag: "AF-0114", name: "Dell Laptop Pro", category: "Electronics", status: "Allocated", location: "bengaluru" },
  ]);
  const [assetSearch, setAssetSearch] = useState("");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All");
  const [assetStatusFilter, setAssetStatusFilter] = useState("All");

  // ─── Section 5: Asset Allocation & Transfer State ──────────────────────────
  const [transferAsset, setTransferAsset] = useState("AF-0114");
  const [transferTo, setTransferTo] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [allocationHistory, setAllocationHistory] = useState([
    { date: "Mar 12", event: "Allocated to Priya shah - Engineering" },
    { date: "Jan 04", event: "Returned by Arjun Nair - condition: good" },
  ]);

  // ─── Section 6: Resource Booking State ──────────────────────────────────────
  const [bookingResource, setBookingResource] = useState("Conference room B2");
  const [resourceBookings, setResourceBookings] = useState([
    { time: "9:00", text: "Booked - Procurement Team - 9 to 10", isBooked: true, conflict: false },
    { time: "10:00", text: "Requested 9:30 to 10:30 - conflict - slot is unavailable", isBooked: false, conflict: true },
    { time: "11:00", text: "Available", isBooked: false, conflict: false },
    { time: "12:00", text: "Available", isBooked: false, conflict: false },
    { time: "1:00", text: "Available", isBooked: false, conflict: false },
  ]);

  // ─── Section 7: Maintenance State ──────────────────────────────────────────
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([
    { id: "m1", tag: "AF-0062", issue: "Projector bulb not turning on", status: "Pending" },
    { id: "m2", tag: "AF-003", issue: "ac unit noisy compressor", status: "Approved" },
    { id: "m3", tag: "AF-0078", issue: "forklift tech: R varma", status: "Technician assigned" },
    { id: "m4", tag: "AF-897", issue: "Printer Jam parts ordered", status: "In progress" },
    { id: "m5", tag: "AF-873", issue: "Chair repair resolved 7 Jul", status: "Resolved" },
  ]);

  // ─── Section 8: Audit State ───────────────────────────────────────────────
  const [auditAssets, setAuditAssets] = useState<AuditAsset[]>([
    { tag: "AF-003", name: "Dell laptop", location: "Desk E12", status: "Verified" },
    { tag: "AF-9921", name: "Office chair", location: "Desk E14", status: "Missing" },
    { tag: "AF-9838", name: "Monitor", location: "Desk E15", status: "Damaged" },
  ]);
  const [auditCycleOpen, setAuditCycleOpen] = useState(true);

  // ─── Section 10: Notifications Logs State ──────────────────────────────────
  const [logFilter, setLogFilter] = useState<"All" | "Alerts" | "Approvals" | "Bookings">("All");
  const [logs] = useState<LogEntry[]>([
    { text: "Laptop AF-0014 assigned to Priya shah", time: "2m ago", type: "Bookings", color: "bg-blue-500" },
    { text: "Maintenance request AF-0055 approved", time: "18m ago", type: "Approvals", color: "bg-emerald-500" },
    { text: "Booking confirmed: Room B2 : 2:00 to 3:00 PM", time: "1h ago", type: "Bookings", color: "bg-blue-500" },
    { text: "Transfer approved: AF-0033 to facilities dept", time: "3h ago", type: "Approvals", color: "bg-zinc-400" },
    { text: "Overdue return: AF-0021 was due 3 days ago", time: "1d ago", type: "Alerts", color: "bg-red-500" },
    { text: "audit discrepancy flagged: AF-0088 damaged", time: "2d ago", type: "Alerts", color: "bg-amber-500" },
  ]);

  // ─── Actions & Handlers ────────────────────────────────────────────────────
  const advanceTicket = (ticketId: string) => {
    setMaintenanceTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      let nextStatus: MaintenanceTicket["status"];
      switch (t.status) {
        case "Pending": nextStatus = "Approved"; break;
        case "Approved": nextStatus = "Technician assigned"; break;
        case "Technician assigned": nextStatus = "In progress"; break;
        case "In progress": nextStatus = "Resolved"; break;
        default: nextStatus = "Resolved";
      }

      // Business rule trigger: resolving returned asset to Available, approving card sets to Maintenance
      if (nextStatus === "Resolved") {
        setAssets(assetsPrev => assetsPrev.map(a => a.tag === t.tag ? { ...a, status: "Available" } : a));
        setStats(s => ({ ...s, availableHardware: s.availableHardware + 1 }));
      } else if (t.status === "Pending") {
        setAssets(assetsPrev => assetsPrev.map(a => a.tag === t.tag ? { ...a, status: "Maintenance" } : a));
      }

      // Log activity
      const activity: Activity = {
        id: Date.now().toString(),
        text: `Maintenance Ticket ${t.tag} advanced to: ${nextStatus}`,
        timestamp: "Just now"
      };
      setActivities(prevAct => [activity, ...prevAct]);

      return { ...t, status: nextStatus };
    }));
  };

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName) return;

    const newTag = `AF-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newAsset: Asset = {
      tag: newTag,
      name: assetName,
      category: assetCategory,
      status: "Available",
      location: "Warehouse"
    };

    setAssets([newAsset, ...assets]);
    setStats(prev => ({ ...prev, availableHardware: prev.availableHardware + 1 }));
    setActivities([
      { id: Date.now().toString(), text: `${newAsset.name} (${newAsset.tag}) - registered by ${username || "Agent"}`, timestamp: "Just now" },
      ...activities
    ]);
    setShowRegisterModal(false);
    setAssetName("");
  };

  const handleBookResource = (e: React.FormEvent) => {
    e.preventDefault();
    setResourceBookings(prev => prev.map(b => b.time === "11:00" ? { ...b, text: `Booked - You (${username}) - 11 to 12`, isBooked: true } : b));
    setStats(prev => ({ ...prev, activeBookings: prev.activeBookings + 1 }));
    setActivities([
      { id: Date.now().toString(), text: `${bookingResource} - booking slot reserved - 11:00 AM`, timestamp: "Just now" },
      ...activities
    ]);
    setShowBookingModal(false);
  };

  const handleRaiseRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle) return;
    const newTicket: MaintenanceTicket = {
      id: `m_${Date.now()}`,
      tag: "AF-0201",
      issue: requestTitle,
      status: "Pending"
    };
    setMaintenanceTickets([newTicket, ...maintenanceTickets]);
    setActivities([
      { id: Date.now().toString(), text: `Maintenance requested: "${requestTitle}" for AF-0201`, timestamp: "Just now" },
      ...activities
    ]);
    setShowRequestModal(false);
    setRequestTitle("");
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptHead) return;
    const newDept: Department = {
      name: newDeptName,
      head: newDeptHead,
      parent: newDeptParent || "--",
      status: "Active"
    };
    setDepartments([...departments, newDept]);
    setShowAddDeptModal(false);
    setNewDeptName("");
    setNewDeptHead("");
    setNewDeptParent("");
  };

  const handleTransferRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTo) return;

    setAllocationHistory([
      { date: "Just now", event: `Transferred to ${transferTo} - pending validation` },
      ...allocationHistory
    ]);

    setActivities([
      { id: Date.now().toString(), text: `Transfer requested: ${transferAsset} to ${transferTo} (Reason: ${transferReason || "None"})`, timestamp: "Just now" },
      ...activities
    ]);

    setTransferTo("");
    setTransferReason("");
  };

  const toggleAuditStatus = (tag: string) => {
    setAuditAssets(prev => prev.map(a => {
      if (a.tag !== tag) return a;
      let nextStatus: AuditAsset["status"];
      if (a.status === "Verified") nextStatus = "Missing";
      else if (a.status === "Missing") nextStatus = "Damaged";
      else nextStatus = "Verified";
      return { ...a, status: nextStatus };
    }));
  };

  const flaggedAuditsCount = auditAssets.filter(a => a.status === "Missing" || a.status === "Damaged").length;

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "org_setup", label: "Organization setup", icon: Building2 },
    { id: "assets", label: "Assets", icon: Laptop },
    { id: "transfers", label: "Allocation & Transfer", icon: ArrowRightLeft },
    { id: "booking", label: "Resource Booking", icon: Calendar },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "audit", label: "Audit", icon: ClipboardCheck },
    { id: "reports", label: "Reports", icon: FileBarChart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "crm", label: "CRM Demo", icon: Sparkles },
  ];

  return (
    <div 
      className="min-h-screen bg-surface-50 text-surface-900 flex flex-col font-sans select-none"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 249, 250, 0.94), rgba(248, 249, 250, 0.98)), url('/clean_space_chains_bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Header */}
      <header className="h-16 border-b border-surface-200 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-900 flex items-center justify-center p-1">
            <Logo className="w-full h-full text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900 font-sans">
            Asset<span className="text-brand-900">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-surface-600 font-medium">
            Agent Callsign: <span className="text-brand-900 font-bold">{username || "Guest"}</span>
          </span>
          {onSwitchToAdmin && (
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand-900 text-xs font-bold text-brand-900 hover:bg-brand-50 bg-white transition-all cursor-pointer shadow-sm"
            >
              Admin Portal
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-900 hover:bg-brand-800 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-grow flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-surface-200 bg-white/40 backdrop-blur-md py-6 flex flex-col justify-between shrink-0">
          <nav className="space-y-1 px-3">
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-brand-900 text-white shadow-md shadow-brand-900/20" 
                      : "text-surface-650 hover:bg-surface-100 hover:text-surface-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-surface-400"}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>
          
          <div className="px-6 py-4 border-t border-surface-200 text-[10px] text-surface-400 font-mono">
            SECURE SYSTEM v2.4
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-grow p-8 overflow-y-auto">
          {/* ─── Tab: Dashboard ───────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex justify-between items-center border-b border-surface-200 pb-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Today's Overview</h2>
                  <p className="text-sm text-surface-600 mt-1 font-medium">Real-time status of organizational resources and activities.</p>
                </div>
                {/* Mode Selector */}
                <div className="flex gap-1.5 bg-surface-200/60 p-1.5 rounded-xl border border-surface-250 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDashboardMode("assets")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${dashboardMode === "assets" ? "bg-brand-900 text-white shadow" : "text-surface-700 hover:text-surface-900 hover:bg-surface-100"}`}
                  >
                    Physical Assets
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardMode("crm")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${dashboardMode === "crm" ? "bg-brand-900 text-white shadow" : "text-surface-700 hover:text-surface-900 hover:bg-surface-100"}`}
                  >
                    CRM Integrations
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              {dashboardMode === "assets" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Available Hardware</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">{stats.availableHardware}</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Allocated Assets</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">{stats.allocated}</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Available Rooms</span>
                    <span className="text-3xl font-extrabold text-brand-900 tracking-tight">{stats.availableRooms}</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Active Bookings</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">{stats.activeBookings}</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Pending Transfers</span>
                    <span className="text-3xl font-extrabold text-amber-600 tracking-tight">{stats.pendingTransfers}</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Upcoming returns</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">{stats.upcomingReturns}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Sales Pipeline Leads</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">1,284</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">API Sync Success</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">99.9%</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">AI Follow-ups Sent</span>
                    <span className="text-3xl font-extrabold text-brand-900 tracking-tight">4,112</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Connected Platforms</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">8 / 8</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Sync Volume (Daily)</span>
                    <span className="text-3xl font-extrabold text-amber-600 tracking-tight">24.2k</span>
                  </div>
                  <div className="bg-white border border-surface-200/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between h-28">
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-wider font-sans">Avg Response Time</span>
                    <span className="text-3xl font-extrabold text-surface-900 tracking-tight">4.2 hrs</span>
                  </div>
                </div>
              )}

              {/* Red/Amber Warning Banner */}
              {dashboardMode === "assets" ? (
                notifications.length > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold tracking-wide shadow-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-655" />
                    <span>3 assets overdue for return - flagged for follow-up</span>
                    <button 
                      type="button"
                      onClick={() => setNotifications([])} 
                      className="ml-auto text-red-400 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-semibold tracking-wide shadow-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                  <span>Copper CRM integration token expires in 5 days - action required</span>
                </div>
              )}

              {/* Actions row */}
              <div className="flex flex-wrap gap-4">
                {dashboardMode === "assets" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(true)}
                      className="px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Register asset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(true)}
                      className="px-5 py-3 rounded-lg border border-surface-200 hover:border-brand-900 bg-white hover:bg-surface-50 text-surface-700 hover:text-brand-900 font-bold text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-surface-400" />
                      Book resource
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(true)}
                      className="px-5 py-3 rounded-lg border border-surface-200 hover:border-brand-900 bg-white hover:bg-surface-50 text-surface-700 hover:text-brand-900 font-bold text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-surface-400" />
                      Raise requests
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const newAct = {
                          id: Date.now().toString(),
                          text: `[Sync Success] Manual sync completed for: Salesforce, HubSpot, Zoho, Pipedrive, Freshsales, MS Dynamics, Copper, Insightly.`,
                          timestamp: "Just now"
                        };
                        setActivities([newAct, ...activities]);
                      }}
                      className="px-5 py-3 rounded-lg bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Trigger CRM Sync
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newAct = {
                          id: Date.now().toString(),
                          text: `[AI Follow-ups] Automated pipeline optimization completed. Sent 128 reminders.`,
                          timestamp: "Just now"
                        };
                        setActivities([newAct, ...activities]);
                      }}
                      className="px-5 py-3 rounded-lg border border-surface-200 hover:border-brand-900 bg-white hover:bg-surface-50 text-surface-700 hover:text-brand-900 font-bold text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Optimize Pipeline
                    </button>
                  </>
                )}
              </div>

              {/* Recent Activity List */}
              <div className="bg-white border border-surface-200 rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-surface-900 tracking-wide font-sans uppercase">Recent Activity</h3>
                <div className="space-y-3 font-semibold text-sm text-surface-700">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-center py-2 border-b border-surface-100 last:border-b-0">
                      <span>{activity.text}</span>
                      <span className="text-xs text-surface-400 font-mono font-normal shrink-0">{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Organization Setup (Screen 3) ─────────────────────────── */}
          {activeTab === "org_setup" && (
            <div className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Organization setup</h2>
                <p className="text-sm text-surface-600 mt-1 font-medium">Manage departments, parent configurations, and resource categories.</p>
              </div>

              {/* Sub tabs */}
              <div className="flex gap-2 border-b border-surface-200 pb-3">
                <button
                  onClick={() => setOrgSubTab("departments")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${orgSubTab === "departments" ? "bg-brand-900 text-white" : "bg-white border border-surface-200 text-surface-700 hover:bg-surface-50"}`}
                >
                  Departments
                </button>
                <button
                  onClick={() => setOrgSubTab("categories")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${orgSubTab === "categories" ? "bg-brand-900 text-white" : "bg-white border border-surface-200 text-surface-700 hover:bg-surface-50"}`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setOrgSubTab("employees")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${orgSubTab === "employees" ? "bg-brand-900 text-white" : "bg-white border border-surface-200 text-surface-700 hover:bg-surface-50"}`}
                >
                  Employee
                </button>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer ml-auto"
                >
                  + Add
                </button>
              </div>

              {/* Departments Table */}
              {orgSubTab === "departments" && (
                <div className="bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-surface-50 border-b border-surface-200 text-surface-700 font-bold uppercase tracking-wider text-xs">
                        <th className="p-4">Department</th>
                        <th className="p-4">Head</th>
                        <th className="p-4">Parent Dept</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-150 font-semibold text-surface-850">
                      {departments.map((dept, idx) => (
                        <tr key={idx} className="hover:bg-surface-50/50">
                          <td className="p-4">{dept.name}</td>
                          <td className="p-4 text-surface-600">{dept.head}</td>
                          <td className="p-4 text-surface-600">{dept.parent}</td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${dept.status === "Active" ? "bg-green-50 text-green-700 border border-green-200" : "bg-zinc-100 text-zinc-600 border border-zinc-200"}`}>
                              {dept.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-surface-50 border-t border-surface-200 text-xs font-bold text-surface-500 tracking-wide uppercase">
                    Editing a department here also drives the picklist in Screen 4 & 5
                  </div>
                </div>
              )}

              {/* Placeholders for Subtabs */}
              {orgSubTab !== "departments" && (
                <div className="p-12 text-center border border-dashed border-surface-200 rounded-xl bg-white shadow-sm">
                  <p className="text-sm font-bold text-surface-700 uppercase">Configuration panel active</p>
                  <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">This list is connected to active directory services. Add or manage keys dynamically using the add control buttons.</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Tab: Assets List (Screen 4) ─────────────────────────────────── */}
          {activeTab === "assets" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Assets Directory</h2>
                  <p className="text-sm text-surface-600 mt-1 font-medium">Verify hardware, allocations, and service logs.</p>
                </div>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer"
                >
                  + Register Asset
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap gap-4 bg-white/60 p-4 border border-surface-200 rounded-xl shadow-sm">
                <input
                  type="text"
                  placeholder="Search by tag, serial, or QR code.."
                  value={assetSearch}
                  onChange={e => setAssetSearch(e.target.value)}
                  className="flex-grow min-w-[240px] bg-white border border-surface-300 rounded-lg px-3 h-10 text-sm focus:border-brand-900 focus:ring-brand-900 outline-none font-semibold text-surface-900"
                />
                
                <select
                  value={assetCategoryFilter}
                  onChange={e => setAssetCategoryFilter(e.target.value)}
                  className="bg-white border border-surface-300 rounded-lg px-3 h-10 text-sm focus:border-brand-900 outline-none font-semibold text-surface-700"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                </select>

                <select
                  value={assetStatusFilter}
                  onChange={e => setAssetStatusFilter(e.target.value)}
                  className="bg-white border border-surface-300 rounded-lg px-3 h-10 text-sm focus:border-brand-900 outline-none font-semibold text-surface-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Allocated">Allocated</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {/* Assets Directory Table */}
              <div className="bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200 text-surface-700 font-bold uppercase tracking-wider text-xs">
                      <th className="p-4">Tag</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-150 font-semibold text-surface-850">
                    {assets
                      .filter(a => {
                        const matchesQuery = a.tag.toLowerCase().includes(assetSearch.toLowerCase()) || a.name.toLowerCase().includes(assetSearch.toLowerCase());
                        const matchesCategory = assetCategoryFilter === "All" || a.category === assetCategoryFilter;
                        const matchesStatus = assetStatusFilter === "All" || a.status === assetStatusFilter;
                        return matchesQuery && matchesCategory && matchesStatus;
                      })
                      .map((asset, idx) => (
                        <tr key={idx} className="hover:bg-surface-50/50">
                          <td className="p-4 text-brand-900 font-bold">{asset.tag}</td>
                          <td className="p-4">{asset.name}</td>
                          <td className="p-4 text-surface-600">{asset.category}</td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              asset.status === "Available" ? "bg-green-50 text-green-700 border border-green-200" :
                              asset.status === "Allocated" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="p-4 text-surface-600">{asset.location}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Tab: Allocation & Transfer (Screen 5) ───────────────────────── */}
          {activeTab === "transfers" && (
            <div className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Asset allocation & Transfer</h2>
                <p className="text-sm text-surface-600 mt-1 font-medium">Coordinate resource allocation and double-allocation validation rules.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form column */}
                <div className="lg:col-span-2 bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-6">
                  {/* Select Asset */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Asset</label>
                    <select
                      value={transferAsset}
                      onChange={e => setTransferAsset(e.target.value)}
                      className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                    >
                      <option value="AF-0114">AF-0114 - Dell Laptop Pro (Allocated)</option>
                      <option value="AF-0012">AF-0012 - Dell Laptop (Allocated)</option>
                      <option value="AF-0201">AF-0201 - Office chair (Available)</option>
                    </select>
                  </div>

                  {/* Warn Banner if already allocated */}
                  {transferAsset !== "AF-0201" ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold tracking-wide space-y-0.5">
                      <div>Already Allocated to Priya shah (Engineering)</div>
                      <div className="text-xs text-red-500 font-normal">Direct re-allocation is blocked - submit a transfer request below</div>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold tracking-wide">
                      Available for direct allocation
                    </div>
                  )}

                  {/* Transfer Request */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-surface-900 border-b border-surface-150 pb-2">Transfer Request</h3>
                    <form onSubmit={handleTransferRequest} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">From</label>
                          <input
                            type="text"
                            value={transferAsset === "AF-0201" ? "--" : "Priya Shah"}
                            disabled
                            className="w-full bg-surface-50 border border-surface-300 rounded-lg h-10 px-3 text-sm text-surface-500 font-semibold outline-none cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">To</label>
                          <select
                            value={transferTo}
                            onChange={e => setTransferTo(e.target.value)}
                            className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                            required
                          >
                            <option value="">Select Employee...</option>
                            <option value="Aditi Rao">Aditi Rao (Engineering)</option>
                            <option value="Rohan Mehta">Rohan Mehta (Facilities)</option>
                            <option value="Sana Iqbal">Sana Iqbal (Field Ops)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Reason</label>
                        <textarea
                          rows={4}
                          value={transferReason}
                          onChange={e => setTransferReason(e.target.value)}
                          placeholder="Why is this transfer necessary?"
                          className="w-full bg-white border border-surface-300 rounded-lg p-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 px-5 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                      >
                        Submit Request
                      </button>
                    </form>
                  </div>
                </div>

                {/* History column */}
                <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-surface-900 uppercase tracking-wider font-sans border-b border-surface-150 pb-2">Allocation history</h3>
                  <div className="space-y-4 text-sm font-semibold text-surface-700">
                    {allocationHistory.map((hist, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="text-xs text-brand-900 font-mono bg-brand-50 px-2 py-0.5 rounded h-5">{hist.date}</span>
                        <span>{hist.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Resource Booking (Screen 6) ────────────────────────────── */}
          {activeTab === "booking" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Resource booking</h2>
                  <p className="text-sm text-surface-600 mt-1 font-medium">Verify shared calendar slots and double-booking validations.</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer"
                >
                  Book a slot
                </button>
              </div>

              <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-6">
                {/* Resource Dropdown Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Resource</label>
                  <select
                    value={bookingResource}
                    onChange={e => setBookingResource(e.target.value)}
                    className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                  >
                    <option value="Conference room B2">Conference room B2 - Tue, 7 Jul</option>
                    <option value="Tesla Model 3">Tesla Model 3 - Tue, 7 Jul</option>
                    <option value="R&D Testing Lab">R&D Testing Lab - Tue, 7 Jul</option>
                  </select>
                </div>

                {/* Slots Grid */}
                <div className="space-y-4">
                  {resourceBookings.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm font-semibold">
                      <div className="w-16 text-surface-500 font-mono text-right">{slot.time}</div>
                      
                      {slot.isBooked ? (
                        <div className="flex-grow p-4 bg-brand-50 border border-brand-200/80 rounded-lg text-brand-900 shadow-inner">
                          {slot.text}
                        </div>
                      ) : slot.conflict ? (
                        <div className="flex-grow p-4 bg-red-50 border border-dashed border-red-300 rounded-lg text-red-700">
                          {slot.text}
                        </div>
                      ) : (
                        <div className="flex-grow p-4 bg-surface-50 border border-surface-200 rounded-lg text-surface-400 font-medium">
                          {slot.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Maintenance (Screen 7 Kanban) ─────────────────────────── */}
          {activeTab === "maintenance" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Maintenance Management</h2>
                  <p className="text-sm text-surface-600 mt-1 font-medium">Kanban board workflow for approvals, assignments, and ticket resolution.</p>
                </div>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer"
                >
                  Raise Ticket
                </button>
              </div>

              {/* Kanban board */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {(["Pending", "Approved", "Technician assigned", "In progress", "Resolved"] as const).map(col => (
                  <div key={col} className="bg-white border border-surface-200 rounded-xl p-4 flex flex-col space-y-3 min-h-[300px] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 pb-2 border-b border-surface-150">{col}</h3>
                    <div className="flex-grow space-y-3">
                      {maintenanceTickets
                        .filter(t => t.status === col)
                        .map(ticket => (
                          <div 
                            key={ticket.id} 
                            className={`border rounded-lg p-3 space-y-2 shadow-sm relative group transition-all ${ticket.status === "Resolved" ? "bg-green-50 border-green-200 text-green-800" : "bg-surface-50 border-surface-200 text-surface-900"}`}
                          >
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${ticket.status === "Resolved" ? "bg-green-200 text-green-900" : "bg-brand-50 text-brand-900"}`}>
                              {ticket.tag}
                            </span>
                            <p className="text-xs font-semibold leading-relaxed pt-1">{ticket.issue}</p>
                            
                            {/* Action Button inside card */}
                            {ticket.status !== "Resolved" && (
                              <button
                                onClick={() => advanceTicket(ticket.id)}
                                className="w-full mt-2 inline-flex items-center justify-center gap-1 text-[10px] font-bold bg-white border border-surface-300 rounded hover:bg-surface-100 py-1 transition cursor-pointer text-surface-700"
                              >
                                Advance status <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold text-surface-500 uppercase tracking-wide">
                Approving a card moves the asset to under maintenance, resolving return it to available
              </div>
            </div>
          )}

          {/* ─── Tab: Audit (Screen 8) ───────────────────────────────────────── */}
          {activeTab === "audit" && (
            <div className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Asset Audit</h2>
                <p className="text-sm text-surface-600 mt-1 font-medium">Verify locations and dynamically trigger discrepancy auto-generation.</p>
              </div>

              {/* Info Header Banner */}
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 text-brand-900 shadow-sm">
                <h3 className="font-extrabold text-base tracking-wide font-sans">Q3 audit: Engineering dept - 1-15 Jul</h3>
                <p className="text-xs font-semibold text-brand-850 mt-1">Auditors: aditi rao, sana iqbal</p>
              </div>

              {/* Audit Checklist Table */}
              <div className="bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200 text-surface-700 font-bold uppercase tracking-wider text-xs">
                      <th className="p-4">Asset</th>
                      <th className="p-4">Expected location</th>
                      <th className="p-4 text-center">Verification (Click to Toggle)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-150 font-semibold text-surface-850">
                    {auditAssets.map((asset, idx) => (
                      <tr key={idx} className="hover:bg-surface-50/50">
                        <td className="p-4 font-bold text-surface-900">{asset.tag} {asset.name}</td>
                        <td className="p-4 text-surface-600 font-mono">{asset.location}</td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleAuditStatus(asset.tag)}
                            disabled={!auditCycleOpen}
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border transition shadow-sm cursor-pointer ${
                              asset.status === "Verified" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" :
                              asset.status === "Missing" ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" :
                              "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            } ${!auditCycleOpen && "opacity-60 cursor-not-allowed"}`}
                          >
                            {asset.status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Warning discrepancy alert banner */}
              {auditCycleOpen && flaggedAuditsCount > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-bold tracking-wide flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{flaggedAuditsCount} assets flagged - discrepancy report generated automatically</span>
                </div>
              )}

              {/* Action Close Cycle */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setAuditCycleOpen(false);
                    setActivities([
                      { id: Date.now().toString(), text: `Audit cycle "Q3 Engineering" has been closed by ${username || "Agent"}`, timestamp: "Just now" },
                      ...activities
                    ]);
                  }}
                  disabled={!auditCycleOpen}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer transition shadow-sm ${!auditCycleOpen && "bg-surface-300 text-surface-500 cursor-not-allowed hover:bg-surface-300"}`}
                >
                  {auditCycleOpen ? "Close audit cycle" : "Audit cycle closed"}
                </button>
              </div>
            </div>
          )}

          {/* ─── Tab: Reports & Analytics (Screen 9) ────────────────────────── */}
          {activeTab === "reports" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex justify-between items-center border-b border-surface-200 pb-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Reports & Analytics</h2>
                  <p className="text-sm text-surface-600 mt-1 font-medium">Verify department utilization and line-graph maintenance frequencies.</p>
                </div>
                {/* Reports Mode Selector */}
                <div className="flex gap-1.5 bg-surface-200/60 p-1.5 rounded-xl border border-surface-250 shrink-0">
                  <button
                    type="button"
                    onClick={() => setReportsMode("assets")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${reportsMode === "assets" ? "bg-brand-900 text-white shadow" : "text-surface-700 hover:text-surface-900 hover:bg-surface-100"}`}
                  >
                    Physical Assets
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportsMode("crm")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${reportsMode === "crm" ? "bg-brand-900 text-white shadow" : "text-surface-700 hover:text-surface-900 hover:bg-surface-100"}`}
                  >
                    CRM Analytics
                  </button>
                </div>
              </div>

              {/* Simulated SVG Charts */}
              {reportsMode === "assets" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Column Bar chart */}
                  <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 font-sans flex items-center gap-1.5">
                      <BarChart4 className="w-4 h-4 text-brand-900" />
                      Utilization by department
                    </h3>
                    <div className="bg-surface-50/50 p-4 border border-surface-200/60 rounded-lg">
                      <svg className="w-full h-36" viewBox="0 0 300 100">
                        <line x1="0" y1="90" x2="300" y2="90" stroke="#E9ECEF" strokeWidth="1" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="#E9ECEF" strokeWidth="1" strokeDasharray="4" />
                        {/* Department Columns */}
                        <rect x="25" y="45" width="16" height="45" rx="3" fill="#003B5C" />
                        <rect x="65" y="25" width="16" height="65" rx="3" fill="#003B5C" />
                        <rect x="105" y="10" width="16" height="80" rx="3" fill="#003B5C" />
                        <rect x="145" y="55" width="16" height="35" rx="3" fill="#003B5C" />
                        <rect x="185" y="35" width="16" height="55" rx="3" fill="#003B5C" />
                        <rect x="225" y="20" width="16" height="70" rx="3" fill="#00547d" />
                        <rect x="265" y="60" width="16" height="30" rx="3" fill="#0098d4" />
                      </svg>
                    </div>
                  </div>

                  {/* Line chart */}
                  <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 font-sans flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      Maintenance Frequency
                    </h3>
                    <div className="bg-surface-50/50 p-4 border border-surface-200/60 rounded-lg">
                      <svg className="w-full h-36" viewBox="0 0 300 100">
                        <line x1="0" y1="90" x2="300" y2="90" stroke="#E9ECEF" strokeWidth="1" />
                        {/* Graph path */}
                        <path 
                          d="M10,80 L50,60 L90,65 L130,45 L170,55 L210,35 L250,25 L290,15" 
                          fill="none" 
                          stroke="#EF4444" 
                          strokeWidth="2" 
                        />
                        <path 
                          d="M10,80 L50,60 L90,65 L130,45 L170,55 L210,35 L250,25 L290,15 L290,90 L10,90 Z" 
                          fill="url(#gradient-red)" 
                          opacity="0.1" 
                        />
                        <defs>
                          <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* CRM Bar chart */}
                  <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 font-sans flex items-center gap-1.5">
                      <BarChart4 className="w-4 h-4 text-brand-900" />
                      Sync Volume by Platform (thousands)
                    </h3>
                    <div className="bg-surface-50/50 p-4 border border-surface-200/60 rounded-lg">
                      <svg className="w-full h-36" viewBox="0 0 320 100">
                        <line x1="0" y1="90" x2="320" y2="90" stroke="#E9ECEF" strokeWidth="1" />
                        <line x1="0" y1="50" x2="320" y2="50" stroke="#E9ECEF" strokeWidth="1" strokeDasharray="4" />
                        {/* Salesforce, HubSpot, Zoho, Pipedrive, Freshsales, MS Dynamics, Copper, Insightly */}
                        <rect x="15" y="15" width="14" height="75" rx="3" fill="#003B5C" />
                        <rect x="55" y="25" width="14" height="65" rx="3" fill="#003B5C" />
                        <rect x="95" y="35" width="14" height="55" rx="3" fill="#003B5C" />
                        <rect x="135" y="45" width="14" height="45" rx="3" fill="#003B5C" />
                        <rect x="175" y="55" width="14" height="35" rx="3" fill="#003B5C" />
                        <rect x="215" y="65" width="14" height="25" rx="3" fill="#00547d" />
                        <rect x="255" y="72" width="14" height="18" rx="3" fill="#0098d4" />
                        <rect x="295" y="80" width="14" height="10" rx="3" fill="#0098d4" />
                      </svg>
                    </div>
                  </div>

                  {/* CRM Line chart */}
                  <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 font-sans flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-brand-900" />
                      AI Followups vs Conversions
                    </h3>
                    <div className="bg-surface-50/50 p-4 border border-surface-200/60 rounded-lg">
                      <svg className="w-full h-36" viewBox="0 0 300 100">
                        <line x1="0" y1="90" x2="300" y2="90" stroke="#E9ECEF" strokeWidth="1" />
                        {/* Red follow-ups */}
                        <path 
                          d="M10,80 L50,55 L90,62 L130,35 L170,45 L210,25 L250,15 L290,5" 
                          fill="none" 
                          stroke="#EF4444" 
                          strokeWidth="2" 
                        />
                        {/* Blue conversions */}
                        <path 
                          d="M10,90 L50,75 L90,80 L130,60 L170,68 L210,50 L250,42 L290,32" 
                          fill="none" 
                          stroke="#3B82F6" 
                          strokeWidth="2" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Text summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-semibold text-surface-700">
                {reportsMode === "assets" ? (
                  <>
                    {/* Most used */}
                    <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-3">
                      <h4 className="font-bold text-surface-900 uppercase tracking-wider text-xs">Most used assets</h4>
                      <ul className="space-y-2 border-l border-brand-900 pl-3">
                        <li>Room B2: <span className="text-brand-900 font-bold">34 bookings</span> this month</li>
                        <li>Van AF-343: <span className="text-brand-900 font-bold">21 trips</span> this month</li>
                        <li>Projector AF-335: <span className="text-brand-900 font-bold">18 uses</span></li>
                      </ul>
                    </div>

                    {/* Retirement */}
                    <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-3">
                      <h4 className="font-bold text-surface-900 uppercase tracking-wider text-xs">Assets due for maintenance / nearing retirement</h4>
                      <ul className="space-y-2 border-l border-amber-500 pl-3">
                        <li>Forklift AF-0087 : <span className="text-amber-700 font-bold">service due in 5 days</span></li>
                        <li>Laptop AF-0020 : <span className="text-surface-500">4 years old : nearing retirement</span></li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    {/* CRM Active platforms */}
                    <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-3">
                      <h4 className="font-bold text-surface-900 uppercase tracking-wider text-xs">Most Active CRM integrations</h4>
                      <ul className="space-y-2 border-l border-brand-900 pl-3">
                        <li>Salesforce CRM: <span className="text-brand-900 font-bold">34k syncs</span> this month</li>
                        <li>HubSpot CRM: <span className="text-brand-900 font-bold">21k syncs</span> this month</li>
                        <li>Zoho CRM: <span className="text-brand-900 font-bold">18k syncs</span></li>
                      </ul>
                    </div>

                    {/* API keys renewal */}
                    <div className="bg-white border border-surface-200 rounded-xl p-6 shadow-sm space-y-3">
                      <h4 className="font-bold text-surface-900 uppercase tracking-wider text-xs">Integrations due for renewal / deprecating</h4>
                      <ul className="space-y-2 border-l border-amber-500 pl-3">
                        <li>Copper CRM API token : <span className="text-amber-700 font-bold">token expires in 5 days</span></li>
                        <li>Insightly integration : <span className="text-surface-500">4 years old : API v2 deprecation warning</span></li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Action Export Button */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const activityText = reportsMode === "assets" 
                      ? `[Physical Assets Report] Exported asset inventory report.`
                      : `[CRM Report] Exported CRM sync logs as CSV.`;
                    const activity: Activity = {
                      id: Date.now().toString(),
                      text: activityText,
                      timestamp: "Just now"
                    };
                    setActivities([activity, ...activities]);
                  }}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer transition shadow-sm"
                >
                  Export report
                </button>
              </div>
            </div>
          )}

          {/* ─── Tab: Activity logs & Notifications (Screen 10) ─────────────── */}
          {activeTab === "notifications" && (
            <div className="max-w-6xl space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 font-sans uppercase">Activity logs & Notifications</h2>
                <p className="text-sm text-surface-600 mt-1 font-medium">Verify system audit logs and security-filtered notification feeds.</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 border-b border-surface-200 pb-3">
                {(["All", "Alerts", "Approvals", "Bookings"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLogFilter(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${logFilter === tab ? "bg-brand-900 text-white" : "bg-white border border-surface-200 text-surface-700 hover:bg-surface-50"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Logs Checklist */}
              <div className="bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm divide-y divide-surface-150 font-semibold text-sm text-surface-750">
                {logs
                  .filter(l => logFilter === "All" || l.type === logFilter)
                  .map((log, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-surface-50/50">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${log.color}`} />
                        <span>{log.text}</span>
                      </div>
                      <span className="text-xs text-surface-400 font-mono font-normal shrink-0">{log.time}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ─── Tab: CRM Demo ────────────────────────────────────────────────── */}
          {activeTab === "crm" && (
            <div className="bg-white text-black p-8 rounded-xl max-w-6xl border border-zinc-200 shadow-xl">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900">AI-Driven Solutions Integration</h2>
                  <p className="text-sm text-zinc-500 mt-1">Live preview of our customer relations system.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveTab("dashboard")} 
                  className="px-4 py-2 border border-zinc-200 rounded-md text-xs font-semibold hover:bg-zinc-50 transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
              <FeaturedCrmDemoSection />
            </div>
          )}
        </main>
      </div>

      {/* Register Asset Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-surface-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200">
              <h3 className="text-base font-bold text-surface-900 uppercase tracking-wider font-sans">Register New Asset</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-surface-400 hover:text-surface-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro M3"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 focus:ring-brand-900 outline-none text-surface-900 font-semibold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Category</label>
                <select
                  value={assetCategory}
                  onChange={e => setAssetCategory(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 focus:ring-brand-900 outline-none text-surface-900 font-semibold"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Server">Server</option>
                  <option value="Fleet Car">Fleet Car</option>
                  <option value="Projector">Projector</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Create Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Book Resource Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-surface-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200">
              <h3 className="text-base font-bold text-surface-900 uppercase tracking-wider font-sans">Book Shared Resource</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-surface-400 hover:text-surface-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleBookResource} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Resource</label>
                <select
                  value={bookingRoom}
                  onChange={e => setBookingRoom(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 focus:ring-brand-900 outline-none text-surface-900 font-semibold"
                >
                  <option value="Room B2">Boardroom B2</option>
                  <option value="Tesla Model 3">Tesla Model 3 (Fleet A)</option>
                  <option value="Testing Lab 2">Testing Lab 2</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Time Slot</label>
                <input
                  type="text"
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 focus:ring-brand-900 outline-none text-surface-900 font-semibold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Raise Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-surface-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200">
              <h3 className="text-base font-bold text-surface-900 uppercase tracking-wider font-sans">Raise Maintenance Request</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-surface-400 hover:text-surface-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleRaiseRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Issue Description</label>
                <input
                  type="text"
                  placeholder="e.g. Screen flickering, brake pads squeaking"
                  value={requestTitle}
                  onChange={e => setRequestTitle(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 focus:ring-brand-900 outline-none text-surface-900 font-semibold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal (Org Setup Section) */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-surface-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200">
              <h3 className="text-base font-bold text-surface-900 uppercase tracking-wider font-sans">Add Department</h3>
              <button onClick={() => setShowAddDeptModal(false)} className="text-surface-400 hover:text-surface-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering, Sales"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Department Head</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Shah"
                  value={newDeptHead}
                  onChange={e => setNewDeptHead(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-wider">Parent Department</label>
                <input
                  type="text"
                  placeholder="e.g. Operations, IT"
                  value={newDeptParent}
                  onChange={e => setNewDeptParent(e.target.value)}
                  className="w-full bg-white border border-surface-300 rounded-lg h-10 px-3 text-sm focus:border-brand-900 outline-none text-surface-900 font-semibold"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Create Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
