import userModel from '../Models/userModel.js';
import ProductModel from '../Models/ProductModel.js';
import orderModal from '../Models/orderModal.js';



export const adminDashboard = async (req, res) => {
    try {
        const allUsers = await userModel.countDocuments({
            role: 'user'
        })

        const allProducts = await ProductModel.countDocuments()

        // Total orders mein tamam statuses count honge
        const allOrders = await orderModal.countDocuments()

        // Sirf delivered orders fetch karo
        const deliveredOrders = await orderModal.find(
            { orderStatus: 'Delivered' },
            'totalAmount'
        )

        // Sirf delivered orders ki total revenue
        const totalRevenue = deliveredOrders.reduce(
            (sum, order) => sum + (Number(order.totalAmount) || 0),
            0
        )

        return res.status(200).send({
            status: true,
            message: 'Dashboard statistics fetched successfully',
            allUsers,
            allProducts,
            allOrders,
            totalRevenue
        })

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: `Server Error: ${error.message}`
        })
    }
}



export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password');

    if (!users || users.length === 0) {
      return res.status(400).send({
        status: false,
        message: 'Users Not Found',
      });
    }

    return res.status(200).send({
      status: true,
      message: 'All users',
      users,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Server Error ${error.message}`,
    });
  }
};
