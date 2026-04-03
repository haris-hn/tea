import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Settings, 
  ArrowLeft 
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Users", path: "/admin/users", icon: Users, superOnly: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b border-gray-100 flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase">Admin Panel</span>
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-all duration-200 group ${
                location.pathname === item.path
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <item.icon className={`w-4 h-4 ${location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-black"}`} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-100">
          <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Public Site</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <header className="bg-white border-b border-gray-200 px-12 py-6 flex justify-between items-center">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">
            {menuItems.find(m => m.path === location.pathname)?.name || "System"}
          </h2>
        </header>
        <main className="p-12 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
