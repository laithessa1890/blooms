'use client'

import Link from 'next/link'
import { FiShoppingBag } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [user, setUser] = useState(null)
  const [userMeta, setUserMeta] = useState(null)

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
      if (!search.trim()) return setResults([])

      const { data, error } = await supabase
        .from('books')
        .select('id, title')
        .ilike('title', `%${search}%`)

      if (!error) setResults(data)
    }

    const delayDebounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(delayDebounce)
  }, [search])

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setUserMeta(data)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserMeta(null)
  }

  return (
    <header className="hidden md:block w-full border-b bg-white z-50 relative" dir="rtl">
      <div className="text-xs text-gray-600 text-center py-1 border-b">
        مرحبًا بكم في مكتبة Blooms
      </div>

      <div className="flex items-center justify-between px-6 py-3 relative">
        {/* يسار */}
        <div className="flex items-center gap-4 text-xl text-gray-700 relative">
          <Link href="/cart" className="relative">
            <FiShoppingBag className="cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* وسط */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#C05370]">📚 Blooms Bookstore</span>
        </div>

        {/* يمين */}
        <div className="flex flex-col items-end gap-2 text-sm">
          <nav className="flex items-center gap-4 text-gray-800 font-medium">
            <Link href="/" className="hover:underline">الرئيسية</Link>
            <Link href="/books" className="hover:underline">الكتب</Link>
            <Link href="/manga" className="hover:underline">المانجا</Link>
            <Link href="/offers" className="hover:underline">العروض</Link>

            {!user ? (
              <>
                <Link href="/account/register" className="hover:underline text-[#C05370]">تسجيل حساب</Link>
                <Link href="/account/login" className="hover:underline">تسجيل الدخول</Link>
              </>
            ) : (
              <>
                <Link href="/account" className="hover:underline text-[#4C7A68]">
                  👤 {userMeta?.full_name || user.email}
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:underline">تسجيل الخروج</button>
              </>
            )}
          </nav>

          {/* بحث */}
          <div className="relative w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 ابحث عن كتاب..."
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C05370]"
            />
            {search && results.length > 0 && (
              <div className="absolute bg-white border mt-1 rounded shadow w-full max-h-60 overflow-y-auto z-50">
                {results.map(book => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="block px-4 py-2 hover:bg-[#F4EDE4] text-sm text-[#4C7A68]"
                    onClick={() => setSearch('')}
                  >
                    {book.title}
                  </Link>
                ))}
              </div>
            )}
            {search && results.length === 0 && (
              <div className="absolute bg-white border mt-1 rounded shadow w-full text-sm text-gray-500 px-4 py-2">
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
