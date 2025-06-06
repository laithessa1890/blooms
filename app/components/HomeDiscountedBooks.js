'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function HomeDiscountedBooks() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchDiscounted = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_discounted', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setBooks(data)
    }

    fetchDiscounted()
  }, [])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.find(b => b.id === book.id)) {
      cart.push(book)
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تمت إضافة الكتاب للسلة')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة')
    }
  }

  if (!books.length) return null

  const BookCard = ({ book }) => (
    <div className="min-w-[70%] bg-white rounded-xl shadow-md overflow-hidden flex flex-col relative">
      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">خصم</span>
      <Link href={`/books/${book.id}`} className="block flex-1">
        <div className="relative w-full aspect-[2/3] bg-gray-100">
          <Image
            src={book.image || '/placeholder.jpg'}
            alt={book.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="p-4 text-center space-y-1">
          <h3 className="text-sm font-bold text-[#4C7A68] line-clamp-2">{book.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{book.description}</p>
          <p className="text-sm text-[#C05370] font-semibold">
            <span className="line-through text-gray-400 mr-2">
              {book.price?.toLocaleString()} ل.س
            </span>
            {book.discount_price?.toLocaleString()} ل.س
          </p>
        </div>
      </Link>
      <button
        onClick={() => addToCart(book)}
        className="bg-[#C05370] text-white text-sm py-2 hover:bg-[#a8405b] transition"
      >
        🛒 أضف إلى السلة
      </button>
    </div>
  )

  return (
    <section className="px-4 py-10 text-right" dir="rtl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#C05370] mb-6">🔥 أحدث العروض</h2>

      {/* ✅ سلايدر على الموبايل */}
      <div className="md:hidden">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="pb-6"
        >
          {books.map(book => (
            <SwiperSlide key={book.id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✅ شبكة على الشاشات الكبيرة */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map(book => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col relative min-h-[520px]"
          >
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">خصم</span>

            <Link href={`/books/${book.id}`} className="block flex-1">
              <div className="relative w-full aspect-[2/3] bg-gray-100">
                <Image
                  src={book.image || '/placeholder.jpg'}
                  alt={book.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 text-center space-y-2">
                <h3 className="text-sm font-bold text-[#4C7A68] line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{book.description}</p>
                <p className="text-sm mt-1 text-[#C05370] font-semibold">
                  <span className="line-through text-gray-400 mr-2">
                    {book.price?.toLocaleString()} ل.س
                  </span>
                  {book.discount_price?.toLocaleString()} ل.س
                </p>
              </div>
            </Link>

            <button
              onClick={() => addToCart(book)}
              className="bg-[#C05370] text-white text-sm py-2 hover:bg-[#a8405b] transition"
            >
              🛒 أضف إلى السلة
            </button>
          </div>
        ))}
      </div>

      {/* زر عرض كل العروض */}
      <div className="mt-6 text-center">
        <Link
          href="/offers"
          className="inline-block bg-[#F4EDE4] text-[#C05370] border border-[#C05370] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#f9eae0] transition"
        >
          👀 عرض جميع العروض
        </Link>
      </div>
    </section>
  )
}
