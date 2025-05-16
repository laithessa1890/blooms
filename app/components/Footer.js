'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white border-t text-right text-sm text-gray-700 mt-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* روابط */}
        <div>
          <h4 className="font-bold mb-3">تسوّق الآن</h4>
          <ul className="space-y-2">
            <li><Link href="/">الرئيسية</Link></li>
            <li><Link href="/books">الكتب</Link></li>
           
          </ul>
        </div>

        {/* معلومات تواصل */}
        <div>
          <h4 className="font-bold mb-3">معلومات التواصل</h4>
          <p>جوال: 0982549417</p>
         
          <div className="flex gap-4 mt-4 text-xl">
          
            <Link href="https://www.instagram.com/bloom_sbookstore/?__pwa=1" target="_blank"><FaInstagram /></Link>
          </div>
        </div>

        {/* اشتراك بالإيميل */}
        <div>
          <h4 className="font-bold mb-3">اشترك في نشرتنا البريدية</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="الإيميل"
              className="border border-gray-300 rounded-s px-4 py-2 w-full"
            />
            <button className="bg-[#C05370] text-white px-4 py-2 rounded-e hover:bg-[#a8405b]">
              اشتركي
            </button>
          </div>
        </div>
      </div>

      <div className="border-t text-center py-4 text-xs text-gray-500">
        © 2025 مكتبة Blooms. جميع الحقوق محفوظة. · <Link href="/privacy">سياسة الخصوصية</Link> · <Link href="/terms">شروط الاستخدام</Link>
      </div>
    </footer>
  )
}
