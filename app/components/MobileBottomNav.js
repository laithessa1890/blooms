'use client'

import Link from 'next/link'
import {
  FiHome,
  FiShoppingCart,
  FiGrid,
  FiUser,
  FiBox,
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
    <div className="fixed bottom-0 inset-x-0 bg-white border-t z-50 shadow flex justify-around items-center h-16 md:hidden text-xs">
      <Link href="/" className="flex flex-col items-center text-gray-700">
        <FiHome className="text-xl mb-0.5" />
        <span>الرئيسية</span>
      </Link>

      <Link href="/categories" className="flex flex-col items-center text-gray-700">
        <FiGrid className="text-xl mb-0.5" />
        <span>التصنيفات</span>
      </Link>

      <Link href="/series" className="flex flex-col items-center text-gray-700">
        <FiBox className="text-xl mb-0.5" />
        <span>السلاسل</span>
      </Link>

      <Link href="/offers" className="flex flex-col items-center text-gray-700">
        <FiTag className="text-xl mb-0.5" />
        <span>العروض</span>
      </Link>

      <Link href="/cart" className="relative flex flex-col items-center text-gray-700">
        <FiShoppingCart className="text-xl mb-0.5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -left-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
            {cartCount}
          </span>
        )}
        <span>السلة</span>
      </Link>

      <Link href="/account" className="flex flex-col items-center text-gray-700">
        <FiUser className="text-xl mb-0.5" />
        <span>حسابي</span>
      </Link>
    </div>
  )
}
