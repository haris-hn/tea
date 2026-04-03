import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductListing from './pages/ProductListing';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductList from './pages/Admin/ProductList';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';
import UserManagement from './pages/Admin/UserManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <CartDrawer />
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
          <Route path="/login" element={<><Navbar /><main className="flex-grow"><Login /></main><Footer /></>} />
          <Route path="/signup" element={<><Navbar /><main className="flex-grow"><Signup /></main><Footer /></>} />
          <Route path="/collections" element={<><Navbar /><main className="flex-grow"><ProductListing /></main><Footer /></>} />
          <Route path="/product/:id" element={<><Navbar /><main className="flex-grow"><ProductDetail /></main><Footer /></>} />
          <Route path="/checkout" element={<><Navbar /><main className="flex-grow"><Checkout /></main><Footer /></>} />
          <Route path="/order-success/:id" element={<><Navbar /><main className="flex-grow"><OrderSuccess /></main><Footer /></>} />
          <Route path="/orders" element={<><Navbar /><main className="flex-grow"><Orders /></main><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
