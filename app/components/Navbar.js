// app/components/Navbar.js
'use client'

import Link from 'next/link'
import { FiShoppingBag } from 'react-icons/fi'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }
    updateCart()
    const interval = setInterval(updateCart, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .ilike('title', `%${query}%`)

      if (!error) setResults(data)
    }

    const delay = setTimeout(fetchResults, 300)
    return () => clearTimeout(delay)
  }, [query])

  return (
    <header className="w-full border-b bg-white" dir="rtl">
      <div className="text-xs text-gray-600 text-center py-1 border-b">
        مرحبًا بكم في مكتبة Blooms
      </div>

      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4 text-xl text-gray-700 relative">
          <Link href="/cart" className="relative">
            <FiShoppingBag className="cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* حقل البحث */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="ابحث عن كتاب..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
            />

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded shadow z-50 max-h-72 overflow-auto text-right">
                {results.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
                    onClick={() => setQuery('')}
                  >
                    <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100">
                      <Image
                        src={book.image || '/placeholder.jpg'}
                        alt={book.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-[#4C7A68]">{book.title}</span>
                      <span className="text-xs text-[#C05370]">{book.price} ل.س</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

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

        <nav className="flex items-center gap-6 text-gray-800 text-sm font-medium">
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <Link href="/books" className="hover:underline">الكتب</Link>
        </nav>
      </div>
    </header>
  )
}
