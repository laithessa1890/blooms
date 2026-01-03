'use client'

import Link from 'next/link'
import {
  FiHome,
  FiShoppingCart,
  FiGrid,
  FiUser,
  FiTag,
} from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function MobileBottomNav() {
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }
    updateCart()
    const interval = setInterval(updateCart, 800)
    return () => clearInterval(interval)
  }, [])

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const baseItem =
    'flex flex-col items-center justify-center gap-0.5 text-[11px] transition'

  const activeClass = 'text-[#C05370]'
  const inactiveClass = 'text-gray-500 hover:text-[#C05370]'

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur
                 border-t shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
                 h-16 grid grid-cols-5"
      dir="rtl"
    >
      {/* الرئيسية */}
      <Link
        href="/"
        className={`${baseItem} ${isActive('/') ? activeClass : inactiveClass}`}
      >
        <FiHome className="text-xl" />
        <span>الرئيسية</span>
        {isActive('/') && (
          <span className="mt-0.5 h-1 w-6 rounded-full bg-[#C05370]" />
        )}
      </Link>

      {/* التصنيفات */}
      <Link
        href="/categories"
        className={`${baseItem} ${
          isActive('/categories') ? activeClass : inactiveClass
        }`}
      >
        <FiGrid className="text-xl" />
        <span>التصنيفات</span>
        {isActive('/categories') && (
          <span className="mt-0.5 h-1 w-6 rounded-full bg-[#C05370]" />
        )}
      </Link>

      {/* العروض */}
      <Link
        href="/offers"
        className={`${baseItem} ${
          isActive('/offers') ? activeClass : inactiveClass
        }`}
      >
        <FiTag className="text-xl" />
        <span>العروض</span>
        {isActive('/offers') && (
          <span className="mt-0.5 h-1 w-6 rounded-full bg-[#C05370]" />
        )}
      </Link>

      {/* السلة */}
      <Link
        href="/cart"
        className={`relative ${baseItem} ${
          isActive('/cart') ? activeClass : inactiveClass
        }`}
      >
        <FiShoppingCart className="text-xl" />

        {cartCount > 0 && (
          <span className="absolute top-1 right-4 min-w-[18px] h-[18px]
                           flex items-center justify-center rounded-full
                           bg-[#C05370] text-white text-[10px] font-bold px-1">
            {cartCount}
          </span>
        )}

        <span>السلة</span>

        {isActive('/cart') && (
          <span className="mt-0.5 h-1 w-6 rounded-full bg-[#C05370]" />
        )}
      </Link>

      {/* حسابي */}
      <Link
        href="/account"
        className={`${baseItem} ${
          isActive('/account') ? activeClass : inactiveClass
        }`}
      >
        <FiUser className="text-xl" />
        <span>حسابي</span>
        {isActive('/account') && (
          <span className="mt-0.5 h-1 w-6 rounded-full bg-[#C05370]" />
        )}
      </Link>
    </div>
  )
}
