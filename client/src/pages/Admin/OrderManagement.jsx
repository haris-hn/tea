import { useState, useEffect } from "react";
import api from "../../utils/api";
import { ShoppingBag, Clock, Truck, CheckCircle, XCircle, ChevronDown, User, Package } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-orange-500 bg-orange-50";
      case "processing": return "text-blue-500 bg-blue-50";
      case "shipped": return "text-indigo-500 bg-indigo-50";
      case "delivered": return "text-emerald-500 bg-emerald-50";
      case "cancelled": return "text-red-500 bg-red-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-3 h-3" />;
      case "processing": return <Package className="w-3 h-3" />;
      case "shipped": return <Truck className="w-3 h-3" />;
      case "delivered": return <CheckCircle className="w-3 h-3" />;
      case "cancelled": return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  if (loading) return <div className="p-12 text-center text-xs font-bold tracking-widest uppercase text-gray-400">Loading Orders...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Order Management</h2>
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">
          Fulfillment & Logistics Tracker
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white p-20 text-center border border-gray-100 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="text-xs font-bold text-gray-300 tracking-widest uppercase">No orders placed yet</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group hover:border-black transition-colors duration-300">
              {/* Order Header */}
              <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-xs font-bold text-gray-900 tracking-tighter">#{order._id.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Placed On</p>
                    <p className="text-xs font-bold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                  
                  <div className="relative group/select">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className="text-[10px] font-bold uppercase tracking-widest border border-gray-200 bg-white focus:border-black focus:ring-0 px-4 py-1.5 cursor-pointer appearance-none pr-8"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* User Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2">Customer</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center border border-gray-100">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.user?.name}</p>
                      <p className="text-[10px] font-medium text-gray-400">{order.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2 flex justify-between">
                    <span>Order Items</span>
                    <span className="text-emerald-600">Total: €{order.totalAmount.toFixed(2)}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-4 bg-gray-50/50 p-3 border border-gray-50">
                        <div className="w-12 h-12 bg-white flex items-center justify-center border border-gray-100 relative group overflow-hidden">
                           <ShoppingBag className="w-5 h-5 text-gray-200" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest truncate">{item.variant?.sku || "Product Detail"}</p>
                          <p className="text-[11px] font-medium text-gray-400">Qty: {item.quantity} × €{item.priceAtPurchase.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">€{(item.quantity * item.priceAtPurchase).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
