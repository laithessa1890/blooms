'use client'

import Link from 'next/link'
import {
  FiHome,
  FiShoppingCart,
  FiGrid,
  FiUser,
  FiTag
} from 'react-icons/fi'
import { useEffect, useState } from 'react'

export default function MobileBottomNav() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }
    updateCart()
    const interval = setInterval(updateCart, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t z-50 shadow flex justify-around items-center h-16 md:hidden text-xs font-semibold">
      {/* الرئيسية */}
      <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-[#C05370] transition">
        <FiHome className="text-xl mb-0.5" />
        <span>الرئيسية</span>
      </Link>

      {/* التصنيفات */}
      <Link href="/categories" className="flex flex-col items-center text-gray-600 hover:text-[#C05370] transition">
        <FiGrid className="text-xl mb-0.5" />
        <span>التصنيفات</span>
      </Link>

      {/* العروض */}
      <Link href="/offers" className="flex flex-col items-center text-gray-600 hover:text-[#C05370] transition">
        <FiTag className="text-xl mb-0.5" />
        <span>العروض</span>
      </Link>

      {/* السلة */}
      <Link href="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-[#C05370] transition">
        <FiShoppingCart className="text-xl mb-0.5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -left-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
            {cartCount}
          </span>
        )}
        <span>السلة</span>
      </Link>

      {/* حسابي */}
      <Link href="/account" className="flex flex-col items-center text-gray-600 hover:text-[#C05370] transition">
        <FiUser className="text-xl mb-0.5" />
        <span>حسابي</span>
      </Link>
    </div>
  )
}
