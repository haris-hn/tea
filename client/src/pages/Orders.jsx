import { useState, useEffect } from "react";
import api from "../utils/api";
import { ShoppingBag, Clock, Package, Truck, CheckCircle, XCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Polling every 30 seconds for live status updates
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

  if (loading) return <div className="p-24 text-center text-[10px] font-bold tracking-widest uppercase text-gray-400 font-outfit">Loading Order History...</div>;

  return (
    <div className="bg-white min-h-screen font-outfit py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Orders</h1>
              <nav className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-2">
                <Link to="/" className="hover:text-black">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black">Order History</span>
              </nav>
            </div>
            <button 
              onClick={() => fetchOrders()}
              className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
            >
              <Clock className="w-3 h-3" />
              <span>Refresh Status</span>
            </button>
          </div>
          <Link to="/collections" className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Shopping</span>
          </Link>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-100 p-4 text-[10px] font-bold text-red-500 uppercase tracking-widest text-center mb-8">
                {error}
            </div>
        )}

        {/* Orders List */}
        <div className="space-y-12">
          {orders.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 p-24 text-center space-y-6">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto" />
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-900">No orders found</p>
                <p className="text-xs text-gray-400 font-medium">You haven't placed any orders yet.</p>
              </div>
              <Link to="/collections" className="px-8 py-3 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                      <p className="text-xs font-bold text-gray-900 tracking-tighter uppercase">{order._id.slice(-8)}</p>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-100 hidden md:block"></div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-xs font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden group-hover:border-black transition-colors duration-500">
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex space-x-4">
                           <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                             <ShoppingBag className="w-5 h-5 text-gray-200" />
                           </div>
                           <div className="min-w-0">
                             <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest truncate">{item.variant?.sku || "Product"}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                             <p className="text-xs font-bold text-gray-900 mt-1">€{item.priceAtPurchase.toFixed(2)}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900 tracking-tight">€{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
