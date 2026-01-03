'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { FiShoppingCart } from 'react-icons/fi'

const topBooks = [
  { id: 1, title: 'Digital Marketing Strategy', price: 80000, image: '/81NnXHIaXGL.jpg' },
  { id: 2, title: 'Powerless Series', price: 350000, image: '/81p2rIrcUsL._SL1500_.jpg' },
  { id: 3, title: 'MURDLE', price: 350000, image: '/719kIyOoYUL._SL1500_.jpg' },
  { id: 4, title: 'Hunting Adeline', price: 160000, image: '/s-l960.webp' },
]

export default function TopBooks() {
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  const BookCard = ({ book }) => (
    <div className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* صورة */}
      <div className="relative w-full h-52 sm:h-60 bg-gray-50">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] px-3 py-1 rounded-full bg-white/90 border border-white/60 text-[#C05370] font-bold">
            الأكثر مبيعًا
          </span>
        </div>
      </div>

      {/* معلومات */}
      <div className="p-4 text-right space-y-2 flex-1">
        <h3 className="text-sm sm:text-base font-extrabold text-[#2E2A28] line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm sm:text-base text-[#C05370] font-extrabold">
          {Number(book.price).toLocaleString()} ل.س
        </p>
      </div>

      {/* زر */}
      <div className="p-4 pt-0">
        <button
          onClick={() => addToCart(book)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4C7A68] text-white text-sm py-2.5 hover:opacity-95 transition"
        >
          <FiShoppingCart /> أضف إلى السلة
        </button>
      </div>
    </div>
  )

  return (
    <section className="space-y-5" dir="rtl">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A28]">
            📈 الأكثر مبيعًا <span className="text-[#C05370]">هذا الشهر</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">اختيارات مميزة بناءً على طلبات العملاء</p>
        </div>
      </div>

      {/* Grid على الشاشات الكبيرة */}
      <div className="hidden sm:grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {topBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Slider على الموبايل */}
      <div className="sm:hidden">
        <Swiper
          spaceBetween={14}
          slidesPerView={1.15}
          loop
          autoplay={{ delay: 2800, disableOnInteraction: false }}
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
