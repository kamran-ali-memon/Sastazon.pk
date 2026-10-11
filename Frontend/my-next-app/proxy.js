// 
import { NextResponse } from 'next/server'


export function proxy(request) {

    const path = request.nextUrl.pathname


    // =========================
    // ADMIN ROUTES
    // =========================

    const adminRoutes = [
        '/admindashboard',
        '/admin-products',
        '/add-product',
        '/edit-product',
        '/orders',
        '/users'
    ]


    const isAdminRoute = adminRoutes.some((route) =>
        path.startsWith(route)
    )


    // =========================
    // CUSTOMER ROUTES
    // =========================

    const customerRoutes = [
        '/cart',
        '/checkout',
        '/myorder'
    ]


    const isCustomerRoute = customerRoutes.some((route) =>
        path.startsWith(route)
    )


    // =========================
    // COOKIES
    // =========================

    const token = request.cookies.get('token')?.value

    const userRole = request.cookies.get('userRole')?.value


    // =========================
    // ADMIN CHECK
    // =========================

    if (isAdminRoute) {

        if (!token) {
            return NextResponse.redirect(
                new URL('/login', request.url)
            )
        }


        if (userRole !== 'admin') {

            return NextResponse.redirect(
                new URL('/', request.url)
            )
        }
    }


    // =========================
    // CUSTOMER LOGIN CHECK
    // =========================

    if (isCustomerRoute && !token) {

        return NextResponse.redirect(
            new URL('/login', request.url)
        )
    }


    return NextResponse.next()
}


export const config = {
    matcher: [
        '/admindashboard/:path*',
        '/admin-products/:path*',
        '/add-product/:path*',
        '/edit-product/:path*',
        '/orders/:path*',
        '/users/:path*',

        '/cart/:path*',
        '/checkout/:path*',
        '/myorder/:path*'
    ]
}
