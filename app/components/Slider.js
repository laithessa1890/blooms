'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const topBooks = [
  {
    id: 1,
    title: 'digital marketing strategy',
    price: 80000,
    image: '/81NnXHIaXGL.jpg',
  },
  {
    id: 2,
    title: 'powerless series',
    price: 350000,
    image: '/81p2rIrcUsL._SL1500_.jpg',
  },
  {
    id: 3,
    title: 'MURDLE',
    price: 350000,
    image: '/719kIyOoYUL._SL1500_.jpg',
  },
  {
    id: 4,
    title: 'hunting adeline',
    price: 160000,
    image: '/s-l960.webp',
  },
]

export default function TopBooks() {
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  const BookCard = ({ book }) => (
    <div className="bg-[#EDE3D2] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
      <div className="w-full h-52 sm:h-64 bg-white flex items-center justify-center p-4">
        <img
          src={book.image}
          alt={book.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-4 text-center space-y-2 flex-1">
        <h3 className="text-sm sm:text-lg font-bold text-[#4C7A68]">{book.title}</h3>
        <p className="text-sm sm:text-base text-[#C05370] font-semibold">
          {book.price.toLocaleString()} ل.س
        </p>
      </div>
      <button
        onClick={() => addToCart(book)}
        className="bg-[#C05370] text-white text-sm py-1.5 hover:bg-[#a8405b] transition"
      >
        🛒 أضف إلى السلة
      </button>
    </div>
  )

  return (
    <section className="px-4 py-10 space-y-6 bg-[#F4EDE4]" dir="rtl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#C05370] text-center mb-6">
        📈 الأكثر مبيعًا هذا الشهر
      </h2>

      {/* عرض الشبكة على الشاشات الكبيرة */}
      <div className="hidden sm:grid gap-4 grid-cols-2 md:grid-cols-3">
        {topBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* سلايدر على الموبايل فقط */}
      <div className="sm:hidden">
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
          {topBooks.map((book) => (
            <SwiperSlide key={book.id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
