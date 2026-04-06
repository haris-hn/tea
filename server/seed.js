const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Variant = require('./models/Variant');

dotenv.config();

const categories = [
  'Black tea', 'Green tea', 'White tea', 'Chai', 'Matcha', 
  'Herbal tea', 'Oolong', 'Rooibos', 'Teaware'
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
      const teaImages = [
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775134400/tea_products/wmexun7flooizh6jbmog.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775134389/tea_products/rp8svzscuwrsl2e5pzz9.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775132847/tea_products/kjpbkq86pijqk8xhqweh.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775132757/tea_products/yx2mug37ziaxo8dypaxg.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775132645/tea_products/xozyqyeclbmtqedrgpk4.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775132481/tea_products/q8pzhtdt0vex9oohmbur.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775131100/tea_products/l7gw4hzhevl0riuaomox.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775131030/tea_products/otg3gjip9zw7bgvkixp6.png',
        'https://res.cloudinary.com/dtvfi3f7h/image/upload/v1775130930/tea_products/jkssga3gwlyoruspcmxi.png'
      ];

      const product = await Product.create({
        name: `Ceylon ${cat.split(' ')[0]}`,
        description: `Premium ${cat.toLowerCase()} with a balanced character.`,
        category: cat,
        subCategory: idx % 2 === 0 ? 'Loose Leaf' : 'Tea Bags',
        origin: origins[idx % origins.length],
        flavor: [flavors[idx % flavors.length], flavors[(idx + 1) % flavors.length]],
        images: [teaImages[idx % teaImages.length]],
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
