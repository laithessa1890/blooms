'use client'

import Link from 'next/link'
import { FiSearch, FiShoppingBag } from 'react-icons/fi'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }

    updateCart()

    const interval = setInterval(updateCart, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`)
      setSearch('')
    }
  }

  return (
    <header className="w-full border-b bg-white" dir="rtl">
      {/* شريط ترحيبي علوي صغير */}
      <div className="text-xs text-gray-600 text-center py-1 border-b">
        مرحبًا بكم في مكتبة Blooms
      </div>

      {/* الشريط الرئيسي */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4">
        {/* يسار: سلة + بحث */}
        <div className="flex items-center gap-4 text-xl text-gray-700 relative">
          <Link href="/cart" className="relative">
            <FiShoppingBag className="cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ابحث عن كتاب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-2 py-1 border rounded text-sm w-40 md:w-52"
            />
            <button type="submit" className="text-[#4C7A68] hover:text-[#C05370]">
              <FiSearch />
            </button>
          </form>
        </div>

        {/* الشعار في المنتصف */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#C05370]">Blooms</span>
          <Image
            src="/logo.png"
            alt="Blooms Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        {/* روابط التنقل يمين */}
        <nav className="flex items-center gap-6 text-gray-800 text-sm font-medium">
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <Link href="/books" className="hover:underline">الكتب</Link>
        </nav>
      </div>
    </header>
  )
}
