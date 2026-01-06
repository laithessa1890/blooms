'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || '').trim()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
      setError('')
      setBooks([])

      if (!query) return

      setLoading(true)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(24)

      if (error) {
        console.error(error)
        setError('حدث خطأ أثناء البحث')
        setBooks([])
      } else {
        setBooks(data || [])
      }

      setLoading(false)
    }

    fetchResults()
  }, [query])

  const countText = useMemo(() => {
    if (!query) return ''
    if (loading) return ''
    return `عدد النتائج: ${books.length}`
  }, [query, loading, books.length])

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 text-right">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28] flex items-center gap-2">
            <FiSearch className="text-[#C05370]" />
            نتائج البحث
          </h1>

          {query ? (
            <p className="text-sm text-gray-600 mt-2">
              🔍 البحث عن: <span className="font-bold text-[#4C7A68]">&quot;{query}&quot;</span>
              {countText && <span className="mr-2 text-gray-500">· {countText}</span>}
            </p>
          ) : (
            <p className="text-sm text-gray-600 mt-2">
              اكتب كلمة بحث في شريط البحث لعرض النتائج.
            </p>
          )}
        </div>

        {!query ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 text-center text-gray-700">
            لا يوجد بحث حالياً. جرّب البحث عن اسم كتاب 👌
          </div>
        ) : loading ? (
          <p className="text-gray-600">...جارٍ تحميل النتائج</p>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ❌ {error}
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 text-center">
            <p className="text-gray-700 font-semibold">لا توجد نتائج</p>
            <p className="text-sm text-gray-600 mt-2">جرّب كلمة مختلفة أو جزء من اسم الكتاب.</p>
            <Link href="/books" className="inline-flex mt-4 px-5 py-2.5 rounded-full bg-[#C05370] text-white hover:opacity-90 transition">
              تصفح كل الكتب
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => {
              const img =
                book.image?.startsWith('http') || book.image?.startsWith('/')
                  ? book.image
                  : '/placeholder.jpg'

              return (
                <Link key={book.id} href={`/books/${book.id}`} className="group">
                  <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="relative w-full h-60 bg-gray-50">
                      <Image
                        src={img}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="p-4 space-y-1">
                      <h3 className="text-[#C05370] font-extrabold line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500">{book.category}</p>

                      {book.price ? (
                        <p className="text-sm font-bold text-[#4C7A68]">
                          {Number(book.price).toLocaleString()} ل.س
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">السعر غير متوفر</p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
