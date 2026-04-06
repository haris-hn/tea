import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingFilters, setExistingFilters] = useState({
    categories: [],
    origins: [],
    flavors: [],
  });

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    origin: "",
    flavor: [],
    images: [""],
    steepingInstructions: {
      servingSize: "1-2 tsp per cup",
      waterTemp: "100°C",
      steepingTime: "3-5 minutes",
      color: "Golden"
    },
    details: {
      qualities: [],
      caffeine: [],
      allergens: [],
      ingredients: ""
    },
    organic: false
  });

  const handleNestedChange = (parent, field, value) => {
    setProductData({
      ...productData,
      [parent]: {
        ...productData[parent],
        [field]: value
      }
    });
  };

  const handleDetailToggle = (field, item) => {
    let newItems = Array.isArray(productData.details[field]) ? [...productData.details[field]] : [];
    if (newItems.includes(item)) {
      newItems = newItems.filter((i) => i !== item);
    } else {
      newItems.push(item);
    }
    setProductData({
      ...productData,
      details: { ...productData.details, [field]: newItems }
    });
  };

  const [variants, setVariants] = useState([
    { sku: "", sizeOrWeight: "50 g", price: "", stock: 100 },
  ]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await api.get("/products/filters");
        setExistingFilters(data);
      } catch (err) {
        console.error("Could not fetch existing categories", err);
      }
    };
    fetchFilters();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFlavorToggle = (flav) => {
    let newFlavors = [...productData.flavor];
    if (newFlavors.includes(flav)) {
      newFlavors = newFlavors.filter((f) => f !== flav);
    } else {
      newFlavors.push(flav);
    }
    setProductData({ ...productData, flavor: newFlavors });
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index][name] =
      name === "price" || name === "stock" ? Number(value) : value;
    setVariants(newVariants);
  };

  const addVariantField = () => {
    setVariants([
      ...variants,
      { sku: "", sizeOrWeight: "", price: 0, stock: 0 },
    ]);
  };

  const removeVariantField = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.category || !productData.origin) {
      return setError("Category and Origin are required");
    }

    setLoading(true);
    setError("");

    try {
      const { data: createdProduct } = await api.post("/products", productData);
      for (const variant of variants) {
        await api.post(`/products/${createdProduct._id}/variants`, variant);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/products"
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Add New Product
            </h2>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">
              Creation Wizard
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24"
      >
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-4">
              General Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleProductChange}
                  required
                  className="w-full border-gray-100 focus:border-black focus:ring-0 text-sm font-medium p-3 bg-gray-50/50"
                  placeholder="e.g. Ceylon Ginger Chai"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  required
                  rows="4"
                  className="w-full border-gray-100 focus:border-black focus:ring-0 text-sm font-medium p-3 bg-gray-50/50"
                  placeholder="Tell the story of this tea..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-4">
              Variants & Inventory
            </h3>
            <div className="space-y-6">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50/50 border border-gray-100 relative group"
                >
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariantField(idx)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputField
                      label="SKU"
                      name="sku"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(idx, e)}
                    />
                    <InputField
                      label="Size / Weight"
                      name="sizeOrWeight"
                      value={v.sizeOrWeight}
                      onChange={(e) => handleVariantChange(idx, e)}
                    />
                    <InputField
                      label="Price (€)"
                      name="price"
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, e)}
                    />
                    <InputField
                      label="Stock"
                      name="stock"
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(idx, e)}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariantField}
                className="w-full py-4 border-2 border-dashed border-gray-100 text-[10px] font-bold tracking-widest text-gray-400 uppercase hover:border-black hover:text-black"
              >
                + Add Another Variant
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-4">
              Classification
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Category (Admin Defined)
                </label>
                <input
                  list="categories-list"
                  name="category"
                  value={productData.category}
                  onChange={handleProductChange}
                  placeholder="Type to create or select..."
                  className="w-full border-gray-100 text-xs font-bold p-3 bg-gray-50/50 uppercase tracking-widest"
                />
                <datalist id="categories-list">
                  {existingFilters.categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Sub Category
                </label>
                <input
                  name="subCategory"
                  value={productData.subCategory}
                  onChange={handleProductChange}
                  placeholder="e.g. Loose Leaf"
                  className="w-full border-gray-100 text-xs font-bold p-3 bg-gray-50/50 uppercase tracking-widest"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Origin
                </label>
                <input
                  list="origins-list"
                  name="origin"
                  value={productData.origin}
                  onChange={handleProductChange}
                  placeholder="Country of origin"
                  className="w-full border-gray-100 text-xs font-bold p-3 bg-gray-50/50 uppercase tracking-widest"
                />
                <datalist id="origins-list">
                  {existingFilters.origins.map((o) => (
                    <option key={o} value={o} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Flavor Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Spicy",
                    "Sweet",
                    "Citrus",
                    "Smooth",
                    "Fruity",
                    "Floral",
                    "Grassy",
                    "Minty",
                    "Bitter",
                    "Creamy",
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleFlavorToggle(f)}
                      className={`text-[9px] font-bold tracking-widest uppercase p-2 border transition-all ${
                        productData.flavor.includes(f)
                          ? "bg-black text-white"
                          : "bg-white text-gray-400 border-gray-100"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="organic-checkbox"
                  name="organic"
                  checked={productData.organic}
                  onChange={(e) => setProductData({ ...productData, organic: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                />
                <label htmlFor="organic-checkbox" className="ml-2 block text-[10px] font-bold text-gray-900 tracking-widest uppercase">
                  Certified Organic
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-4">
              Tea Specifications & Steeping
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Steeping Instructions</h4>
                <InputField 
                  label="Serving Size" 
                  value={productData.steepingInstructions.servingSize} 
                  onChange={(e) => handleNestedChange('steepingInstructions', 'servingSize', e.target.value)} 
                />
                <InputField 
                  label="Water Temp" 
                  value={productData.steepingInstructions.waterTemp} 
                  onChange={(e) => handleNestedChange('steepingInstructions', 'waterTemp', e.target.value)} 
                />
                <InputField 
                  label="Steeping Time" 
                  value={productData.steepingInstructions.steepingTime} 
                  onChange={(e) => handleNestedChange('steepingInstructions', 'steepingTime', e.target.value)} 
                />
                <InputField 
                  label="Color" 
                  value={productData.steepingInstructions.color} 
                  onChange={(e) => handleNestedChange('steepingInstructions', 'color', e.target.value)} 
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Qualities</label>
                  <div className="flex flex-wrap gap-2">
                    {["Detox", "Energy", "Relax", "Digestion"].map(q => (
                      <button key={q} type="button" onClick={() => handleDetailToggle('qualities', q)} className={`text-[9px] font-bold tracking-widest uppercase p-2 border transition-all ${(Array.isArray(productData.details.qualities) ? productData.details.qualities : []).includes(q) ? "bg-black text-white" : "bg-white text-gray-400 border-gray-100"}`}>{q}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 mt-4">Caffeine</label>
                  <div className="flex flex-wrap gap-2">
                    {["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"].map(c => (
                      <button key={c} type="button" onClick={() => handleDetailToggle('caffeine', c)} className={`text-[9px] font-bold tracking-widest uppercase p-2 border transition-all ${(Array.isArray(productData.details.caffeine) ? productData.details.caffeine : []).includes(c) ? "bg-black text-white" : "bg-white text-gray-400 border-gray-100"}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 mt-4">Allergens</label>
                  <div className="flex flex-wrap gap-2">
                    {["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"].map(a => (
                      <button key={a} type="button" onClick={() => handleDetailToggle('allergens', a)} className={`text-[9px] font-bold tracking-widest uppercase p-2 border transition-all ${(Array.isArray(productData.details.allergens) ? productData.details.allergens : []).includes(a) ? "bg-black text-white" : "bg-white text-gray-400 border-gray-100"}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 tracking-widest uppercase">Ingredients</label>
                  <textarea 
                    value={productData.details.ingredients} 
                    onChange={(e) => handleNestedChange('details', 'ingredients', e.target.value)}
                    className="w-full border-gray-100 focus:border-black focus:ring-0 text-xs font-bold p-2 bg-white"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase border-b border-gray-50 pb-4">
              Media (Up to 3 Images)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="aspect-square bg-gray-50 border border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden group">
                    {productData.images[idx] ? (
                      <>
                        <img src={productData.images[idx]} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const newImages = [...productData.images];
                            newImages.splice(idx, 1);
                            setProductData({ ...productData, images: newImages });
                          }}
                          className="absolute top-1 right-1 bg-black text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <Plus className="w-5 h-5 text-gray-200" />
                    )}
                  </div>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length + productData.images.filter(img => img !== "").length > 3) {
                      return setError("Maximum 3 images allowed");
                    }
                    
                    const formData = new FormData();
                    files.forEach(file => formData.append('images', file));
                    
                    setLoading(true);
                    try {
                      const { data } = await api.post('/products/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
                      const existingImages = productData.images.filter(img => img !== "");
                      setProductData({ ...productData, images: [...existingImages, ...data.urls].slice(0, 3) });
                    } catch {
                      setError("Failed to upload images");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button type="button" className="w-full py-4 border border-black text-[10px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
                  Upload Images
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 text-xs font-bold tracking-[0.3em] uppercase hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </button>
          {error && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border-gray-100 focus:border-black focus:ring-0 text-xs font-bold p-2 bg-white"
    />
  </div>
);

export default AddProduct;
