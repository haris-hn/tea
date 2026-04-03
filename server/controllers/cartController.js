const Cart = require('../models/Cart');
const Variant = require('../models/Variant');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.variant',
      populate: { path: 'product' }
    });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;
    const variant = await Variant.findById(variantId);

    if (!variant || variant.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const qty = parseInt(quantity, 10);
    const itemIndex = cart.items.findIndex(item => item.variant.toString() === variantId);
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + qty;
      if (variant.stock < newQuantity) {
        return res.status(400).json({ message: 'Not enough stock available for this quantity' });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ variant: variantId, quantity: qty });
    }

    await cart.save();
    cart = await cart.populate({
      path: 'items.variant',
      populate: { path: 'product' }
    });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(item => item.variant.toString() !== req.params.variantId);
      await cart.save();
      cart = await cart.populate({
        path: 'items.variant',
        populate: { path: 'product' }
      });
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;
    const qty = parseInt(quantity, 10);
    if (qty < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const variant = await Variant.findById(variantId);
    if (!variant || variant.stock < qty) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.variant.toString() === variantId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = qty;
        await cart.save();
        cart = await cart.populate({
          path: 'items.variant',
          populate: { path: 'product' }
        });
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
