import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../Models/userModel.js'
import { sendEmail } from '../Utils/sendMails.js'


// =========================
// REGISTER
// =========================

export const register = async (req, res) => {

    const { username, email, password } = req.body

    try {

        if (!username || !email || !password) {
            return res.status(400).send({
                status: false,
                message: 'All Input Fields Are Required To Fill'
            })
        }


        const isUserAlreadyExist = await userModel.findOne({ email })

        if (isUserAlreadyExist) {
            return res.status(401).send({
                status: false,
                message: 'User Already Exist'
            })
        }


        const securedPassword = await bcrypt.hash(password, 10)

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const expireAt = new Date(Date.now() + 2 * 60 * 1000)


        const newUser = await userModel.create({
            username,
            email,
            password: securedPassword,
            otp,
            isExpire: expireAt
        })


        await sendEmail(
            email,
            'Account Verification Email',
            `Hey! Welcome to Sastazon.pk, Mr. ${username}. Thank You For Registering Your Account at Sastazon.pk. Here is Your OTP Number ${otp} For Confirmation of Account. It Will Expire in 2 Minutes.`
        )


        return res.status(200).send({
            status: true,
            message: 'User Registered Successfully'
        })

    } catch (error) {

        console.error('Register Error:', error)

        return res.status(500).send({
            status: false,
            message: 'User Not Registered. Something Went Wrong'
        })
    }
}



// =========================
// VERIFY OTP
// =========================

export const verifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body


        if (!email || !otp) {
            return res.status(400).send({
                status: false,
                message: 'Email and OTP are required'
            })
        }


        const user = await userModel.findOne({ email })


        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User Not Found'
            })
        }


        if (user.isVerified) {
            return res.status(400).send({
                status: false,
                message: 'User is already verified. Please login.'
            })
        }


        if (!user.otp || !user.isExpire) {
            return res.status(400).send({
                status: false,
                message: 'OTP has expired. Please request a new OTP.'
            })
        }


        const expiryTime = new Date(user.isExpire).getTime()
        const currentTime = Date.now()


        if (currentTime >= expiryTime) {

            user.otp = null
            user.isExpire = null

            await user.save()

            return res.status(400).send({
                status: false,
                message: 'OTP Expired. Please click on Resend OTP to get a new OTP.'
            })
        }


        if (String(user.otp).trim() !== String(otp).trim()) {
            return res.status(400).send({
                status: false,
                message: 'Incorrect OTP'
            })
        }


        user.isVerified = true
        user.otp = null
        user.isExpire = null

        await user.save()


        return res.status(200).send({
            status: true,
            message: 'User Verified Successfully'
        })

    } catch (error) {

        console.error('Verify OTP Error:', error)

        return res.status(500).send({
            status: false,
            message: 'Something Went Wrong.'
        })
    }
}



// =========================
// RESEND OTP
// =========================

export const resendOtp = async (req, res) => {

    try {

        const { email } = req.body


        if (!email) {
            return res.status(400).send({
                status: false,
                message: 'Email is Required'
            })
        }


        const user = await userModel.findOne({ email })


        if (!user) {
            return res.status(400).send({
                status: false,
                message: 'User Not Found'
            })
        }


        if (user.isVerified) {
            return res.status(400).send({
                status: false,
                message: 'Account is already verified.'
            })
        }


        const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

        const newExpiry = new Date(Date.now() + 2 * 60 * 1000)


        user.otp = newOtp
        user.isExpire = newExpiry

        await user.save()


        await sendEmail(
            email,
            'New OTP Code',
            `We have sent you a new OTP: ${newOtp}. This OTP will expire in 2 minutes.`
        )


        return res.status(200).send({
            status: true,
            message: 'New OTP sent to your email successfully'
        })

    } catch (error) {

        console.error('Resend OTP Error:', error)

        return res.status(500).send({
            status: false,
            message: 'Something Went Wrong.'
        })
    }
}



// =========================
// LOGIN
// =========================

export const login = async (req, res) => {

    const { email, password } = req.body

    try {

        if (!email || !password) {
            return res.status(400).send({
                status: false,
                message: 'All Input Fields Are Required To Fill'
            })
        }


        const user = await userModel.findOne({ email })


        if (!user) {
            return res.status(400).send({
                status: false,
                message: 'Email or Password is Invalid'
            })
        }


        const correctPassword = await bcrypt.compare(password, user.password)


        if (!correctPassword) {
            return res.status(400).send({
                status: false,
                message: 'Email or Password is Invalid'
            })
        }


        // If account is created but not verified yet
        if (!user.isVerified) {

            const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

            const newExpiry = new Date(Date.now() + 2 * 60 * 1000)


            user.otp = newOtp
            user.isExpire = newExpiry

            await user.save()


            await sendEmail(
                email,
                'New OTP',
                `We have sent you a new otp ${newOtp}. New Otp will also Expire in 2 Minutes.`
            )


            return res.status(400).send({
                status: false,
                requiresVerification: true,
                email: user.email,
                message: 'Account not verified! A new verification code has been sent to your email.'
            })
        }


        // Create JWT
        const generateToken = jwt.sign(
            {
                userId: user._id,
                userRole: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '30d'
            }
        )


        // HTTP-only cookie
        res.cookie('token', generateToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        })


        // This cookie is only for frontend route handling.
        // Backend security still uses the JWT token.
        res.cookie('userRole', user.role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        })


        return res.status(200).send({

            status: true,

            message: 'You Are Logged in Successfully',

            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        })

    } catch (error) {

        console.error('Login Error:', error)

        return res.status(500).send({
            status: false,
            message: 'Login Failed. Try Again'
        })
    }
}



// =========================
// GET CURRENT USER
// =========================

export const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user._id)
            .select('-password -otp -isExpire')


        if (!user) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            })

            res.clearCookie('userRole', {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            })

            return res.status(401).send({
                status: false,
                message: 'Your account no longer exists. Please login again.'
            })
        }

        return res.status(200).send({
            status: true,
            user
        })

    } catch (error) {
        console.error('Get Current User Error:', error)

        return res.status(500).send({
            status: false,
            message: 'Unable to get current user.'
        })
    }


}




// =========================
// LOGOUT
// =========================

export const logout = async (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    })

    res.clearCookie('userRole', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    })


    return res.status(200).send({
        status: true,
        message: 'Logged out successfully'
    })
}
