'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function NewBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('فشل في جلب الكتب الجديدة:', error.message)
      } else {
        setBooks(data)
      }

      setLoading(false)
    }

    fetchBooks()
  }, [])

  const handleAddToCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const alreadyInCart = existingCart.find(item => item.id === book.id)

    if (!alreadyInCart) {
      existingCart.push({
        id: book.id,
        title: book.title,
        price: book.price
      })
      localStorage.setItem('cart', JSON.stringify(existingCart))
      alert('✅ تم إضافة الكتاب للسلة!')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة.')
    }
  }

  const BookCard = ({ book }) => {
    const imageSrc =
      book.image?.startsWith('http') || book.image?.startsWith('/')
        ? book.image
        : '/placeholder.jpg'

    return (
      <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
        <div className="relative w-full h-44 sm:h-60 md:h-72">
          <Image
            src={imageSrc}
            alt={book.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-md sm:text-lg font-semibold text-[#C05370]">{book.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{book.category}</p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">💰 {book.price} ل.س</p>
          </div>
          <button
            onClick={() => handleAddToCart(book)}
            className="mt-3 bg-[#C05370] text-white px-3 py-1.5 rounded hover:bg-[#a8405b] text-xs sm:text-sm"
          >
            أضف إلى السلة 🛒
          </button>
        </div>
      </div>
    )
  }

  if (loading || !books.length) return null

  return (
    <section className="px-4 py-10 text-right" dir="rtl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#4C7A68] mb-6">
        📚 الكتب الجديدة
      </h2>

      {/* شبكة على الشاشات الكبيرة */}
      <div className="hidden sm:grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map(book => (
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
          {books.map(book => (
            <SwiperSlide key={book.id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
