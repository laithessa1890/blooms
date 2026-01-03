'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { FiSearch, FiX } from 'react-icons/fi'

export default function MobileSearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const wrapRef = useRef(null)

  // إغلاق عند الضغط خارج
  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) {
        setResults([])
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      setError('')
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('books')
        .select('id, title, image')
        .ilike('title', `%${q}%`)
        .limit(8)

      if (error) {
        setError('حدث خطأ أثناء البحث')
        setResults([])
      } else {
        setResults(data || [])
      }

      setLoading(false)
    }, 250)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <div ref={wrapRef} className="block md:hidden px-4 pt-4" dir="rtl">
      {/* input */}
      <div className="relative">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن كتاب..."
          className="w-full pr-10 pl-10 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370] transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="مسح البحث"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* النتائج */}
      {query && (
        <div className="bg-white/95 backdrop-blur border mt-2 rounded-2xl shadow-lg max-h-80 overflow-y-auto py-2 px-2">
          {loading ? (
            <p className="px-2 py-2 text-sm text-gray-500">...جارٍ البحث</p>
          ) : error ? (
            <p className="px-2 py-2 text-sm text-red-600">❌ {error}</p>
          ) : results.length > 0 ? (
            results.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="flex items-center gap-3 hover:bg-[#F4EDE4] px-2 py-2 rounded-xl transition"
                onClick={() => {
                  setQuery('')
                  setResults([])
                }}
              >
                <div className="relative w-12 h-16 flex-shrink-0 border bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={book.image || '/placeholder.jpg'}
                    alt={book.title}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-sm text-[#2E2A28] font-semibold line-clamp-2">
                  {book.title}
                </p>
              </Link>
            ))
          ) : (
            <p className="px-2 py-2 text-sm text-gray-500">لا توجد نتائج</p>
          )}
        </div>
      )}
    </div>
  )
}
