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
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_discounted', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setBooks(data)
    }

    fetchBooks()
  }, [])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.find(b => b.id === book.id)) {
      cart.push({
        id: book.id,
        title: book.title,
        price: book.discount_price || book.price,
        image: book.image
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تمت إضافة الكتاب للسلة')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة')
    }
  }

  if (!books.length) return null

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col h-full relative">
      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">خصم</span>
      <Link href={`/books/${book.id}`} className="relative w-full h-56 bg-gray-100 block">
        <Image
          src={book.image || '/placeholder.jpg'}
          alt={book.title}
          fill
          className="object-contain"
        />
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-[#4C7A68] text-sm mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{book.description}</p>
        <p className="text-sm text-[#C05370] font-semibold mb-2">
          <span className="line-through text-gray-400 mr-2">{book.price?.toLocaleString()} ل.س</span>
          {book.discount_price?.toLocaleString()} ل.س
        </p>
        <button
          onClick={() => addToCart(book)}
          className="bg-[#C05370] text-white py-2 px-4 rounded text-sm hover:bg-[#a8405b] mt-auto"
        >
          🛒 أضف إلى السلة
        </button>
      </div>
    </div>
  )

  return (
    <section className="px-6 py-10 text-right" dir="rtl">
      <h2 className="text-3xl font-bold text-[#C05370] mb-6">🔥 أحدث العروض</h2>

      {/* Grid على الشاشات الكبيرة */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* سلايدر على الموبايل */}
      <div className="md:hidden">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
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

      {/* زر عرض كل العروض */}
      <div className="mt-6 text-center">
        <Link
          href="/offers"
          className="inline-block border-2 border-dashed border-[#C05370] text-[#C05370] font-semibold text-lg px-6 py-2 rounded-xl hover:bg-[#F4EDE4] transition"
        >
          👀 عرض كل العروض
        </Link>
      </div>
    </section>
  )
}
