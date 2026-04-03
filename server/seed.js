const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Variant = require('./models/Variant');

dotenv.config();

const categories = [
  'Black teas', 'Green teas', 'White teas', 'Chai', 'Matcha', 
  'Herbal teas', 'Oolong', 'Rooibos', 'Teaware'
];

const origins = ['India', 'Japan', 'Iran', 'South Africa'];
const flavors = ['Spicy', 'Sweet', 'Citrus', 'Smooth', 'Fruity', 'Floral', 'Grassy', 'Minty', 'Bitter', 'Creamy'];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tea_ecommerce');
    
    // Clear existing data
    await Product.deleteMany({});
    await Variant.deleteMany({});

    for (const [idx, cat] of categories.entries()) {
      const product = await Product.create({
        name: `Ceylon ${cat.split(' ')[0]}`,
        description: `Premium ${cat.toLowerCase()} with a balanced character.`,
        category: cat,
        subCategory: idx % 2 === 0 ? 'Loose Leaf' : 'Tea Bags',
        origin: origins[idx % origins.length],
        flavor: [flavors[idx % flavors.length], flavors[(idx + 1) % flavors.length]],
        images: ['https://images.unsplash.com/photo-1594631252845-29fc458695d6'],
        rating: 4.8,
        numReviews: 24
      });

      // Add a couple of variants for each
      const v1 = await Variant.create({
        product: product._id,
        sku: `${cat.substring(0,3).toUpperCase()}-50G`,
        sizeOrWeight: '50 g',
        price: 4.85,
        stock: 50
      });

      const v2 = await Variant.create({
        product: product._id,
        sku: `${cat.substring(0,3).toUpperCase()}-100G`,
        sizeOrWeight: '100 g',
        price: 8.50,
        stock: 30
      });

      product.variants.push(v1._id, v2._id);
      await product.save();
    }

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
