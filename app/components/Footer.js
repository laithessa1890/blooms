'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-white border-t mt-12 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* عن المكتبة */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-[#2E2A28]">📚 مكتبة Blooms</h4>
          <p className="text-gray-600 leading-relaxed">
            نوفر لك أفضل الكتب والمنتجات الثقافية المختارة بعناية،
            مع توصيل سريع داخل دمشق وإلى جميع المحافظات.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="https://www.instagram.com/bloom_sbookstore/?__pwa=1"
              target="_blank"
              className="w-9 h-9 rounded-full border flex items-center justify-center
                         hover:bg-[#C05370] hover:text-white transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>

            <Link
              href="https://www.facebook.com/"
              target="_blank"
              className="w-9 h-9 rounded-full border flex items-center justify-center
                         hover:bg-[#C05370] hover:text-white transition"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </Link>
          </div>
        </div>

        {/* روابط سريعة */}
        <div>
          <h4 className="font-extrabold text-[#2E2A28] mb-3">تسوّق الآن</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="/" className="hover:text-[#C05370] transition">الرئيسية</Link></li>
            <li><Link href="/books" className="hover:text-[#C05370] transition">الكتب</Link></li>
            <li><Link href="/offers" className="hover:text-[#C05370] transition">العروض</Link></li>
            <li><Link href="/cart" className="hover:text-[#C05370] transition">سلة المشتريات</Link></li>
          </ul>
        </div>

        {/* الاشتراك */}
        <div>
          <h4 className="font-extrabold text-[#2E2A28] mb-3">
            📩 اشترك في نشرتنا البريدية
          </h4>
          <p className="text-gray-600 mb-3">
            تصلك أحدث العروض والإصدارات مباشرة.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="الإيميل"
              className="border border-gray-300 rounded-s-full px-4 py-2 w-full
                         focus:outline-none focus:ring-2 focus:ring-[#C05370]/30"
            />
            <button
              className="bg-[#C05370] text-white px-5 py-2 rounded-e-full
                         hover:opacity-90 transition"
            >
              اشتركي
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            بالاشتراك، أنت توافق على سياسة الخصوصية.
          </p>
        </div>
      </div>

      {/* حقوق */}
      <div className="border-t text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} مكتبة Blooms. جميع الحقوق محفوظة.
        <span className="mx-1">·</span>
        <Link href="/privacy" className="hover:text-[#C05370] transition">
          سياسة الخصوصية
        </Link>
        <span className="mx-1">·</span>
        <Link href="/terms" className="hover:text-[#C05370] transition">
          شروط الاستخدام
        </Link>
      </div>
    </footer>
  )
}
