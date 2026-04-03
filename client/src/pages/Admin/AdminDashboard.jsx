import { useState, useEffect } from "react";
import api from "../../utils/api";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/orders/stats");
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: "Total Revenue", value: `€${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-500" },
    { name: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-blue-500" },
    { name: "Active Products", value: stats.totalProducts.toString(), icon: Package, color: "text-orange-500" },
    { name: "Total Customers", value: stats.totalUsers.toString(), icon: Users, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-8 border border-gray-100 shadow-sm rounded-none hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">Metrics</span>
            </div>
            {loading ? (
              <div className="h-8 bg-gray-50 animate-pulse w-24 mb-1"></div>
            ) : (
              <p className="text-2xl font-bold tracking-tight text-gray-900 mb-1">{stat.value}</p>
            )}
            <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{stat.name}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase mb-8 border-b border-gray-50 pb-4">Recent Status</h3>
          <div className="space-y-6 text-center py-10">
            <span className="text-xs font-medium text-gray-400 italic">Real-time charts and order feeds will appear here as orders are placed.</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase mb-8 border-b border-gray-50 pb-4">System Health</h3>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 border-l-4 border-black">
              <p className="text-[11px] font-bold text-black tracking-wide uppercase">Operational</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">Database connection is stable. Product indexing active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
