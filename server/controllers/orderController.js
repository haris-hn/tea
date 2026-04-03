const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Variant = require('../models/Variant');

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.variant');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const variant = await Variant.findById(item.variant._id);
      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${variant.sku}` });
      }
      totalAmount += variant.price * item.quantity;
      orderItems.push({
        variant: variant._id,
        quantity: item.quantity,
        priceAtPurchase: variant.price
      });
      variant.stock -= item.quantity;
      await variant.save();
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount
    });

    const createdOrder = await order.save();
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.variant');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').populate('items.variant');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    
    // For products and users, we can import models here or just count them
    const Product = require('../models/Product');
    const User = require('../models/User');
    
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
