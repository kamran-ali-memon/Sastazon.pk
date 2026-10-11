import ProductModel from '../Models/ProductModel.js'
import orderModal from '../Models/orderModal.js'
import { sendEmail } from '../Utils/sendMails.js'


// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body

  try {
    // Basic validation
    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      !shippingAddress ||
      !paymentMethod
    ) {
      return res.status(400).send({
        status: false,
        message: 'All Fields are Required to Fill Correctly'
      })
    }

    if (orderItems.length === 0) {
      return res.status(400).send({
        status: false,
        message: 'No Order Yet.'
      })
    }

    // Currently supported payment methods
    if (!['cod', 'card', 'stripe'].includes(paymentMethod)) {
      return res.status(400).send({
        status: false,
        message: 'Invalid Payment Method'
      })
    }

    /*
      We create a clean order list from database values.

      IMPORTANT:
      We do NOT trust price/name/image sent by frontend.
      Product database is the source of truth.
    */

    const finalOrderItems = []
    let totalAmount = 0

    for (const item of orderItems) {
      if (!item.product) {
        return res.status(400).send({
          status: false,
          message: 'Product ID is Required'
        })
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).send({
          status: false,
          message: 'Invalid Product Quantity'
        })
      }

      const productItem = await ProductModel.findById(item.product)

      if (!productItem) {
        return res.status(400).send({
          status: false,
          message:
            'Sorry! The Product You Entered is Not Available Right Now'
        })
      }

      if (productItem.productStock < quantity) {
        return res.status(400).send({
          status: false,
          message:
            `${productItem.productname} has only ${productItem.productStock} item(s) available`
        })
      }

      const itemTotal = productItem.productPrice * quantity

      totalAmount += itemTotal

      finalOrderItems.push({
        product: productItem._id,
        name: productItem.productname,
        quantity,
        price: productItem.productPrice,
        image: productItem.productImages?.[0] || ''
      })
    }

    // ==================================================
    // CREATE ORDER
    // ==================================================

    const newOrder = await orderModal.create({
      user: req.user._id,

      itemDetail: finalOrderItems,

      shippingAddress,

      paymentMethod,

      totalAmount,

      /*
        COD:
        Payment is not received online yet.

        Stripe/Card:
        Future payment flow can update these fields
        after successful payment.
      */
      isPaid: false,
      paidAt: null,

      orderStatus: 'Pending'
    })

    // ==================================================
    // REDUCE STOCK
    // ==================================================

    for (const item of finalOrderItems) {
      const productItem = await ProductModel.findById(item.product)

      if (productItem) {
        productItem.productStock =
          productItem.productStock - item.quantity

        await productItem.save()
      }
    }

    // ==================================================
    // EMAIL
    // ==================================================

    try {
      await sendEmail(
        req.user.email,
        'Order Created Email',
        `Mr. ${req.user.username}

Thank You For Placing Your Order.

Your Sastazon.pk order has been placed successfully.

Order ID: ${newOrder._id}

Total Amount: Rs. ${newOrder.totalAmount}

Payment Method: ${newOrder.paymentMethod}

Order Status: ${newOrder.orderStatus}`
      )
    } catch (emailError) {
      /*
        Email failure should NOT make a successfully
        created order fail.
      */
      console.error('Order email error:', emailError.message)
    }

    return res.status(200).send({
      status: true,
      message: 'Order Placed Successfully',
      newOrder
    })

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Server Error ${error.message}`
    })
  }
}


// ======================================================
// GET MY ORDERS
// ======================================================

export const getMyOrders = async (req, res) => {
  try {
    const myOrders = await orderModal
      .find({
        user: req.user._id
      })
      .sort({
        createdAt: -1
      })

    if (!myOrders || myOrders.length === 0) {
      return res.status(200).send({
        status: true,
        message: 'Currently There Is No Any Order Placed',
        myOrders: []
      })
    }

    return res.status(200).send({
      status: true,
      message: 'Fetched All Orders',
      myOrders
    })

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Server Error ${error.message}`
    })
  }
}


// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================

