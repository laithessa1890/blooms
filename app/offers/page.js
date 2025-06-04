'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function OffersPage() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchDiscountedBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_discounted', true)
        .order('created_at', { ascending: false })

      if (!error) setBooks(data)
    }

    fetchDiscountedBooks()
  }, [])

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find((b) => b.id === book.id)

    if (!exists) {
      cart.push({
        id: book.id,
        title: book.title,
        price: book.discount_price || book.price,
        image: book.image,
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تم إضافة الكتاب للسلة!')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة.')
    }
  }

  if (!books.length) return (
    <section className="px-6 py-10 text-center" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6">🔥 عروض خاصة</h1>
      <p className="text-gray-600">ما في عروض حالياً... تابعنا لتشوف الجديد!</p>
    </section>
  )

  return (
    <section className="px-6 py-10 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6">🔥 عروض خاصة على الكتب</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map(book => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col relative"
          >
            {/* شارة خصم */}
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              خصم!
            </span>

            <Link href={`/books/${book.id}`} className="flex-1 block">
              <div className="relative w-full aspect-[2/3] bg-gray-100">
                <Image
                  src={book.image || '/placeholder.jpg'}
                  alt={book.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 text-center space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#4C7A68]">{book.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{book.description}</p>
                <p className="text-sm text-[#C05370] font-semibold">
                  <span className="line-through text-gray-400 mr-2">
                    {book.price?.toLocaleString()} ل.س
                  </span>
                  {book.discount_price?.toLocaleString()} ل.س
                </p>
              </div>
            </Link>

            <button
              onClick={() => handleAddToCart(book)}
              className="bg-[#C05370] text-white py-2 text-sm hover:bg-[#a8405b] transition"
            >
              🛒 أضف إلى السلة
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
