import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, ShoppingBag, Package, Truck } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay for an "order processing" feel
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-8 animate-pulse">
        <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-black animate-spin"></div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Finalising your order...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-outfit flex items-center justify-center px-8 py-24">
      <div className="max-w-xl w-full text-center space-y-12">
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-8 mx-auto -translate-y-4 animate-in zoom-in duration-700">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-1.5 text-[8px] font-bold uppercase tracking-widest shadow-xl rotate-12">
            Confirmed
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">Thank you.</h1>
          <p className="text-lg text-gray-500 font-medium tracking-tight">Your order has been placed and is now being prepared with care.</p>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 p-8 space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Reference</span>
            <span className="text-xs font-bold text-gray-900 tracking-tighter">#{id.toUpperCase()}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-3">
              <Package className="w-4 h-4 text-gray-400" />
              <p className="text-[9px] font-bold text-gray-900 uppercase tracking-widest">Preparing</p>
              <div className="h-1 bg-gray-200 w-full rounded-full overflow-hidden">
                 <div className="h-full bg-black w-1/3 transition-all duration-1000"></div>
              </div>
            </div>
            <div className="space-y-3 opacity-40">
              <Truck className="w-4 h-4 text-gray-400" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">In Transit</p>
              <div className="h-1 bg-gray-100 w-full rounded-full"></div>
            </div>
            <div className="space-y-3 opacity-40">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Delivered</p>
              <div className="h-1 bg-gray-100 w-full rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/collections" 
            className="w-full sm:w-auto px-10 py-5 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase flex items-center justify-center space-x-3 group hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to="/" 
            className="w-full sm:w-auto px-10 py-5 border border-gray-100 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-50 transition-all"
          >
            Back to Home
          </Link>
        </div>
        
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">A confirmation email has been sent to your address.</p>
      </div>
    </div>
  );
};

export default OrderSuccess;
