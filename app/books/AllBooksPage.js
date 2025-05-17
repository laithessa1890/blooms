'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function AllBooksPage() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      let query = supabase.from('books').select('*').order('created_at', { ascending: false })

      if (filter) {
        query = query.eq('category', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ خطأ أثناء جلب الكتب:', error.message || error)
      } else {
        setBooks(data)
      }

      setLoading(false)
    }

    fetchBooks()
  }, [filter])

  const addToCart = (book) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const newCart = [...currentCart, book]
    localStorage.setItem('cart', JSON.stringify(newCart))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <section dir="rtl" className="px-4 py-10 text-right">
      <h1 className="text-3xl font-bold text-[#4C7A68] mb-6">
        📚 {filter ? `كتب التصنيف: ${filter}` : 'جميع الكتب'}
      </h1>

      {loading ? (
        <p>...جارٍ تحميل الكتب</p>
      ) : books.length === 0 ? (
        <p className="text-gray-600">لا توجد كتب في هذا التصنيف.</p>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {books.map(book => (
            <div key={book.id} className="bg-white rounded-xl shadow hover:shadow-md transition flex flex-col overflow-hidden">
              <Link href={`/books/${book.id}`} className="flex-1">
                <div className="relative w-full h-72 bg-gray-100">
                  <Image
                    src={book.image || '/placeholder.jpg'}
                    alt={book.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-md font-bold text-[#4C7A68]">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.category}</p>
                  {book.price && (
                    <p className="text-sm text-[#C05370] font-semibold">
                      {book.price.toLocaleString()} ل.س
                    </p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => addToCart(book)}
                className="bg-[#4C7A68] text-white text-sm py-2 mt-auto hover:bg-[#3a5e52] transition"
              >
                🛒 أضف إلى السلة
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
