import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products?limit=50");
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Product Management</h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">Total: {products.length} Items</p>
        </div>
        <Link 
          to="/admin/products/add" 
          className="bg-black text-white px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 italic bg-gray-50/50">
              <th className="p-6 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Product</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Category</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Attributes</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Variants</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="p-6"><div className="h-4 bg-gray-100 w-32"></div></td>
                  <td className="p-6"><div className="h-4 bg-gray-100 w-24"></div></td>
                  <td className="p-6"><div className="h-4 bg-gray-100 w-32"></div></td>
                  <td className="p-6"><div className="h-4 bg-gray-100 w-16"></div></td>
                  <td className="p-6"></td>
                </tr>
              ))
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 overflow-hidden">
                        <img src={product.images && product.images[0] ? product.images[0] : ""} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">ID: {product._id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase bg-gray-100 px-2 py-1">
                      {product.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {product.flavor && product.flavor.map(f => (
                        <span key={f} className="text-[8px] font-bold tracking-wider text-black bg-gray-200 px-1.5 py-0.5 uppercase">{f}</span>
                      ))}
                      {product.details?.qualities && (
                        <span className="text-[8px] font-bold tracking-wider text-white bg-black px-1.5 py-0.5 uppercase">Q: {product.details.qualities}</span>
                      )}
                      {product.details?.caffeine && (
                        <span className="text-[8px] font-bold tracking-wider text-white bg-blue-900 px-1.5 py-0.5 uppercase">C: {product.details.caffeine}</span>
                      )}
                      {product.organic && (
                        <span className="text-[8px] font-bold tracking-wider text-white bg-green-700 px-1.5 py-0.5 uppercase">ORGANIC</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-[11px] font-medium text-gray-600">
                    {product.variants ? product.variants.length : 0} SKU(s)
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end space-x-4 scale-0 group-hover:scale-100 transition-transform origin-right">
                      <Link to={`/product/${product._id}`} target="_blank" className="text-gray-300 hover:text-black transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link to={`/admin/products/edit/${product._id}`} className="text-gray-300 hover:text-black transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        className="text-gray-300 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
