import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
import heroListing from "../assets/Rectangle 2.png";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ categories: [], subCategories: [], origins: [], flavors: [], qualities: [], caffeine: [], allergens: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  const mergeUnique = (defaultArr, backendArr) => {
    const all = [...defaultArr, ...(backendArr || [])];
    const upperSet = new Set(all.map(item => item.toUpperCase().trim()));
    return Array.from(upperSet);
  };
  
  // Get filter values from URL
  const selectedCategories = searchParams.get("category")?.split(",") || [];
  const selectedOrigins = searchParams.get("origin")?.split(",") || [];
  const selectedFlavors = searchParams.get("flavor")?.split(",") || [];
  const selectedQualities = searchParams.get("qualities")?.split(",") || [];
  const selectedCaffeine = searchParams.get("caffeine")?.split(",") || [];
  const selectedAllergens = searchParams.get("allergens")?.split(",") || [];
  const isOrganic = searchParams.get("organic") === "true";

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await api.get("/products/filters");
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/products?${searchParams.toString()}`,
        );
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [searchParams]);

  const toggleFilter = (type, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (type === "organic") {
      if (newParams.get("organic") === "true") {
        newParams.delete("organic");
      } else {
        newParams.set("organic", "true");
      }
      setSearchParams(newParams);
      return;
    }

    let currentValues = newParams.get(type)?.split(",") || [];

    if (currentValues.includes(value)) {
      currentValues = currentValues.filter((v) => v !== value);
    } else {
      currentValues.push(value);
    }

    if (currentValues.length > 0) {
      newParams.set(type, currentValues.join(","));
    } else {
      newParams.delete(type);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={heroListing}
          className="w-full h-full object-cover"
          alt="Collections Hero"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto w-full px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center space-x-2">
        <Link to="/" className="hover:text-black transition-colors">
          HOME
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/collections" className="hover:text-black transition-colors">
          COLLECTIONS
        </Link>
        {selectedCategories.length === 1 && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{selectedCategories[0]}</span>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 flex flex-col md:flex-row gap-16 pb-24">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-4">
          <FilterDropdown 
            label="Collections" 
            options={mergeUnique(["BLACK TEA", "CHAI", "GREEN TEA", "HERBAL TEA", "MATCHA", "OOLONG", "ROOIBOS", "TEAWARE", "WHITE TEA"], filters.categories)} 
            selected={selectedCategories} 
            onToggle={(val) => toggleFilter("category", val)} 
          />
          
          <FilterDropdown 
            label="Origin" 
            options={mergeUnique(["India", "Japan", "Iran", "South Africa"], filters.origins)} 
            selected={selectedOrigins} 
            onToggle={(val) => toggleFilter("origin", val)} 
          />

          <FilterDropdown 
            label="Flavour" 
            options={mergeUnique(["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"], filters.flavors)} 
            selected={selectedFlavors} 
            onToggle={(val) => toggleFilter("flavor", val)} 
          />

          <FilterDropdown 
            label="Qualities" 
            options={mergeUnique(["Detox", "Energy", "Relax", "Digestion"], filters.qualities)} 
            selected={selectedQualities} 
            onToggle={(val) => toggleFilter("qualities", val)} 
          />

          <FilterDropdown 
            label="Caffeine" 
            options={mergeUnique(["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"], filters.caffeine)} 
            selected={selectedCaffeine} 
            onToggle={(val) => toggleFilter("caffeine", val)} 
          />

          <FilterDropdown 
            label="Allergens" 
            options={mergeUnique(["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"], filters.allergens)} 
            selected={selectedAllergens} 
            onToggle={(val) => toggleFilter("allergens", val)} 
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-medium tracking-wide text-gray-800 uppercase">
              ORGANIC
            </span>
            <button 
              onClick={() => toggleFilter("organic", "true")}
              className={`w-9 h-5 rounded-full relative border transition-colors outline-none focus:ring-0 ${isOrganic ? "bg-black border-black" : "bg-white border-gray-400"}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-transform ${isOrganic ? "bg-white left-4" : "bg-black left-[3px]"}`} />
            </button>
          </div>
        </div>

        {/* Product Listing Section */}
        <div className="flex-grow">
          {/* Top Bar */}
          <div className="flex justify-end items-center mb-12">
            <div className="relative group">
              <button className="flex items-center text-[10px] font-bold tracking-[0.2em] text-gray-900 uppercase">
                SORT BY <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-50 aspect-square"></div>
                  <div className="h-3 bg-gray-50 w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-50 w-1/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square bg-[#f9f9f9] mb-6 overflow-hidden relative shadow-sm">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold tracking-[0.15em] text-gray-900 uppercase">
                      {product.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-900 tracking-tight mt-3">
                      {product.variants && product.variants.length > 0 ? (
                        <>
                          €{product.variants[0].price.toFixed(2)} /{" "}
                          {product.variants[0].sizeOrWeight}
                        </>
                      ) : (
                        "Price Unavailable"
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="py-32 text-center">
              <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">
                No products found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, options, selected, onToggle }) => {
  const [isOpen, setIsOpen] = useState(selected.length > 0);

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-end justify-between group outline-none focus:ring-0 pb-3"
      >
        <div className="flex-grow border-b border-gray-300 pb-1 text-left mr-4 flex items-center">
          <span className="text-[11px] font-medium tracking-wide text-gray-800 uppercase">
            {label}
          </span>
          {selected.length > 0 && (
            <span className="text-[#C9A86A] ml-1 text-[11px] font-medium">({selected.length})</span>
          )}
        </div>
        <div className="pb-1 text-gray-800">
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </div>
      </button>
      
      {isOpen && (
        <div className="mb-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200 pl-1">
          {options.map((opt) => (
            <label key={opt} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="w-3.5 h-3.5 border-gray-200 rounded-none checked:bg-black transition-all cursor-pointer accent-black"
              />
              <span className={`ml-3 text-[10px] uppercase font-bold tracking-widest transition-colors ${selected.includes(opt) ? "text-black" : "text-gray-400 group-hover:text-gray-800"}`}>
                {opt}
              </span>
            </label>
          ))}
          {options.length === 0 && <p className="text-[9px] text-gray-400 italic">No {label.toLowerCase()} available</p>}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
