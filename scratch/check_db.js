const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://haris:Haris123@cluster1.tpsiw8f.mongodb.net/tea_ecommerce";

async function checkReviews() {
  await mongoose.connect(MONGO_URI);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  
  // Try to find reviews collection. NestJS @Schema() defaults to lowercase plural 'reviews'
  const reviews = await mongoose.connection.db.collection('reviews').find({}).toArray();
  console.log('Total Reviews found:', reviews.length);
  if (reviews.length > 0) {
    console.log('First Review:', JSON.stringify(reviews[0], null, 2));
  }
  
  await mongoose.disconnect();
}

checkReviews().catch(err => console.error(err));
