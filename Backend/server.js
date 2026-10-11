import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
config()

import authRoutes from './Routes/authRoutes.js'
import productRoutes from './Routes/productRoutes.js'
import orderRoutes from './Routes/orderRoutes.js'
import cartRoutes from './Routes/cartRoutes.js'
import paymentRoutes from './Routes/paymentRoutes.js'
import adminDashboardRoutes from './Routes/adminDashboardRoutes.js'


const app = express()


app.use(express.json())

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
)

app.use(cookieParser())

app.use(morgan('dev'))

app.use(helmet())


const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too Many Attempts! Try Again Later'
})

app.use(rateLimiter)


app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/carts', cartRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminDashboardRoutes)


const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_DB_URL)

        console.log('MongoDb Connected Successfully')

        const port = process.env.PORT || 8080

        app.listen(port, () => {
            console.log('Server is Running On', port)
        })

    } catch (error) {

        console.log(
            'Something Went Wrong While Connecting to The Server',
            error.message
        )
    }
}

connectDB()
