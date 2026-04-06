const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function listResources() {
  try {
    console.log('Fetching Cloudinary resources...');
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 10
    });
    console.log('Found ' + result.resources.length + ' resources.');
    result.resources.forEach(res => {
      console.log(`URL: ${res.secure_url}`);
    });
  } catch (err) {
    console.error('Error fetching Cloudinary resources:', err.message);
  }
}

listResources();
