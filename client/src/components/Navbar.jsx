import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, Leaf, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, toggleDrawer } = useCart();

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-2">
        <Leaf className="w-6 h-6 text-black" />
        <Link to="/" className="text-xl font-bold tracking-tight">
          Chaye
        </Link>
      </div>

      <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-500">
        <Link to="/collections" className="hover:text-black transition-colors">
          TEA COLLECTIONS
        </Link>
        <Link to="#" className="hover:text-black transition-colors">
          ACCESSORIES
        </Link>
        <Link to="#" className="hover:text-black transition-colors">
          BLOG
        </Link>
        <Link to="#" className="hover:text-black transition-colors">
          CONTACT US
        </Link>
        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <Link to="/admin" className="text-black font-bold border-b-2 border-black pb-1 hover:text-gray-600 transition-colors">
            ADMIN
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-6 text-gray-700">
        <button>
          <Search className="w-5 h-5 hover:text-black transition-colors" />
        </button>

        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/orders" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              MY ORDERS
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b-2 border-black pb-1">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="hover:text-black transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/Signup">
            <User className="w-5 h-5 hover:text-black transition-colors" />
          </Link>
        )}

        <button onClick={toggleDrawer} className="relative group">
          <ShoppingBag className="w-5 h-5 hover:text-black transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white group-hover:scale-110 transition-transform">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
