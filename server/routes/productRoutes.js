const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
  addVariant, updateVariant, deleteVariant,
  getFilters
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, admin, upload.array('images', 3), (req, res) => {
  const imageUrls = req.files.map(file => file.path);
  res.json({ urls: imageUrls });
});

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/filters', getFilters);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/variants')
  .post(protect, admin, addVariant);

router.route('/:id/variants/:variantId')
  .put(protect, admin, updateVariant)
  .delete(protect, admin, deleteVariant);

module.exports = router;
