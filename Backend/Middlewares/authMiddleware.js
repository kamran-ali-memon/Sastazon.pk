import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    try {

        const token = req.cookies?.token

        if (!token) {
            return res.status(401).send({
                status: false,
                message: 'Please login first.'
            })
        }

        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )

        req.user = {
            _id: verifyToken.userId,
            id: verifyToken.userId,
            role: verifyToken.userRole
        }

        next()

    } catch (error) {

        return res.status(401).send({
            status: false,
            message: 'Please login first or your session has expired.'
        })
    }
}


export const adminOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).send({
            status: false,
            message: 'Authentication required.'
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).send({
            status: false,
            message: 'Access Denied. Admin Only.'
        })
    }

    next()
}
