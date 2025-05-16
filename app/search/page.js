'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .ilike('title', `%${query}%`)
      
      if (!error) setBooks(data)
      setLoading(false)
    }

    fetchResults()
  }, [query])

  return (
    <section className="px-6 py-10 text-right" dir="rtl">
      <h1 className="text-2xl font-bold mb-4 text-[#4C7A68]">
        🔍 نتائج البحث عن: &quot;{query}&quot;
      </h1>

      {loading ? (
        <p>...جارٍ تحميل النتائج</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">لا توجد نتائج</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {books.map(book => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden">
                <div className="relative w-full h-60 bg-gray-100">
                  <Image src={book.image} alt={book.title} fill className="object-contain" />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-[#C05370] font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.category}</p>
                  <p className="text-sm text-[#4C7A68]">{book.price} ل.س</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
