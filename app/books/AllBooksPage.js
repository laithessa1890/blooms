'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { FiSearch, FiX } from 'react-icons/fi'

export default function AllBooksPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get('filter')

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)

      let query = supabase.from('books').select('*').order('created_at', { ascending: false })
      if (filter) query = query.eq('category', filter)

      const { data, error } = await query
      if (error) {
        console.error('❌ خطأ أثناء جلب الكتب:', error.message || error)
        setBooks([])
      } else {
        setBooks(data || [])
      }

      setLoading(false)
    }

    fetchBooks()
  }, [filter])

  const categories = useMemo(() => {
    const set = new Set()
    books.forEach((b) => b?.category && set.add(b.category))
    return Array.from(set)
  }, [books])

  const filteredBooks = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return books
    return books.filter((b) => {
      const t = (b?.title || '').toLowerCase()
      const c = (b?.category || '').toLowerCase()
      return t.includes(term) || c.includes(term)
    })
  }, [books, q])

  const addToCart = (book) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const newCart = [...currentCart, book]
    localStorage.setItem('cart', JSON.stringify(newCart))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  const setFilter = (cat) => {
    if (!cat) router.push('/books')
    else router.push(`/books?filter=${encodeURIComponent(cat)}`)
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 text-right space-y-5">
        {/* العنوان + وصف */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
              📚 {filter ? `كتب التصنيف: ` : 'جميع الكتب'}
              {filter && <span className="text-[#4C7A68]">{filter}</span>}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              تصفّح أحدث الإضافات، فلتر حسب التصنيف أو ابحث بسرعة.
            </p>
          </div>

          {/* بحث */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالعنوان أو التصنيف..."
              className="w-full pr-10 pl-10 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370] transition"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="مسح البحث"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* شريط التصنيفات */}
        <div className="rounded-2xl border bg-white/70 backdrop-blur p-3 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-sm transition border
              ${!filter ? 'bg-[#4C7A68] text-white border-[#4C7A68]' : 'bg-white hover:bg-gray-50'}`}
          >
            الكل
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm transition border
                ${filter === cat ? 'bg-[#4C7A68] text-white border-[#4C7A68]' : 'bg-white hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}

          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="mr-auto px-4 py-2 rounded-full text-sm border text-gray-700 hover:bg-gray-50 transition inline-flex items-center gap-2"
            >
              <FiX /> إزالة الفلتر
            </button>
          )}
        </div>

        {/* المحتوى */}
        {loading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-10 bg-gray-50" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl border bg-white/70 backdrop-blur p-6 text-gray-600">
            لا توجد نتائج مطابقة.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <Link href={`/books/${book.id}`} className="flex-1">
                  <div className="relative w-full h-64 bg-gray-50">
                    <Image
                      src={book.image || '/placeholder.jpg'}
                      alt={book.title}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-4 space-y-1">
                    <h3 className="text-[15px] font-extrabold text-[#2E2A28] line-clamp-2">
                      {book.title}
                    </h3>

                    {book.category && (
                      <p className="text-xs text-gray-500">{book.category}</p>
                    )}

                    {book.price ? (
                      <p className="text-sm text-[#C05370] font-bold">
                        {Number(book.price).toLocaleString()} ل.س
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">السعر غير متوفر</p>
                    )}
                  </div>
                </Link>

                <div className="p-3 pt-0">
                  <button
                    onClick={() => addToCart(book)}
                    className="w-full rounded-full bg-[#4C7A68] text-white text-sm py-2.5 hover:opacity-95 transition"
                  >
                    🛒 أضف إلى السلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
