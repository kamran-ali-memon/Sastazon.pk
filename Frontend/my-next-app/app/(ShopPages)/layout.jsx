
import Navbar from '../../src/Components/Navbar.jsx'
import Footer from '../../src/Components/Footer.jsx'

export default function ShopLayout({ children }) {
    return (
        <>
            <Navbar />

            <main>
                {children}
            </main>

            <Footer />
        </>
    )
}
