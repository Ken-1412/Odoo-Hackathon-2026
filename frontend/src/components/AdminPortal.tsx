import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Building2, Laptop, ClipboardCheck, LogOut, Plus,
  Sparkles, UserCheck, Users, Layers, Settings, Search, ShieldAlert, 
  Edit2, Trash2, Eye, CheckCircle, Trash
} from "lucide-react";
import Logo from "./ui/Logo";

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface Activity {
  id: string;
  text: string;
  timestamp: string;
}

interface Department {
  name: string;
  head: string;
  parent: string;
  employeesCount: number;
  status: "Active" | "Inactive";
  createdDate: string;
  description?: string;
}

interface CustomField {
  name: string;
  type: "Text" | "Number" | "Date" | "Dropdown";
  required: boolean;
}

interface AssetCategory {
  name: string;
  description: string;
  assetsCount: number;
  status: "Active" | "Inactive";
  iconName: string;
  customFields?: CustomField[];
}

interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  role: "Employee" | "Department Head" | "Asset Manager" | "Administrator";
  status: "Active" | "Inactive";
  lastLogin: string;
}

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "info" | "error";
}

export default function AdminPortal({
  username,
  onLogout,
  onSwitchToEmployee
}: {
  username: string | null;
  onLogout: () => void;
  onSwitchToEmployee: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeSetupTab, setActiveSetupTab] = useState<"departments" | "categories" | "employees">("departments");
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Filter States for Employee Directory
  const [filterDept, setFilterDept] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Loading indicator helper
  const [isLoading, setIsLoading] = useState(false);

  // ─── Toast Helper ──────────────────────────────────────────────────────────
  const showToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToastMessages(prev => [...prev, { id, text, type }]);
  };

  useEffect(() => {
    if (toastMessages.length > 0) {
      const timer = setTimeout(() => {
        setToastMessages(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessages]);

  // ─── Mock Data States ──────────────────────────────────────────────────────
  const [departments, setDepartments] = useState<Department[]>([
    { name: "Engineering", head: "Aditi Rao", parent: "--", employeesCount: 5, status: "Active", createdDate: "2026-01-10", description: "Core product development and software engineering team." },
    { name: "Backend", head: "Arjun Nair", parent: "Engineering", employeesCount: 3, status: "Active", createdDate: "2026-02-15", description: "Server-side logic, APIs, databases, and microservices." },
    { name: "Frontend", head: "Priya Shah", parent: "Engineering", employeesCount: 2, status: "Active", createdDate: "2026-02-20", description: "User interface, client-side applications, and customer portals." },
    { name: "Facilities", head: "Rohan Mehta", parent: "--", employeesCount: 2, status: "Active", createdDate: "2026-01-12", description: "Office space, equipment maintenance, and facility resources." },
    { name: "Field Ops", head: "Sana Iqbal", parent: "--", employeesCount: 1, status: "Inactive", createdDate: "2026-01-15", description: "External technician logistics and client on-site visits." },
    { name: "HR", head: "Neha Gupta", parent: "--", employeesCount: 2, status: "Active", createdDate: "2026-01-20", description: "Human resources, employee engagement, and onboarding." },
    { name: "Finance", head: "Vikram Malhotra", parent: "--", employeesCount: 2, status: "Active", createdDate: "2026-01-18", description: "Corporate accounting, treasury, audits, and budgeting." },
    { name: "Marketing", head: "Aisha Khan", parent: "--", employeesCount: 2, status: "Active", createdDate: "2026-03-01", description: "Brand awareness, B2B sales pipelines, and outreach." },
  ]);

  const [categories, setCategories] = useState<AssetCategory[]>([
    { name: "Electronics", description: "Laptops, servers, monitors, and other core IT devices.", assetsCount: 120, status: "Active", iconName: "Laptop", customFields: [{ name: "Serial Number", type: "Text", required: true }, { name: "Warranty Expiry", type: "Date", required: true }] },
    { name: "Furniture", description: "Desks, chairs, and other office workstations.", assetsCount: 45, status: "Active", iconName: "Armchair" },
    { name: "Vehicles", description: "Utility vehicles and company fleet logistics.", assetsCount: 8, status: "Active", iconName: "Car" },
    { name: "Networking", description: "Routers, switches, access points, and server cabinets.", assetsCount: 15, status: "Active", iconName: "Network" },
    { name: "Accessories", description: "Adapters, docking stations, keypads, and mice.", assetsCount: 80, status: "Active", iconName: "Cable" },
    { name: "Office Equipment", description: "Printers, projectors, and shared scanners.", assetsCount: 10, status: "Active", iconName: "Printer" },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "EMP-001", name: "Priya Shah", email: "priya@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya", department: "Frontend", role: "Employee", status: "Active", lastLogin: "2 mins ago" },
    { id: "EMP-002", name: "Aditi Rao", email: "aditi@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aditi", department: "Engineering", role: "Department Head", status: "Active", lastLogin: "1 hour ago" },
    { id: "EMP-003", name: "Rohan Mehta", email: "rohan@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rohan", department: "Facilities", role: "Department Head", status: "Active", lastLogin: "3 hours ago" },
    { id: "EMP-004", name: "Sana Iqbal", email: "sana@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sana", department: "Field Ops", role: "Department Head", status: "Inactive", lastLogin: "2 days ago" },
    { id: "EMP-005", name: "Arjun Nair", email: "arjun@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun", department: "Backend", role: "Asset Manager", status: "Active", lastLogin: "10 mins ago" },
    { id: "EMP-006", name: "Ketan Singh", email: "ketan@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ketan", department: "Engineering", role: "Administrator", status: "Active", lastLogin: "Just now" },
    { id: "EMP-007", name: "Vikram Malhotra", email: "vikram@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram", department: "Finance", role: "Employee", status: "Active", lastLogin: "4 hours ago" },
    { id: "EMP-008", name: "Neha Gupta", email: "neha@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Neha", department: "HR", role: "Employee", status: "Active", lastLogin: "5 hours ago" },
    { id: "EMP-009", name: "Kabir Sharma", email: "kabir@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kabir", department: "Engineering", role: "Employee", status: "Active", lastLogin: "1 day ago" },
    { id: "EMP-010", name: "Aisha Khan", email: "aisha@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aisha", department: "Marketing", role: "Employee", status: "Active", lastLogin: "3 days ago" },
    { id: "EMP-011", name: "Rahul Verma", email: "rahul@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul", department: "Facilities", role: "Employee", status: "Active", lastLogin: "18 mins ago" },
    { id: "EMP-012", name: "Meera Nair", email: "meera@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Meera", department: "Finance", role: "Employee", status: "Active", lastLogin: "6 hours ago" },
    { id: "EMP-013", name: "Dev Patel", email: "dev@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Dev", department: "Backend", role: "Employee", status: "Inactive", lastLogin: "5 days ago" },
    { id: "EMP-014", name: "Riya Sen", email: "riya@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Riya", department: "HR", role: "Employee", status: "Active", lastLogin: "8 hours ago" },
    { id: "EMP-015", name: "Ananya Das", email: "ananya@systems.core", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ananya", department: "Marketing", role: "Employee", status: "Active", lastLogin: "12 mins ago" },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", text: "Role Assigned: Priya Shah updated to Employee by Ketan Singh", timestamp: "Just now" },
    { id: "2", text: "New Category Added: Networking registered by Administrator", timestamp: "1 hour ago" },
    { id: "3", text: "Department Created: Frontend department approved under Engineering", timestamp: "2 hours ago" },
  ]);

  // Statistics summaries
  const departmentCount = departments.length;
  const employeeCount = employees.length;
  const categoryCount = categories.length;
  const deptHeadsCount = employees.filter(e => e.role === "Department Head").length;
  const assetManagersCount = employees.filter(e => e.role === "Asset Manager").length;
  const activeUsersCount = employees.filter(e => e.status === "Active").length;

  // ─── Modal States ──────────────────────────────────────────────────────────
  // 1. Department Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptModalMode, setDeptModalMode] = useState<"create" | "edit">("create");
  const [selectedDeptName, setSelectedDeptName] = useState("");
  // Form fields
  const [formDeptName, setFormDeptName] = useState("");
  const [formDeptHead, setFormDeptHead] = useState("");
  const [formDeptParent, setFormDeptParent] = useState("--");
  const [formDeptStatus, setFormDeptStatus] = useState<boolean>(true);
  const [formDeptDesc, setFormDeptDesc] = useState("");
  const [deptFormError, setDeptFormError] = useState("");

  // 2. Category Modal & Dynamic Builder
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catModalMode, setCatModalMode] = useState<"create" | "edit">("create");
  const [selectedCatName, setSelectedCatName] = useState("");
  // Form fields
  const [formCatName, setFormCatName] = useState("");
  const [formCatDesc, setFormCatDesc] = useState("");
  const [formCatStatus, setFormCatStatus] = useState<boolean>(true);
  const [formCatIcon, setFormCatIcon] = useState("Laptop");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [catFormError, setCatFormError] = useState("");

  // 3. Assign Role Modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedEmpName, setSelectedEmpName] = useState("");
  const [formEmpRole, setFormEmpRole] = useState<Employee["role"]>("Employee");
  const [roleWarningVisible, setRoleWarningVisible] = useState(false);

  // 4. View Entity Modal
  const [viewEntityData, setViewEntityData] = useState<{ title: string; fields: Record<string, string | number> } | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenCreateDept = () => {
    setDeptModalMode("create");
    setFormDeptName("");
    setFormDeptHead(employees[0]?.name || "");
    setFormDeptParent("--");
    setFormDeptStatus(true);
    setFormDeptDesc("");
    setDeptFormError("");
    setShowDeptModal(true);
  };

  const handleOpenEditDept = (dept: Department) => {
    setDeptModalMode("edit");
    setSelectedDeptName(dept.name);
    setFormDeptName(dept.name);
    setFormDeptHead(dept.head);
    setFormDeptParent(dept.parent);
    setFormDeptStatus(dept.status === "Active");
    setFormDeptDesc(dept.description || "");
    setDeptFormError("");
    setShowDeptModal(true);
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDeptName.trim()) {
      setDeptFormError("Department name is required.");
      return;
    }
    if (formDeptName.length < 3) {
      setDeptFormError("Department name must be at least 3 characters.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (deptModalMode === "create") {
        // Create
        if (departments.some(d => d.name.toLowerCase() === formDeptName.toLowerCase())) {
          setDeptFormError("Department name already exists.");
          setIsLoading(false);
          return;
        }
        const newDept: Department = {
          name: formDeptName,
          head: formDeptHead,
          parent: formDeptParent,
          employeesCount: 0,
          status: formDeptStatus ? "Active" : "Inactive",
          createdDate: new Date().toISOString().split("T")[0],
          description: formDeptDesc
        };
        setDepartments([...departments, newDept]);
        showToast("Department Created Successfully", "success");
        setActivities([
          { id: Date.now().toString(), text: `Department Created: ${newDept.name} department registered under ${newDept.parent}`, timestamp: "Just now" },
          ...activities
        ]);
      } else {
        // Edit
        setDepartments(prev => prev.map(d => {
          if (d.name === selectedDeptName) {
            return {
              ...d,
              name: formDeptName,
              head: formDeptHead,
              parent: formDeptParent,
              status: formDeptStatus ? "Active" : "Inactive",
              description: formDeptDesc
            };
          }
          return d;
        }));
        showToast("Department Updated Successfully", "success");
      }
      setIsLoading(false);
      setShowDeptModal(false);
    }, 600);
  };

  const handleToggleDeptStatus = (deptName: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.name === deptName) {
        const nextStatus = d.status === "Active" ? "Inactive" : "Active";
        if (nextStatus === "Inactive") {
          showToast("Department Archived", "info");
        } else {
          showToast("Department Activated", "success");
        }
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const handleOpenCreateCategory = () => {
    setCatModalMode("create");
    setFormCatName("");
    setFormCatDesc("");
    setFormCatStatus(true);
    setFormCatIcon("Laptop");
    setCustomFields([]);
    setCatFormError("");
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: AssetCategory) => {
    setCatModalMode("edit");
    setSelectedCatName(cat.name);
    setFormCatName(cat.name);
    setFormCatDesc(cat.description);
    setFormCatStatus(cat.status === "Active");
    setFormCatIcon(cat.iconName);
    setCustomFields(cat.customFields || []);
    setCatFormError("");
    setShowCategoryModal(true);
  };

  const handleAddField = () => {
    setCustomFields([...customFields, { name: "New Field", type: "Text", required: false }]);
  };

  const handleRemoveField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: keyof CustomField, value: any) => {
    setCustomFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCatName.trim()) {
      setCatFormError("Category name is required.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (catModalMode === "create") {
        if (categories.some(c => c.name.toLowerCase() === formCatName.toLowerCase())) {
          setCatFormError("Category name already exists.");
          setIsLoading(false);
          return;
        }
        const newCat: AssetCategory = {
          name: formCatName,
          description: formCatDesc,
          assetsCount: 0,
          status: formCatStatus ? "Active" : "Inactive",
          iconName: formCatIcon,
          customFields: customFields
        };
        setCategories([...categories, newCat]);
        showToast("Category Created Successfully", "success");
        setActivities([
          { id: Date.now().toString(), text: `Category Created: ${newCat.name} registered by Administrator`, timestamp: "Just now" },
          ...activities
        ]);
      } else {
        setCategories(prev => prev.map(c => {
          if (c.name === selectedCatName) {
            return {
              ...c,
              name: formCatName,
              description: formCatDesc,
              status: formCatStatus ? "Active" : "Inactive",
              iconName: formCatIcon,
              customFields: customFields
            };
          }
          return c;
        }));
        showToast("Category Updated", "success");
      }
      setIsLoading(false);
      setShowCategoryModal(false);
    }, 600);
  };

  const handleOpenAssignRole = (emp: Employee) => {
    setSelectedEmpId(emp.id);
    setSelectedEmpName(emp.name);
    setFormEmpRole(emp.role);
    setRoleWarningVisible(false);
    setShowRoleModal(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleWarningVisible) {
      setRoleWarningVisible(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === selectedEmpId) {
          return { ...emp, role: formEmpRole };
        }
        return emp;
      }));
      showToast("Role Assigned Successfully", "success");
      setActivities([
        { id: Date.now().toString(), text: `Role Assigned: ${selectedEmpName} updated to ${formEmpRole} by Administrator`, timestamp: "Just now" },
        ...activities
      ]);
      setIsLoading(false);
      setShowRoleModal(false);
    }, 600);
  };

  const handleToggleEmployeeStatus = (empId: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        const nextStatus = e.status === "Active" ? "Inactive" : "Active";
        if (nextStatus === "Inactive") {
          showToast("Employee Deactivated", "info");
        } else {
          showToast("Employee Activated", "success");
        }
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  // ─── Filter & Search Logic ─────────────────────────────────────────────────
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.email.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || emp.department === filterDept;
    const matchesRole = filterRole === "All" || emp.role === filterRole;
    const matchesStatus = filterStatus === "All" || emp.status === filterStatus;
    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  return (
    <div 
      className={`min-h-screen bg-surface-50 text-surface-900 flex flex-col font-sans select-none transition-colors duration-200 ${themeMode === "dark" ? "dark bg-zinc-950 text-zinc-100" : ""}`}
      style={{
        backgroundImage: themeMode === "light" 
          ? `linear-gradient(rgba(248, 249, 250, 0.94), rgba(248, 249, 250, 0.98)), url('/clean_space_chains_bg.png')`
          : `linear-gradient(rgba(9, 9, 11, 0.96), rgba(9, 9, 11, 0.98)), url('/clean_space_chains_bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toast Alert Popups */}
      <div className="fixed top-6 right-6 z-[200] space-y-3 pointer-events-none">
        {toastMessages.map(msg => (
          <div
            key={msg.id}
            className={`min-w-[280px] p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-float transition-all pointer-events-auto bg-white dark:bg-zinc-900 ${
              msg.type === "success" ? "border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" :
              msg.type === "error" ? "border-red-200 dark:border-red-800 text-red-800 dark:text-red-300" :
              "border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-300"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-extrabold tracking-wide uppercase">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Top Header sticky */}
      <header className="h-16 border-b border-surface-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-white/80 dark:bg-zinc-900/85 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-900 flex items-center justify-center p-1">
            <Logo className="w-full h-full text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-white font-sans">
            Asset<span className="text-brand-900">Flow</span>
            <span className="ml-2 text-xs uppercase bg-brand-100 dark:bg-brand-950 text-brand-900 dark:text-brand-300 px-2 py-0.5 rounded font-mono font-bold tracking-wider">Admin</span>
          </span>
        </div>

        {/* Global actions & theme toggles */}
        <div className="flex items-center gap-6">
          {/* Active directory search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-surface-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-surface-50 dark:bg-zinc-950 border border-surface-200 dark:border-zinc-800 rounded-lg h-9 pl-9 pr-4 text-xs font-semibold focus:border-brand-900 dark:focus:border-brand-500 outline-none text-surface-900 dark:text-zinc-100 w-56"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
              className="p-2 border border-surface-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-surface-600 dark:text-zinc-300 hover:bg-surface-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Toggle Theme"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <span className="text-sm text-surface-600 dark:text-zinc-400 font-medium">
              Callsign: <span className="text-brand-900 dark:text-brand-500 font-bold">{username || "Admin"}</span>
            </span>
            
            <button
              type="button"
              onClick={onSwitchToEmployee}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-brand-900 text-xs font-bold text-brand-900 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 transition-all cursor-pointer shadow-sm"
            >
              Employee Portal
            </button>
            
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-900 text-xs font-bold text-white hover:bg-brand-800 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main shell Layout */}
      <div className="flex-grow flex">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-surface-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md py-6 flex flex-col justify-between shrink-0">
          <nav className="space-y-1 px-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-brand-900 text-white shadow-md shadow-brand-900/20" 
                  : "text-surface-650 dark:text-zinc-400 hover:bg-surface-100 dark:hover:bg-zinc-800 hover:text-surface-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab("org_setup")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === "org_setup"
                  ? "bg-brand-900 text-white shadow-md shadow-brand-900/20" 
                  : "text-surface-650 dark:text-zinc-400 hover:bg-surface-100 dark:hover:bg-zinc-800 hover:text-surface-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Organization Setup
            </button>

            {/* Disabled Audit Logs Placeholder */}
            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-surface-400 dark:text-zinc-600 opacity-60 cursor-not-allowed select-none">
              <ClipboardCheck className="w-4 h-4" />
              Audit Logs (Locked)
            </div>

            {/* Placeholder Settings */}
            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-surface-400 dark:text-zinc-600 opacity-60 cursor-not-allowed select-none">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </nav>
          
          <div className="px-6 py-4 border-t border-surface-200 dark:border-zinc-800 text-[10px] text-surface-400 dark:text-zinc-600 font-mono">
            RBAC ADMIN PANEL v3.2
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-8 overflow-y-auto">
          
          {/* ─── TAB 1: ADMIN DASHBOARD ──────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="max-w-6xl space-y-8 animate-float">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white font-sans uppercase">Admin Overview</h2>
                <p className="text-sm text-surface-600 dark:text-zinc-400 mt-1 font-medium">RBAC Security Console & Resource Directories.</p>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 border border-surface-200/80 dark:border-zinc-800/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex items-center gap-4 h-24">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-300 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-surface-550 dark:text-zinc-500 uppercase tracking-wider">Departments</span>
                    <span className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">{departmentCount}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-surface-200/80 dark:border-zinc-800/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex items-center gap-4 h-24">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-300 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-surface-550 dark:text-zinc-500 uppercase tracking-wider">Employees</span>
                    <span className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">{employeeCount}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-surface-200/80 dark:border-zinc-800/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex items-center gap-4 h-24">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-300 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-surface-550 dark:text-zinc-500 uppercase tracking-wider">Categories</span>
                    <span className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">{categoryCount}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-surface-200/80 dark:border-zinc-800/80 hover:border-brand-900/30 rounded-xl p-5 shadow-sm hover:shadow transition-all flex items-center gap-4 h-24">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-300 flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-surface-550 dark:text-zinc-500 uppercase tracking-wider">Active Users</span>
                    <span className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">{activeUsersCount}</span>
                  </div>
                </div>
              </div>

              {/* Sub-counters for specific roles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/60 dark:bg-zinc-900/60 p-4 border border-surface-200 dark:border-zinc-800 rounded-xl text-sm font-semibold flex justify-between items-center shadow-sm">
                  <span className="text-surface-600 dark:text-zinc-400">Department Heads</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">{deptHeadsCount}</span>
                </div>
                <div className="bg-white/60 dark:bg-zinc-900/60 p-4 border border-surface-200 dark:border-zinc-800 rounded-xl text-sm font-semibold flex justify-between items-center shadow-sm">
                  <span className="text-surface-600 dark:text-zinc-400">Asset Managers</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-800">{assetManagersCount}</span>
                </div>
                <div className="bg-white/60 dark:bg-zinc-900/60 p-4 border border-surface-200 dark:border-zinc-800 rounded-xl text-sm font-semibold flex justify-between items-center shadow-sm">
                  <span className="text-surface-600 dark:text-zinc-400">Administrators</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold border border-red-200 dark:border-red-800">{employees.filter(e => e.role === "Administrator").length}</span>
                </div>
              </div>

              {/* Quick actions & Recent activity panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities list */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white tracking-wide font-sans uppercase">Recent Security Logs</h3>
                  <div className="space-y-3 font-semibold text-sm text-surface-700 dark:text-zinc-300">
                    {activities.map(activity => (
                      <div key={activity.id} className="flex justify-between items-center py-2.5 border-b border-surface-100 dark:border-zinc-800 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-900 dark:bg-brand-500" />
                          <span>{activity.text}</span>
                        </div>
                        <span className="text-xs text-surface-400 dark:text-zinc-500 font-mono font-normal shrink-0">{activity.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions checklist panel */}
                <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white tracking-wide font-sans uppercase">Quick Actions</h3>
                    <p className="text-xs text-surface-550 dark:text-zinc-400 font-medium">Initiate common organizational administrative workflow tickets.</p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setActiveTab("org_setup");
                        setActiveSetupTab("departments");
                        handleOpenCreateDept();
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 hover:border-brand-900 dark:hover:border-brand-500 hover:bg-surface-50 dark:hover:bg-zinc-800 text-xs font-bold text-surface-750 dark:text-zinc-200 flex items-center justify-between transition cursor-pointer"
                    >
                      <span>Create Department</span>
                      <Building2 className="w-4 h-4 text-surface-400" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("org_setup");
                        setActiveSetupTab("categories");
                        handleOpenCreateCategory();
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 hover:border-brand-900 dark:hover:border-brand-500 hover:bg-surface-50 dark:hover:bg-zinc-800 text-xs font-bold text-surface-750 dark:text-zinc-200 flex items-center justify-between transition cursor-pointer"
                    >
                      <span>New Asset Category</span>
                      <Layers className="w-4 h-4 text-surface-400" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("org_setup");
                        setActiveSetupTab("employees");
                        showToast("Search directory below to assign roles", "info");
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 hover:border-brand-900 dark:hover:border-brand-500 hover:bg-surface-50 dark:hover:bg-zinc-800 text-xs font-bold text-surface-750 dark:text-zinc-200 flex items-center justify-between transition cursor-pointer"
                    >
                      <span>Assign User Role</span>
                      <UserCheck className="w-4 h-4 text-surface-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: ORGANIZATION SETUP ────────────────────────────────────── */}
          {activeTab === "org_setup" && (
            <div className="max-w-6xl space-y-8 animate-float">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white font-sans uppercase">Organization Setup</h2>
                <p className="text-sm text-surface-600 dark:text-zinc-400 mt-1 font-medium">Admin configurations for hierarchy nodes, categories, and directories.</p>
              </div>

              {/* Layout subtabs selector */}
              <div className="flex gap-2 border-b border-surface-200 dark:border-zinc-800 pb-3">
                <button
                  onClick={() => setActiveSetupTab("departments")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${activeSetupTab === "departments" ? "bg-brand-900 text-white shadow-sm" : "bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 text-surface-700 dark:text-zinc-300 hover:bg-surface-50 dark:hover:bg-zinc-800"}`}
                >
                  Department Management
                </button>
                <button
                  onClick={() => setActiveSetupTab("categories")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${activeSetupTab === "categories" ? "bg-brand-900 text-white shadow-sm" : "bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 text-surface-700 dark:text-zinc-300 hover:bg-surface-50 dark:hover:bg-zinc-800"}`}
                >
                  Asset Category Management
                </button>
                <button
                  onClick={() => setActiveSetupTab("employees")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${activeSetupTab === "employees" ? "bg-brand-900 text-white shadow-sm" : "bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 text-surface-700 dark:text-zinc-300 hover:bg-surface-50 dark:hover:bg-zinc-800"}`}
                >
                  Employee Directory
                </button>
              </div>

              {/* SUB-VIEW 1: DEPARTMENT MANAGEMENT */}
              {activeSetupTab === "departments" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Table Panel */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider">Active Departments</h3>
                      <button
                        onClick={handleOpenCreateDept}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer transition shadow"
                      >
                        Create Department
                      </button>
                    </div>

                    {departments.length === 0 ? (
                      <div className="p-12 border border-dashed border-surface-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-center space-y-4">
                        <Building2 className="w-12 h-12 text-surface-300 mx-auto" />
                        <h4 className="font-bold text-surface-900 dark:text-white uppercase">No departments created yet.</h4>
                        <button
                          onClick={handleOpenCreateDept}
                          className="px-4 py-2 rounded-lg bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 cursor-pointer"
                        >
                          Create Department
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-surface-50 dark:bg-zinc-950 border-b border-surface-200 dark:border-zinc-850 text-surface-700 dark:text-zinc-400 font-bold uppercase tracking-wider">
                              <th className="p-3">Department Name</th>
                              <th className="p-3">Department Head</th>
                              <th className="p-3">Parent Dept</th>
                              <th className="p-3">Employees</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-150 dark:divide-zinc-800 font-semibold text-surface-850 dark:text-zinc-200">
                            {departments.map((dept, idx) => (
                              <tr key={idx} className="hover:bg-surface-50/50 dark:hover:bg-zinc-900/50">
                                <td className="p-3">{dept.name}</td>
                                <td className="p-3 text-surface-600 dark:text-zinc-400">{dept.head}</td>
                                <td className="p-3 text-surface-600 dark:text-zinc-400">{dept.parent}</td>
                                <td className="p-3 text-center">{dept.employeesCount}</td>
                                <td className="p-3">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    dept.status === "Active" 
                                      ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" 
                                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                                  }`}>
                                    {dept.status}
                                  </span>
                                </td>
                                <td className="p-3 flex justify-center gap-2">
                                  <button
                                    onClick={() => setViewEntityData({
                                      title: `${dept.name} Department`,
                                      fields: {
                                        "Head of Department": dept.head,
                                        "Parent Node": dept.parent,
                                        "Active Employee Count": dept.employeesCount,
                                        "Status Config": dept.status,
                                        "Created At": dept.createdDate,
                                        "Description Notes": dept.description || "No description logged"
                                      }
                                    })}
                                    className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-brand-900 dark:hover:border-brand-500 rounded bg-white dark:bg-zinc-900 text-surface-500 dark:text-zinc-400 hover:text-brand-900 dark:hover:text-brand-400 cursor-pointer"
                                    title="View"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditDept(dept)}
                                    className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-brand-900 dark:hover:border-brand-500 rounded bg-white dark:bg-zinc-900 text-surface-500 dark:text-zinc-400 hover:text-brand-900 dark:hover:text-brand-400 cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleDeptStatus(dept.name)}
                                    className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-red-500 rounded bg-white dark:bg-zinc-900 text-surface-500 dark:text-zinc-400 hover:text-red-655 cursor-pointer"
                                    title={dept.status === "Active" ? "Deactivate" : "Activate"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Right Hierarchy Visualizer Card */}
                  <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-surface-650 dark:text-zinc-400 uppercase tracking-wider border-b border-surface-150 dark:border-zinc-800 pb-2">Organizational tree</h3>
                    
                    {/* Tree list simulated */}
                    <div className="space-y-4 text-xs font-semibold text-surface-800 dark:text-zinc-200 font-sans">
                      <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800">
                        🏢 Company Root
                      </div>

                      {/* Tree branches */}
                      <div className="ml-4 space-y-4">
                        <div className="border-l-2 border-brand-900/20 pl-4 py-1 space-y-3">
                          {/* Level 1 Department: Engineering */}
                          <div className="relative">
                            <span className="absolute -left-[17px] top-2.5 w-3 h-0.5 bg-brand-900/20" />
                            <div className="p-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                              <span className="font-bold text-surface-900 dark:text-white">Engineering</span>
                              <span className="text-[10px] text-surface-500 font-mono">Head: Aditi Rao</span>
                            </div>
                          </div>

                          {/* Sub-level Backend & Frontend under Engineering */}
                          <div className="ml-6 border-l-2 border-brand-900/20 pl-4 space-y-3">
                            <div className="relative">
                              <span className="absolute -left-[17px] top-2.5 w-3 h-0.5 bg-brand-900/20" />
                              <div className="p-2 rounded-md bg-surface-50 dark:bg-zinc-950 text-surface-650 dark:text-zinc-400 border border-surface-200 dark:border-zinc-850 flex justify-between items-center">
                                <span>Backend</span>
                                <span className="text-[9px] text-surface-450">Arjun Nair</span>
                              </div>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[17px] top-2.5 w-3 h-0.5 bg-brand-900/20" />
                              <div className="p-2 rounded-md bg-surface-50 dark:bg-zinc-950 text-surface-650 dark:text-zinc-400 border border-surface-200 dark:border-zinc-850 flex justify-between items-center">
                                <span>Frontend</span>
                                <span className="text-[9px] text-surface-450">Priya Shah</span>
                              </div>
                            </div>
                          </div>

                          {/* Level 1: Facilities */}
                          <div className="relative">
                            <span className="absolute -left-[17px] top-2.5 w-3 h-0.5 bg-brand-900/20" />
                            <div className="p-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                              <span className="font-bold text-surface-900 dark:text-white">Facilities</span>
                              <span className="text-[10px] text-surface-500 font-mono">Head: Rohan Mehta</span>
                            </div>
                          </div>

                          {/* Level 1: HR */}
                          <div className="relative">
                            <span className="absolute -left-[17px] top-2.5 w-3 h-0.5 bg-brand-900/20" />
                            <div className="p-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                              <span className="font-bold text-surface-900 dark:text-white">HR</span>
                              <span className="text-[10px] text-surface-500 font-mono">Head: Neha Gupta</span>
                            </div>
                          </div>

                          {/* Level 1: Finance */}
                          <div className="relative">
                            <span className="absolute -left-[17px] top-2.5 w-3 h-0.5 bg-brand-900/20" />
                            <div className="p-2.5 rounded-lg border border-surface-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                              <span className="font-bold text-surface-900 dark:text-white">Finance</span>
                              <span className="text-[10px] text-surface-500 font-mono">Head: Vikram Malhotra</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: ASSET CATEGORY MANAGEMENT */}
              {activeSetupTab === "categories" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider">Asset Categories</h3>
                    <button
                      onClick={handleOpenCreateCategory}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-900 hover:bg-brand-800 text-white cursor-pointer transition shadow"
                    >
                      New Category
                    </button>
                  </div>

                  {categories.length === 0 ? (
                    <div className="p-12 border border-dashed border-surface-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-center space-y-4 animate-float">
                      <Layers className="w-12 h-12 text-surface-300 mx-auto" />
                      <h4 className="font-bold text-surface-900 dark:text-white uppercase">No categories created yet.</h4>
                      <button
                        onClick={handleOpenCreateCategory}
                        className="px-4 py-2 rounded-lg bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 cursor-pointer"
                      >
                        New Category
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((cat, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow transition-all space-y-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-300 flex items-center justify-center font-bold">
                              <Laptop className="w-5 h-5" />
                            </div>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cat.status === "Active" 
                                ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" 
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                            }`}>
                              {cat.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-bold text-surface-900 dark:text-white text-sm">{cat.name}</h4>
                            <p className="text-xs text-surface-550 dark:text-zinc-400 leading-relaxed h-12 overflow-hidden">{cat.description}</p>
                          </div>

                          <div className="pt-2 border-t border-surface-150 dark:border-zinc-800 flex justify-between items-center text-xs">
                            <span className="font-bold text-surface-700 dark:text-zinc-300">
                              Assets Count: <span className="text-brand-900 dark:text-brand-400 font-extrabold">{cat.assetsCount}</span>
                            </span>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenEditCategory(cat)}
                                className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-brand-900 rounded bg-white dark:bg-zinc-900 text-surface-550 dark:text-zinc-400 hover:text-brand-900 cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 3: EMPLOYEE DIRECTORY */}
              {activeSetupTab === "employees" && (
                <div className="space-y-4">
                  {/* Title and stats bar */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider">Employee Directory</h3>
                    <span className="text-xs font-bold text-surface-550 dark:text-zinc-400 uppercase tracking-wider">Total Matches: {filteredEmployees.length}</span>
                  </div>

                  {/* Filters Bar */}
                  <div className="flex flex-wrap gap-4 bg-white/60 dark:bg-zinc-900/60 p-4 border border-surface-200 dark:border-zinc-800 rounded-xl shadow-sm">
                    {/* Search Field */}
                    <div className="flex-grow min-w-[240px] relative">
                      <Search className="w-4 h-4 text-surface-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by Name, Email, or ID..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-850 rounded-lg h-9 pl-9 pr-4 text-xs font-semibold focus:border-brand-900 dark:focus:border-brand-500 outline-none text-surface-900 dark:text-zinc-100"
                      />
                    </div>

                    {/* Department Filter */}
                    <select
                      value={filterDept}
                      onChange={e => setFilterDept(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-surface-300 dark:border-zinc-800 rounded-lg px-3 h-9 text-xs font-bold focus:border-brand-900 outline-none text-surface-700 dark:text-zinc-300"
                    >
                      <option value="All">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Facilities">Facilities</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                    </select>

                    {/* Role Filter */}
                    <select
                      value={filterRole}
                      onChange={e => setFilterRole(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-surface-300 dark:border-zinc-800 rounded-lg px-3 h-9 text-xs font-bold focus:border-brand-900 outline-none text-surface-700 dark:text-zinc-300"
                    >
                      <option value="All">All Roles</option>
                      <option value="Employee">Employee</option>
                      <option value="Department Head">Department Head</option>
                      <option value="Asset Manager">Asset Manager</option>
                      <option value="Administrator">Administrator</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-surface-300 dark:border-zinc-800 rounded-lg px-3 h-9 text-xs font-bold focus:border-brand-900 outline-none text-surface-700 dark:text-zinc-300"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Employees Directory Table */}
                  <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface-50 dark:bg-zinc-950 border-b border-surface-200 dark:border-zinc-850 text-surface-700 dark:text-zinc-400 font-bold uppercase tracking-wider">
                          <th className="p-3">Avatar</th>
                          <th className="p-3">Employee Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Current Role</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Last Login</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-150 dark:divide-zinc-800 font-semibold text-surface-850 dark:text-zinc-200">
                        {filteredEmployees.map((emp, idx) => (
                          <tr key={idx} className="hover:bg-surface-50/50 dark:hover:bg-zinc-900/50">
                            <td className="p-3">
                              <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full bg-surface-100 dark:bg-zinc-800 border border-surface-200 dark:border-zinc-700" />
                            </td>
                            <td className="p-3">{emp.name}</td>
                            <td className="p-3 text-surface-600 dark:text-zinc-400 font-mono text-[10px]">{emp.email}</td>
                            <td className="p-3 text-surface-600 dark:text-zinc-400">{emp.department}</td>
                            <td className="p-3">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                                emp.role === "Employee" ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200" :
                                emp.role === "Department Head" ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200" :
                                emp.role === "Asset Manager" ? "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200" :
                                "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200"
                              }`}>
                                {emp.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                emp.status === "Active" 
                                  ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200" 
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200"
                              }`}>
                                {emp.status}
                              </span>
                            </td>
                            <td className="p-3 text-surface-550 dark:text-zinc-500 font-mono text-[10px]">{emp.lastLogin}</td>
                            <td className="p-3 flex justify-center gap-2">
                              <button
                                onClick={() => setViewEntityData({
                                  title: `${emp.name} Profile`,
                                  fields: {
                                    "Employee ID": emp.id,
                                    "User Name": emp.name,
                                    "System Email": emp.email,
                                    "Department Unit": emp.department,
                                    "RBAC Role Privilege": emp.role,
                                    "System Status": emp.status,
                                    "Last Activity": emp.lastLogin
                                  }
                                })}
                                className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-brand-900 rounded bg-white dark:bg-zinc-900 text-surface-550 dark:text-zinc-400 hover:text-brand-900 cursor-pointer"
                                title="View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenAssignRole(emp)}
                                className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-brand-900 rounded bg-white dark:bg-zinc-900 text-surface-550 dark:text-zinc-400 hover:text-brand-900 cursor-pointer"
                                title="Assign Role"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-brand-900 dark:text-brand-500" />
                              </button>
                              <button
                                onClick={() => handleToggleEmployeeStatus(emp.id)}
                                className="p-1 border border-surface-200 dark:border-zinc-800 hover:border-red-500 rounded bg-white dark:bg-zinc-900 text-surface-550 dark:text-zinc-400 hover:text-red-655 cursor-pointer"
                                title={emp.status === "Active" ? "Deactivate" : "Activate"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAL: CREATE / EDIT DEPARTMENT ──────────────────────────────── */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider font-sans">
                {deptModalMode === "create" ? "Create Department" : "Edit Department"}
              </h3>
              <button onClick={() => setShowDeptModal(false)} className="text-surface-400 hover:text-surface-700 dark:hover:text-white font-bold cursor-pointer">✕</button>
            </div>
            
            {deptFormError && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs font-semibold">
                {deptFormError}
              </div>
            )}

            <form onSubmit={handleSaveDepartment} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider flex justify-between">
                  <span>Department Name <span className="text-red-500">*</span></span>
                  <span className="font-mono text-[9px] font-normal lowercase text-surface-400">{formDeptName.length} / 40 chars</span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g. Finance, Backend"
                  value={formDeptName}
                  onChange={e => setFormDeptName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg h-10 px-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold"
                  required
                />
              </div>

              {/* Head */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Department Head</label>
                <select
                  value={formDeptHead}
                  onChange={e => setFormDeptHead(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg h-10 px-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              {/* Parent */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Parent Department</label>
                <select
                  value={formDeptParent}
                  onChange={e => setFormDeptParent(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg h-10 px-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold"
                >
                  <option value="--">-- (No Parent Node)</option>
                  {departments
                    .filter(d => d.name !== formDeptName)
                    .map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                </select>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between py-2 border-y border-surface-100 dark:border-zinc-850">
                <span className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Status Active</span>
                <button
                  type="button"
                  onClick={() => setFormDeptStatus(!formDeptStatus)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none ${formDeptStatus ? "bg-brand-900" : "bg-surface-300 dark:bg-zinc-800"}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formDeptStatus ? "left-5" : "left-1"}`} />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  maxLength={150}
                  placeholder="Summarize the core roles of this node..."
                  value={formDeptDesc}
                  onChange={e => setFormDeptDesc(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg p-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="flex-grow bg-white dark:bg-zinc-900 hover:bg-surface-50 dark:hover:bg-zinc-800 border border-surface-300 dark:border-zinc-800 text-surface-700 dark:text-zinc-300 rounded-lg h-10 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? "Saving..." : "Save Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE / EDIT CATEGORY WITH DYNAMIC FIELDS ───────────── */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl text-surface-900 dark:text-zinc-100 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider font-sans">
                {catModalMode === "create" ? "New Asset Category" : "Edit Asset Category"}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-surface-400 hover:text-surface-700 dark:hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            {catFormError && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs font-semibold">
                {catFormError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Networking, Networking Equipment"
                  value={formCatName}
                  onChange={e => setFormCatName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg h-10 px-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={2}
                  maxLength={120}
                  placeholder="Summarize the categories items..."
                  value={formCatDesc}
                  onChange={e => setFormCatDesc(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg p-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold resize-none"
                />
              </div>

              {/* Icon select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Category Icon</label>
                <select
                  value={formCatIcon}
                  onChange={e => setFormCatIcon(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg h-10 px-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold"
                >
                  <option value="Laptop">Laptop Icon</option>
                  <option value="Armchair">Armchair Icon</option>
                  <option value="Car">Car Icon</option>
                  <option value="Network">Network Icon</option>
                  <option value="Cable">Cable Icon</option>
                  <option value="Printer">Printer Icon</option>
                </select>
              </div>

              {/* Status active */}
              <div className="flex items-center justify-between py-2 border-y border-surface-100 dark:border-zinc-850">
                <span className="text-[10px] font-bold text-surface-600 dark:text-zinc-400 uppercase tracking-wider">Status Active</span>
                <button
                  type="button"
                  onClick={() => setFormCatStatus(!formCatStatus)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none ${formCatStatus ? "bg-brand-900" : "bg-surface-300 dark:bg-zinc-800"}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formCatStatus ? "left-5" : "left-1"}`} />
                </button>
              </div>

              {/* DYNAMIC SPECIFIC FIELDS BUILDER */}
              <div className="space-y-3 pt-2 border-t border-surface-200 dark:border-zinc-850">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900 dark:text-white">Dynamic Asset Fields</h4>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-3 py-1 border border-brand-900 text-brand-900 dark:text-brand-400 rounded hover:bg-brand-50 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Custom Field
                  </button>
                </div>

                {customFields.length === 0 ? (
                  <p className="text-[11px] text-surface-500 font-semibold">No custom fields added yet. Assets will use global defaults.</p>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {customFields.map((field, index) => (
                      <div key={index} className="flex gap-2 items-center p-2 bg-surface-50 dark:bg-zinc-950 border border-surface-200 dark:border-zinc-850 rounded-lg">
                        {/* Name */}
                        <div className="flex-grow">
                          <input
                            type="text"
                            value={field.name}
                            onChange={e => handleFieldChange(index, "name", e.target.value)}
                            placeholder="Field Name"
                            className="w-full bg-white dark:bg-zinc-900 border border-surface-300 dark:border-zinc-800 rounded px-2 py-1 text-[11px] font-semibold text-surface-900 dark:text-zinc-100"
                          />
                        </div>

                        {/* Type selection */}
                        <div>
                          <select
                            value={field.type}
                            onChange={e => handleFieldChange(index, "type", e.target.value as any)}
                            className="bg-white dark:bg-zinc-900 border border-surface-300 dark:border-zinc-800 rounded px-1.5 py-1 text-[11px] font-bold text-surface-700 dark:text-zinc-300"
                          >
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Date">Date</option>
                            <option value="Dropdown">Dropdown</option>
                          </select>
                        </div>

                        {/* Required toggle checkbox */}
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={e => handleFieldChange(index, "required", e.target.checked)}
                            className="w-3.5 h-3.5 cursor-pointer accent-brand-900"
                            id={`req_${index}`}
                          />
                          <label htmlFor={`req_${index}`} className="text-[10px] font-extrabold text-surface-550 dark:text-zinc-500 uppercase select-none cursor-pointer">Req</label>
                        </div>

                        {/* Delete Field */}
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-grow bg-white dark:bg-zinc-900 hover:bg-surface-50 dark:hover:bg-zinc-800 border border-surface-300 dark:border-zinc-800 text-surface-700 dark:text-zinc-300 rounded-lg h-10 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-60 flex items-center justify-center"
                >
                  {isLoading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ASSIGN ROLE ───────────────────────────────────────────── */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider font-sans">
                Assign System Role
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="text-surface-400 hover:text-surface-700 dark:hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <div className="text-xs font-semibold text-surface-600 dark:text-zinc-400">
              Roles can only be assigned from the Employee Directory.
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              {/* Employee name details read-only */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-650 dark:text-zinc-400 uppercase tracking-wider">Employee Name</label>
                <input
                  type="text"
                  value={selectedEmpName}
                  disabled
                  className="w-full bg-surface-50 dark:bg-zinc-950 border border-surface-300 dark:border-zinc-850 rounded-lg h-10 px-3 text-xs text-surface-500 font-semibold outline-none cursor-not-allowed"
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-surface-650 dark:text-zinc-400 uppercase tracking-wider">Role Privilege</label>
                <select
                  value={formEmpRole}
                  onChange={e => setFormEmpRole(e.target.value as any)}
                  className="w-full bg-white dark:bg-zinc-950 border border-surface-300 dark:border-zinc-800 rounded-lg h-10 px-3 text-xs focus:border-brand-900 outline-none text-surface-900 dark:text-zinc-100 font-semibold"
                >
                  <option value="Employee">Employee</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Asset Manager">Asset Manager</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              {/* Warnings display */}
              {roleWarningVisible && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-250 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-semibold tracking-wide flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <div className="font-bold">Security Warning:</div>
                    <div className="font-normal mt-0.5 leading-relaxed">Changing roles immediately updates user permissions. Are you sure you want to promote/demote <strong>{selectedEmpName}</strong> to <strong>{formEmpRole}</strong>?</div>
                  </div>
                </div>
              )}

              {/* Submit actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="flex-grow bg-white dark:bg-zinc-900 hover:bg-surface-50 dark:hover:bg-zinc-800 border border-surface-300 dark:border-zinc-800 text-surface-700 dark:text-zinc-300 rounded-lg h-10 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-10 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? "Saving..." : roleWarningVisible ? "Confirm Assign Role" : "Assign Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: VIEW ENTITY PROFILE DETAILS ────────────────────────────── */}
      {viewEntityData && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl text-surface-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-surface-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider font-sans">
                {viewEntityData.title} Details
              </h3>
              <button onClick={() => setViewEntityData(null)} className="text-surface-400 hover:text-surface-700 dark:hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(viewEntityData.fields).map(([label, val]) => (
                <div key={label} className="grid grid-cols-3 py-1.5 border-b border-surface-100 dark:border-zinc-850 text-xs font-semibold">
                  <span className="text-surface-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">{label}</span>
                  <span className="col-span-2 text-surface-900 dark:text-zinc-100 pl-4">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setViewEntityData(null)}
                className="w-full bg-brand-900 hover:bg-brand-800 text-white rounded-lg h-9 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
