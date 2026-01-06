import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'

export const metadata = {
  title: 'Blooms Bookstore',
  description: 'مكتبة للكتب المميزة والمنتجات الثقافية المختارة بعناية',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#F4EDE4] text-[#2E2A28]">
        {/* Navbar */}
        <Navbar />

        {/* المحتوى */}
        <main
          className="
            min-h-[calc(100vh-200px)]
            pt-4
            pb-24   /* مهم للموبايل حتى ما يغطيه MobileBottomNav */
          "
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  )
}