export const getAllOrders = async (req, res) => {
  try {
    const myAllOrders = await orderModal
      .find({})
      .sort({
        createdAt: -1
      })

    return res.status(200).send({
      status: true,
      message:
        myAllOrders.length > 0
          ? 'Fetched All Orders'
          : 'Currently There Are No Orders.',
      myAllOrders
    })

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Server Error ${error.message}`
    })
  }
}


// ======================================================
// GET SINGLE ORDER
// ======================================================

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    const singleOrder = await orderModal.findById(orderId)

    if (!singleOrder) {
      return res.status(404).send({
        status: false,
        message: 'Order Not Found'
      })
    }

    const isOwner =
      singleOrder.user.toString() ===
      req.user._id.toString()

    const isAdmin =
      req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).send({
        status: false,
        message:
          'You are Not Authorized to See Other\'s Orders'
      })
    }

    return res.status(200).send({
      status: true,
      message: 'Your Order',
      singleOrder
    })

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Server Error ${error.message}`
    })
  }
}


// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const newStatus = req.body.status

    // --------------------------------------------------
    // Valid statuses
    // --------------------------------------------------

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Shipped',
      'Delivered',
      'Cancelled'
    ]

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).send({
        status: false,
        message: 'Invalid Order Status'
      })
    }

    // --------------------------------------------------
    // Find order
    // --------------------------------------------------

    const order = await orderModal.findById(orderId)

    if (!order) {
      return res.status(404).send({
        status: false,
        message: 'Order Not Found'
      })
    }

    const oldStatus = order.orderStatus

    // --------------------------------------------------
    // Nothing to change
    // --------------------------------------------------

    if (oldStatus === newStatus) {
      return res.status(200).send({
        status: true,
        message: 'Order Status is Already ' + newStatus,
        Order: order
      })
    }

    // ==================================================
    // DELIVERED ORDER
    // ==================================================

    /*
      Once an order is delivered, we don't simply
      turn it into Cancelled.

      Future:
      Delivered -> Return/Refund
    */

    if (
      oldStatus === 'Delivered' &&
      newStatus === 'Cancelled'
    ) {
      return res.status(400).send({
        status: false,
        message:
          'Delivered orders cannot be cancelled. Use Return/Refund process.'
      })
    }


    // ==================================================
    // ACTIVE ORDER -> CANCELLED
    // ==================================================

    if (
      newStatus === 'Cancelled' &&
      oldStatus !== 'Cancelled'
    ) {

      /*
        Restore stock because these products are no longer
        part of an active order.
      */

      for (const item of order.itemDetail) {

        const product = await ProductModel.findById(
          item.product
        )

        if (product) {
          product.productStock =
            product.productStock + item.quantity

          await product.save()
        }
      }

      order.orderStatus = 'Cancelled'

      /*
        If payment was made in future using Stripe,
        this is where refund logic will be connected.

        COD:
        No online payment to refund.
      */

      await order.save()

      return res.status(200).send({
        status: true,
        message:
          'Order Cancelled Successfully and Stock Restored',
        Order: order
      })
    }


    // ==================================================
    // CANCELLED -> ACTIVE
    // ==================================================

    if (
      oldStatus === 'Cancelled' &&
      newStatus !== 'Cancelled'
    ) {

      /*
        Customer/admin is activating the cancelled order
        again.

        Therefore stock must be available again.
      */

      for (const item of order.itemDetail) {

        const product = await ProductModel.findById(
          item.product
        )

        if (!product) {
          return res.status(400).send({
            status: false,
            message:
              'One or more products from this order no longer exist'
          })
        }

        /*
          Check stock BEFORE deducting.
        */

        if (product.productStock < item.quantity) {
          return res.status(400).send({
            status: false,
            message:
              `${product.productname} does not have enough stock to reactivate this order`
          })
        }
      }

      /*
        All products have enough stock.
        Now safely deduct them.
      */

      for (const item of order.itemDetail) {

        const product = await ProductModel.findById(
          item.product
        )

        product.productStock =
          product.productStock - item.quantity

        await product.save()
      }

      order.orderStatus = newStatus

      await order.save()

      return res.status(200).send({
        status: true,
        message:
          'Order Reactivated Successfully and Stock Deducted',
        Order: order
      })
    }


    // ==================================================
    // NORMAL STATUS CHANGE
    // ==================================================

    /*
      Example:

      Pending -> Confirmed
      Confirmed -> Shipped
      Shipped -> Delivered

      Stock does NOT change here because it was already
      deducted when the order was created.
    */

    order.orderStatus = newStatus

    await order.save()

    return res.status(200).send({
      status: true,
      message:
        'Order Status Updated Successfully',
      Order: order
    })

  } catch (error) {
    console.error('Update Order Status Error:', error)

    return res.status(500).send({
      status: false,
      message: `Server Error ${error.message}`
    })
  }
}
