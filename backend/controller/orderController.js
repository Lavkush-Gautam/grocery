
import Order from '../models/Order.js';
import Product from '../models/product.js';

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length == 0) {
            return res.json({ success: false, message: 'Invalid Data' })
        }
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        amount += Math.floor(amount * 0.02)
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
        })
        return res.json({ success: true, message: 'Order Placed Successfully' })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export const placeOnlineOrder = async (req, res) => {
  try {
    const { userId, items, address, paymentId } = req.body;

    const order = new Order({
      user: userId,
      items,
      address,
      paymentMode: "Online",
      paymentStatus: "Paid",
      paymentId,
    });

    await order.save();
    return res.status(200).json({ success: true, message: "Online order placed", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to place online order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.product')
      .populate('address') // Populate the 'address' field
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('getUserOrders error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const getAllOrders = async (req, res) => {
    try {

        const orders = Order.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 })

        res, json({ success: true, orders })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

}