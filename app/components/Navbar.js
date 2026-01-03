'use client'

import Link from 'next/link'
import { FiShoppingBag, FiSearch } from 'react-icons/fi'
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
      const q = search.trim()
      if (!q) return setResults([])

      const { data, error } = await supabase
        .from('books')
        .select('id, title')
        .ilike('title', `%${q}%`)
        .limit(8)

      if (!error) setResults(data || [])
    }

    const delayDebounce = setTimeout(fetchResults, 250)
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
    <header className="hidden md:block w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b" dir="rtl">
      {/* شريط علوي */}
      <div className="text-xs text-center py-2 bg-gradient-to-r from-[#F9F2F4] via-white to-[#F4F7F5] text-gray-700">
        ✨ مرحبًا بكم في مكتبة <span className="font-semibold text-[#C05370]">Blooms</span> — اكتشف كتابك القادم
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* يمين: روابط */}
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/books', label: 'الكتب' },
              { href: '/manga', label: 'المانجا' },
              { href: '/offers', label: 'العروض' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-full hover:bg-[#F4EDE4] hover:text-[#4C7A68] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* وسط: الشعار */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <span className="text-2xl">📚</span>
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-[#C05370]">
              Blooms Bookstore
            </span>
          </Link>

          {/* يسار: بحث + حساب + سلة */}
          <div className="flex items-center gap-3">
            {/* بحث */}
            <div className="relative w-72">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن كتاب..."
                className="w-full pr-10 pl-3 py-2 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/40 focus:border-[#C05370] transition"
              />

              {(search && (results.length > 0 || results.length === 0)) && (
                <div className="absolute mt-2 w-full rounded-2xl border bg-white shadow-lg overflow-hidden z-50">
                  {results.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                      {results.map((book) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#F4EDE4] hover:text-[#4C7A68] transition"
                          onClick={() => setSearch('')}
                        >
                          {book.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">لا توجد نتائج</div>
                  )}
                </div>
              )}
            </div>

            {/* حساب */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account/login"
                  className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-50 transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/account/register"
                  className="px-4 py-2 rounded-full bg-[#C05370] text-white hover:opacity-90 transition"
                >
                  تسجيل حساب
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="px-4 py-2 rounded-full bg-[#F4F7F5] text-[#4C7A68] hover:bg-[#EAF1EE] transition"
                  title={userMeta?.full_name || user.email}
                >
                  👤 {userMeta?.full_name || user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}

            {/* سلة */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-full border bg-white hover:bg-gray-50 transition"
              aria-label="السلة"
            >
              <FiShoppingBag className="text-xl text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-[#C05370] text-white text-xs font-bold shadow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
