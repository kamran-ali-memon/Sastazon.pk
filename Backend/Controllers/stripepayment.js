import Stripe from 'stripe';
import { config } from 'dotenv';
import orderModel from '../Models/orderModal.js';

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).send({ status: false, message: 'Order Not Found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(400).send({ status: false, message: 'This is Not Your Order' });
    }

    const lineItems = order.itemDetail.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return res.send({ url: session.url, sessionId: session.id });
  } catch (error) {
    return res.status(500).send({ status: false, message: 'Server Error: ' + error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(400).send({ status: false, message: 'Order Not Found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'Confirmed';
    await order.save();

    return res.status(200).send({
      status: true,
      message: 'Order Confirmed Successfully',
      order,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: 'Server Error: ' + error.message });
  }
};
