const Product = require("../models/Product");
const Variant = require("../models/Variant");

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      subCategory,
      origin,
      flavor,
      search,
      sort,
      qualities,
      caffeine,
      allergens,
      organic,
    } = req.query;
    let query = {};

    const toRegexArray = (str) => {
      const arr = Array.isArray(str) ? str : str.split(",");

      return arr.map((i) => {
        const withSpaces = i.replace(/\+/g, " ");
        const decoded = decodeURIComponent(withSpaces);
        return new RegExp(`^${escapeRegex(decoded.trim())}$`, "i");
      });
    };

    if (category) {
      query.category = { $in: toRegexArray(category) };
    }
    if (subCategory) {
      query.subCategory = { $in: toRegexArray(subCategory) };
    }
    if (origin) {
      query.origin = { $in: toRegexArray(origin) };
    }
    if (flavor) {
      query.flavor = { $in: toRegexArray(flavor) };
    }
    if (qualities) {
      query["details.qualities"] = { $in: toRegexArray(qualities) };
    }
    if (caffeine) {
      query["details.caffeine"] = { $in: toRegexArray(caffeine) };
    }
    if (allergens) {
      query["details.allergens"] = { $in: toRegexArray(allergens) };
    }
    if (organic === "true") {
      query.organic = true;
    }
    if (search) query.name = { $regex: search, $options: "i" };

    let sortOptions = { createdAt: -1 };
    if (sort === "priceAsc") sortOptions = { createdAt: 1 }; // Placeholder since sorting by populated field in Mongoose is complex. Standard sort applied here.

    const products = await Product.find(query)
      .populate("variants")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("variants");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();

    // ✅ CREATE DEFAULT VARIANT
    const variant = await Variant.create({
      product: createdProduct._id,
      sizeOrWeight: req.body.sizeOrWeight || "Default",
      price: req.body.price || 10,
      stock: req.body.stock || 10,
    });

    // ✅ LINK VARIANT TO PRODUCT
    createdProduct.variants.push(variant._id);
    await createdProduct.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Variant.deleteMany({ product: product._id });
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addVariant = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const variant = new Variant({ ...req.body, product: product._id });
      await variant.save();

      product.variants.push(variant._id);
      await product.save();

      res.status(201).json(variant);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(
      req.params.variantId,
      req.body,
      { new: true },
    );
    if (variant) {
      res.json(variant);
    } else {
      res.status(404).json({ message: "Variant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.variantId);
    if (variant) {
      const product = await Product.findById(variant.product);
      if (product) {
        product.variants = product.variants.filter(
          (v) => v.toString() !== variant._id.toString(),
        );
        await product.save();
      }
      await variant.deleteOne();
      res.json({ message: "Variant removed" });
    } else {
      res.status(404).json({ message: "Variant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFilters = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const subCategories = await Product.distinct("subCategory");
    const origins = await Product.distinct("origin");
    const flavors = await Product.distinct("flavor");
    const qualities = await Product.distinct("details.qualities");
    const caffeine = await Product.distinct("details.caffeine");
    const allergens = await Product.distinct("details.allergens");

    // Filter out falsy/empty values from distinct queries
    res.json({
      categories: categories.filter(Boolean),
      subCategories: subCategories.filter(Boolean),
      origins: origins.filter(Boolean),
      flavors: flavors.filter(Boolean),
      qualities: qualities.filter(Boolean),
      caffeine: caffeine.filter(Boolean),
      allergens: allergens.filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
