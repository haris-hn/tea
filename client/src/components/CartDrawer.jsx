import { Minus, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartDrawer = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const deliveryCost = 3.95;
  const totalCost = cartTotal + deliveryCost;

  return (
    <>
      <div 
        className="fixed inset-0 z-[90]" 
        onClick={() => setIsDrawerOpen(false)}
      ></div>
      <div className="fixed top-[80px] right-8 w-[90%] md:w-[400px] h-auto max-h-[92vh] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-[100] border border-gray-100 flex flex-col font-outfit animate-in slide-in-from-top-4 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6">
          <h2 className="text-xl text-gray-700 tracking-wide font-light">My Bag</h2>
        </div>

        {/* Items List */}
        <div className="flex-grow overflow-y-auto px-8 pb-8 scrollbar-hide">
          {!cart || cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <p className="text-sm font-medium text-gray-500">Your bag is empty.</p>
              <Link 
                to="/collections" 
                onClick={() => setIsDrawerOpen(false)}
                className="px-8 py-3 bg-black text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-all"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex space-x-6">
                  <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                     <img 
                      src={item.variant.product?.images?.[0] || item.variant.product?.image || "https://images.unsplash.com/photo-1594631252845-29fc45865157?q=80&w=1000"} 
                      alt={item.variant.product?.name}
                      className="w-full h-full object-cover"
                     />
                  </div>

                  <div className="flex-grow flex justify-between items-start pt-1">
                    <div className="pr-4 max-w-[60%]">
                      <h3 className="text-[11px] text-gray-800 font-medium leading-relaxed">
                        {item.variant.product?.name} - {item.variant.sizeOrWeight}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.variant._id)}
                        className="text-[9px] font-bold text-gray-400 hover:text-black uppercase tracking-widest mt-3"
                      >
                        REMOVE
                      </button>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item.variant._id, Math.max(1, item.quantity - 1))}
                          className="text-gray-400 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variant._id, item.quantity + 1)}
                          className="text-gray-400 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-gray-900">
                        €{(item.variant.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-8 pb-10 space-y-6 bg-white">
            <div className="border-t border-gray-200 w-full mb-6"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                <span>Delivery</span>
                <span>€{deliveryCost.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 w-full my-6"></div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-gray-800">Total</span>
              <span className="text-lg font-bold text-gray-900">€{totalCost.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => {
                 setIsDrawerOpen(false);
                 navigate('/checkout');
              }}
              className="w-full bg-[#2a2a2a] text-white py-4 flex items-center justify-center hover:bg-black transition-all"
            >
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase">PURCHASE</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
