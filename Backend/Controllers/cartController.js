import productModel from '../Models/ProductModel.js'
import cartModel from '../Models/cartModel.js'


export const addToCart = async (req, res) => {

    try {

        const { productId, quantity = 1 } = req.body
        const cartUser = req.user._id

        const requestedQuantity = Number(quantity)

        if (!productId) {
            return res.status(400).send({
                status: false,
                message: 'Product ID is required'
            })
        }

        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity < 1
        ) {
            return res.status(400).send({
                status: false,
                message: 'Quantity must be a atleast 1'
            })
        }

        const product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).send({
                status: false,
                message: 'Product Not Found'
            })
        }

        if (product.productStock <= 0) {
            return res.status(400).send({
                status: false,
                message: 'This product is out of stock'
            })
        }

        if (requestedQuantity > product.productStock) {
            return res.status(400).send({
                status: false,
                message: `Only ${product.productStock} items are available`
            })
        }

        let cart = await cartModel.findOne({
            user: cartUser
        })

        if (cart) {

            const existingItem = cart.cartItems.find(
                (item) =>
                    item.product.toString() === productId.toString()
            )

            if (existingItem) {

                const newQuantity =
                    existingItem.quantity + requestedQuantity

                if (newQuantity > product.productStock) {
                    return res.status(400).send({
                        status: false,
                        message: `Only ${product.productStock} items are available`
                    })
                }

                existingItem.quantity = newQuantity
                existingItem.name = product.productname
                existingItem.price = product.productPrice
                existingItem.image =
                    product.productImages?.[0] || ''

            } else {

                cart.cartItems.push({
                    product: product._id,
                    name: product.productname,
                    price: product.productPrice,
                    image: product.productImages?.[0] || '',
                    quantity: requestedQuantity
                })
            }

            await cart.save()

            const updatedCart = await cartModel
                .findById(cart._id)
                .populate('cartItems.product')

            return res.status(200).send({
                status: true,
                message: 'Product Added into Cart Successfully',
                cart: updatedCart
            })
        }


        const newCart = await cartModel.create({
            user: cartUser,

            cartItems: [
                {
                    product: product._id,
                    name: product.productname,
                    price: product.productPrice,
                    image: product.productImages?.[0] || '',
                    quantity: requestedQuantity
                }
            ]
        })

        const populatedCart = await cartModel
            .findById(newCart._id)
            .populate('cartItems.product')

        return res.status(200).send({
            status: true,
            message: 'New Cart Created Successfully',
            cart: populatedCart
        })

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: 'Server Error: ' + error.message
        })
    }
}



export const getMyCart = async (req, res) => {

    try {

        const myCart = await cartModel
            .findOne({
                user: req.user._id
            })
            .populate('cartItems.product')

        if (!myCart) {

            return res.status(200).send({
                status: true,
                message: 'Your Cart is Empty',
                myCart: {
                    cartItems: []
                }
            })
        }

        return res.status(200).send({
            status: true,
            message: 'Your Cart',
            myCart
        })

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: 'Server Error: ' + error.message
        })
    }
}



export const updateCartQuantity = async (req, res) => {

    try {

        const productID = req.params.productId
        const newQuantity = Number(req.body.quantity)

        if (
            !Number.isInteger(newQuantity) ||
            newQuantity < 1
        ) {
            return res.status(400).send({
                status: false,
                message: 'Quantity must be a atleast 1'
            })
        }

        const cart = await cartModel.findOne({
            user: req.user._id
        })

        if (!cart) {
            return res.status(404).send({
                status: false,
                message: 'Cart Not Found'
            })
        }

        const productInCart = cart.cartItems.find(
            (cartProduct) =>
                cartProduct.product.toString() ===
                productID.toString()
        )

        if (!productInCart) {
            return res.status(404).send({
                status: false,
                message: 'Product Not Found in Cart'
            })
        }

        const product = await productModel.findById(productID)

        if (!product) {
            return res.status(404).send({
                status: false,
                message: 'Product Not Found'
            })
        }

        if (newQuantity > product.productStock) {
            return res.status(400).send({
                status: false,
                message: `Only ${product.productStock} items are available`
            })
        }

        productInCart.quantity = newQuantity

        productInCart.name = product.productname
        productInCart.price = product.productPrice
        productInCart.image =
            product.productImages?.[0] || ''

        await cart.save()

        const updatedCart = await cartModel
            .findById(cart._id)
            .populate('cartItems.product')

        return res.status(200).send({
            status: true,
            message: 'Quantity Updated Successfully',
            cart: updatedCart
        })

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: 'Server Error: ' + error.message
        })
    }
}



export const removeCartItem = async (req, res) => {

    try {

        const productId = req.params.productId

        const cart = await cartModel.findOne({
            user: req.user._id
        })

        if (!cart) {
            return res.status(404).send({
                status: false,
                message: 'Cart Not Found'
            })
        }

        cart.cartItems = cart.cartItems.filter(
            (item) =>
                item.product.toString() !==
                productId.toString()
        )

        await cart.save()

        return res.status(200).send({
            status: true,
            message: 'Product Deleted Successfully From Cart',
            cart
        })

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: 'Server Error: ' + error.message
        })
    }
}



export const deleteCart = async (req, res) => {

    try {

        const cart = await cartModel.findOne({
            user: req.user._id
        })

        if (!cart) {
            return res.status(200).send({
                status: true,
                message: 'Cart is Already Empty'
            })
        }

        cart.cartItems = []

        await cart.save()

        return res.status(200).send({
            status: true,
            message: 'Cart Removed Successfully'
        })

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: 'Server Error: ' + error.message
        })
    }
}
