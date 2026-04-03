import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import {
  Minus,
  Plus,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Checkout = () => {
  const {
    cart,
    cartTotal,
    loading: cartLoading,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Bag, 2: Delivery, 3: Payment
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "Germany",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
      });
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 2) {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.address &&
        formData.city &&
        formData.zipCode
      );
    }
    if (step === 3) {
      return (
        formData.cardName &&
        formData.cardNumber &&
        formData.expiry &&
        formData.cvv
      );
    }
    return true;
  };

  const handleNextStep = () => {
    if (canProceed()) {
      setStep(step + 1);
    } else {
      alert("Please fill in all mandatory fields.");
    }
  };

  const deliveryCost = 3.95;
  const total = cartTotal + deliveryCost;

  if (cartLoading)
    return (
      <div className="p-24 text-center text-[10px] font-bold tracking-widest uppercase text-gray-400">
        Loading Checkout...
      </div>
    );
  if (!cart || cart.items.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-8">
        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-900">
          Your bag is empty
        </h2>
        <Link
          to="/collections"
          className="px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all"
        >
          Explore Collections
        </Link>
      </div>
    );

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-8 py-12 md:py-20">
        {/* Step Progress Header */}
        <div className="flex items-center justify-between mb-16 text-[11px] font-medium tracking-widest uppercase text-gray-400">
          <button
            onClick={() => setStep(1)}
            className={`transition-colors ${step === 1 ? "text-gray-800" : "hover:text-gray-600"}`}
          >
            1. MY BAG
          </button>
          <div className="flex-grow mx-6 h-px bg-gray-200"></div>
          <button
            onClick={() => step > 2 && setStep(2)}
            className={`transition-colors ${step === 2 ? "text-gray-800" : step > 2 ? "hover:text-gray-600 text-gray-500" : ""}`}
          >
            2. DELIVERY
          </button>
          <div className="flex-grow mx-6 h-px bg-gray-200"></div>
          <div
            className={`transition-colors ${step === 3 ? "text-gray-800" : ""}`}
          >
            {/* Note: Mockup shows '2.' but logic dictates '3.' */}
            3. REVIEW & PAYMENT
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div
                      key={item.variant._id}
                      className="flex space-x-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            item.variant.product?.images?.[0] ||
                            "https://images.unsplash.com/photo-1594631252845-29fc45865157?q=80&w=1000"
                          }
                          alt={item.variant.product?.name || item.variant.sku}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow flex justify-between items-start pt-1">
                        <div className="pr-4 max-w-[60%]">
                          <h3 className="text-[11px] text-gray-800 font-medium leading-relaxed">
                            {item.variant.product?.name || item.variant.sku} -{" "}
                            {item.variant.sizeOrWeight}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.variant._id)}
                            className="text-[9px] font-bold text-gray-500 hover:text-black uppercase tracking-widest mt-3"
                          >
                            REMOVE
                          </button>
                        </div>

                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.variant._id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="text-gray-400 hover:text-black"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.variant._id,
                                  item.quantity + 1,
                                )
                              }
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

                <div className="border-t border-gray-200"></div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-medium text-gray-700">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    €{cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="pt-8 text-center md:text-left">
                  <Link
                    to="/collections"
                    className="inline-block px-12 py-4 border border-[#2a2a2a] text-[10px] font-bold text-[#2a2a2a] tracking-widest uppercase hover:bg-gray-50 transition-all"
                  >
                    BACK TO SHOPPING
                  </Link>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <input
                      required
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      required
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <input
                      required
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      required
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      required
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                  >
                    Back to Bag
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
                  <div className="p-6 bg-gray-50 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-900 uppercase tracking-widest pb-3 border-b border-gray-200">
                      <span>Shipping Address</span>
                      <button
                        onClick={() => setStep(2)}
                        className="text-gray-400 hover:text-black underline underline-offset-4"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {formData.firstName} {formData.lastName}
                      <br />
                      {formData.address}, {formData.city}
                      <br />
                      {formData.zipCode}, {formData.country}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 border-b border-gray-50 pb-4">
                      <CreditCard className="w-4 h-4 text-gray-900" />
                      <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900">
                        Card Details
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <input
                        required
                        name="cardName"
                        placeholder="Name on Card"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-100 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                      />
                      <input
                        required
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-100 focus:border-black focus:ring-0 text-sm font-medium bg-white font-mono"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          required
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-100 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                        />
                        <input
                          required
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-100 focus:border-black focus:ring-0 text-sm font-medium bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-[#282828] border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                    Secure encrypted checkout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary Box */}
            <div className="bg-[#f5f5f5] p-8 space-y-6">
              <h3 className="text-[13px] font-medium text-gray-800 tracking-wide mb-2">
                Order summery
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Delivery</span>
                  <span>€{deliveryCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 w-full pt-4 mt-2"></div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-semibold text-gray-800">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900">
                  €{total.toFixed(2)}
                </span>
              </div>

              <p className="text-[10px] text-gray-500 font-medium">
                Estimated shipping time: 2 days
              </p>

              <button
                onClick={step < 3 ? handleNextStep : handleSubmitOrder}
                disabled={loading}
                className="w-full bg-[#2a2a2a] text-white py-4 mt-2 text-[11px] font-medium tracking-[0.1em] uppercase hover:bg-black transition-all flex items-center justify-center gap-2 group"
              >
                {loading
                  ? "PROCESSING..."
                  : step === 3
                    ? "PURCHASE"
                    : "CHECK OUT"}
              </button>
            </div>

            {/* Payment Type */}
            <div className="bg-[#f5f5f5] p-8 space-y-6">
              <h3 className="text-[13px] font-medium text-gray-800 tracking-wide">
                Payment type
              </h3>
              <div className="flex flex-wrap justify-between">
                <div className="bg-[#1a1a1a] rounded px-3 py-1 flex items-center justify-center shadow-sm h-8 w-[45px]">
                  <p className="text-[8px] text-white font-bold italic shrink-0">
                    VISA
                  </p>
                </div>
                <div className="bg-[#1a1a1a] rounded px-3 py-1 flex items-center justify-center shadow-sm h-8 w-[45px]">
                  <div className="flex space-x-[-4px]">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-90"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-90"></div>
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded px-3 py-1 flex items-center justify-center shadow-sm h-8 w-[45px]">
                  <div className="flex space-x-[-4px]">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-90"></div>
                    <div className="w-3 h-3 rounded-full bg-[#00a1e0] opacity-90"></div>
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded px-3 py-1 flex items-center justify-center shadow-sm h-8 w-[45px]">
                  <div className="border border-white rounded-l-sm rounded-r-full px-[3px] py-[2px] flex items-center justify-center h-[14px]">
                    <p className="text-[5px] font-bold flex items-center">
                      <span className="text-[#CC0066] leading-none">i</span>
                      <span className="text-white leading-none tracking-tighter ml-[1px]">DEAL</span>
                    </p>
                  </div>
                </div>
                <div className="bg-[#242c36] rounded px-1 py-1 flex items-center justify-center shadow-sm h-8 w-[45px]">
                  <p className="text-[6px] text-white font-medium leading-[1.2] text-center tracking-tight">
                    advance<br/>payment
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery & Retour */}
            <div className="bg-[#f5f5f5] p-8 space-y-6">
              <h3 className="text-[13px] font-medium text-gray-800 tracking-wide">
                Delivery and retour
              </h3>
              <ul className="space-y-4 text-[10px] text-gray-600 font-medium leading-relaxed">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-3 h-3 text-gray-500 mt-[2px] flex-shrink-0" />
                  <span>Order before 12:00 and we will ship the same day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-3 h-3 text-gray-500 mt-[2px] flex-shrink-0" />
                  <span>
                    Orders made after Friday 12:00 are processed on Monday.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-3 h-3 text-gray-500 mt-[2px] flex-shrink-0" />
                  <span>To return your articles, please contact us first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-3 h-3 text-gray-500 mt-[2px] flex-shrink-0" />
                  <span>Postal charges for retour are not reimbursed.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
