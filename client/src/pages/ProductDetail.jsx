import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { Globe, Leaf, Wind, Minus, Plus, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Fetch related products
        const relatedRes = await api.get(`/products?category=${data.category}&limit=5`);
        setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddingToCart(true);
    await addToCart(selectedVariant._id, quantity);
    setAddingToCart(false);
  };

  if (loading) return <div className="p-24 text-center font-bold tracking-widest uppercase text-gray-400 font-outfit">Loading Tea Details...</div>;
  if (error || !product) return <div className="p-24 text-center text-red-500 font-bold uppercase font-outfit">{error || "Product Not Found"}</div>;

  return (
    <div className="bg-white font-outfit">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-12">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/collections" className="hover:text-black transition-colors">Collections</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">{product.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Image Section */}
        <div className="bg-gray-50 aspect-square overflow-hidden border border-gray-100 shadow-sm">
          <img 
            src={product.images?.[0] || "https://images.unsplash.com/photo-1594631252845-29fc45865157?q=80&w=1000&auto=format&fit=crop"} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-small tracking-tight text-gray-900 leading-[1.1] mb-6">
              {product.name}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
              {product.description}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 border-y border-gray-100 py-6">
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-black" />
              <span>Origin: {product.origin}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Leaf className="w-4 h-4 text-black" />
              <span>Organic</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wind className="w-4 h-4 text-gray-400" />
              <span>Vegan</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold tracking-tight text-gray-900">
            €{selectedVariant?.price.toFixed(2)}
          </div>

          {/* Variants */}
          <div className="space-y-4 font-outfit">
            <h3 className="text-sm font-medium text-gray-800">Variants</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const sizeText = v.sizeOrWeight.toLowerCase();
                let iconType = 'bag';
                if (sizeText.includes('170') || sizeText.includes('tin')) iconType = 'tin';
                else if (sizeText.includes('sampler')) iconType = 'sampler';

                let innerText = "";
                if (iconType !== 'sampler') {
                  if (sizeText.includes('kg')) {
                    const match = sizeText.match(/(\d+)\s*kg/i);
                    innerText = match ? `${match[1]} kg` : "1 kg";
                  } else {
                    innerText = sizeText.match(/\d+/)?.[0] || "";
                  }
                }

                const isSelected = selectedVariant?._id === v._id;

                return (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col items-center justify-center py-4 px-2 min-w-[80px] border transition-all ${
                      isSelected 
                        ? "border-[#C9A86A] bg-white ring-0" 
                        : "border-transparent hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className="relative mb-3 flex items-center justify-center text-[#555] w-12 h-14">
                      {iconType === 'bag' && (
                        <svg width="40" height="46" viewBox="0 0 40 46" fill="none" stroke="currentColor" strokeWidth="1" className="absolute">
                          {/* Inner Bag Body */}
                          <path d="M12 8 L28 8 L30 14 L30 38 L10 38 L10 14 Z" />
                          {/* Left Pleat */}
                          <path d="M10 14 C6 20 6 30 10 38" />
                          {/* Right Pleat */}
                          <path d="M30 14 C34 20 34 30 30 38" />
                          {/* Seal */}
                          <line x1="12" y1="12" x2="28" y2="12" />
                        </svg>
                      )}
                      {iconType === 'tin' && (
                        <svg width="40" height="46" viewBox="0 0 40 46" fill="none" stroke="currentColor" strokeWidth="1" className="absolute">
                          <ellipse cx="20" cy="12" rx="12" ry="4" />
                          <ellipse cx="20" cy="15" rx="12" ry="4" />
                          <line x1="8" y1="15" x2="8" y2="36" />
                          <line x1="32" y1="15" x2="32" y2="36" />
                          <path d="M8 36 A 12 4 0 0 0 32 36" />
                        </svg>
                      )}
                      {iconType === 'sampler' && (
                        <svg width="40" height="46" viewBox="0 0 40 46" fill="none" stroke="currentColor" strokeWidth="1" className="absolute">
                          <path d="M12 20 L16 12 L24 12 L28 20 L28 38 L12 38 Z" />
                          <path d="M20 12 C20 6 12 4 6 10 C3 13 4 17 6 18" />
                          <line x1="12" y1="18" x2="28" y2="18" />
                        </svg>
                      )}
                      
                      <span className="relative text-[8px] font-medium text-gray-600 mt-5">
                        {innerText}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-700 capitalize font-medium tracking-wide">
                      {v.sizeOrWeight.replace(' bag', '')} bag
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-6 pt-6">
            <div className="flex items-center border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-12 text-center text-sm font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className={`flex-grow bg-black text-white hover:bg-gray-800 py-4 px-8 flex items-center justify-center space-x-3 transition-all transform active:scale-[0.98] ${addingToCart ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
                {addingToCart ? "Adding..." : "Add to Bag"}
              </span>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* NEW SECTION: Steeping & About */}
      <div className="bg-[#f5f5f5] py-20 border-y border-gray-100 font-outfit">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Column: Steeping instructions */}
          <div className="space-y-8">
            <h2 className="text-3xl tracking-wide text-gray-800 font-light mb-8">Steeping instructions</h2>
            <div className="space-y-6">
              
              {/* Serving Size */}
              <div className="flex items-start space-x-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 text-gray-700">
                  {/* Kettle Icon */}
                  <path d="M6 4h8v14H6z M14 6h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2 M4 18h12 M8 2v2 M12 2v2" />
                </svg>
                <div className="flex-grow border-b border-gray-300 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mr-2">Serving Size:</span>
                  <span className="text-[13px] text-gray-600 font-medium">{product.steepingInstructions?.servingSize || "2 tsp per cup, 6 tsp per pot"}</span>
                </div>
              </div>

              {/* Water Temperature */}
              <div className="flex items-start space-x-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 text-gray-700">
                  {/* Water drop with heat */}
                  <path d="M12 22C16.418 22 20 18.418 20 14C20 9 12 2 12 2C12 2 4 9 4 14C4 18.418 7.582 22 12 22Z" />
                  <path d="M12 11v6 M10 14h4" />
                </svg>
                <div className="flex-grow border-b border-gray-300 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mr-2">Water Temperature:</span>
                  <span className="text-[13px] text-gray-600 font-medium">{product.steepingInstructions?.waterTemp || "100°C"}</span>
                </div>
              </div>

              {/* Steeping Time */}
              <div className="flex items-start space-x-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-1 text-gray-700">
                  {/* Stopwatch */}
                  <circle cx="12" cy="13" r="8" />
                  <polyline points="12 9 12 13 15 13" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="9" y1="2" x2="15" y2="2" />
                </svg>
                <div className="flex-grow border-b border-gray-300 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mr-2">Steeping Time:</span>
                  <span className="text-[13px] text-gray-600 font-medium">{product.steepingInstructions?.steepingTime || "3 - 5 minutes"}</span>
                </div>
              </div>

              {/* Color */}
              <div className="flex items-center space-x-4 pt-2">
                <div className="w-5 h-5 rounded-full bg-[#B85858] ml-1"></div>
                <div className="flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Color after 3 minutes</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: About this tea */}
          <div className="space-y-12">
            <h2 className="text-3xl tracking-wide text-gray-800 font-light">About this tea</h2>
            
            {/* Attributes Table */}
            <div className="flex items-start justify-between border-gray-200">
              <div className="flex-1 pr-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-2">Flavor</p>
                <p className="text-[12px] text-gray-500 font-medium capitalize">{product.flavor?.join(", ") || "Spicy"}</p>
              </div>
              <div className="w-px h-10 bg-gray-300 mt-1"></div>
              
              <div className="flex-1 px-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-2">Qualities</p>
                <p className="text-[12px] text-gray-500 font-medium capitalize">{Array.isArray(product.details?.qualities) ? product.details.qualities.join(", ") : (product.details?.qualities || "Soothing")}</p>
              </div>
              <div className="w-px h-10 bg-gray-300 mt-1"></div>
              
              <div className="flex-1 px-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-2">Caffeine</p>
                <p className="text-[12px] text-gray-500 font-medium capitalize">{Array.isArray(product.details?.caffeine) ? product.details.caffeine.join(", ") : (product.details?.caffeine || "Medium")}</p>
              </div>
              <div className="w-px h-10 bg-gray-300 mt-1"></div>
              
              <div className="flex-1 pl-4 text-right md:text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-2">Allergens</p>
                <p className="text-[12px] text-gray-500 font-medium capitalize">{Array.isArray(product.details?.allergens) ? product.details.allergens.join(", ") : (product.details?.allergens || "Nuts-free")}</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="pt-2">
              <h3 className="text-2xl tracking-wide text-gray-800 font-light mb-4">Ingredient</h3>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed max-w-lg">
                {product.details?.ingredients || "Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces."}
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Related Products: YOU MAY ALSO LIKE */}
      <div className="max-w-7xl mx-auto px-8 py-32">
        <h2 className="text-4xl font-bold tracking-tight text-center text-gray-900 mb-20 italic">You may also like</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {relatedProducts.map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className="group flex flex-col items-center text-center">
                <div className="w-full aspect-square bg-gray-50 mb-6 overflow-hidden relative shadow-sm transition-all duration-700 hover:shadow-lg">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold tracking-[0.15em] text-gray-900 uppercase">{p.name}</h3>
                  <p className="text-xs font-bold text-gray-900 tracking-tight mt-3">
                    €{p.variants?.[0]?.price.toFixed(2)} / {p.variants?.[0]?.sizeOrWeight}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-xs font-bold tracking-widest uppercase">Explore more in our Collections</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
