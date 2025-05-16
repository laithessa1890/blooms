'use client'

import { useState } from 'react'

const topBooks = [
  {
    id: 1,
    title: 'فكر بعقل طفلك',
    price: 50000,
    image: '/ASDGFASDG.jpg',
  },
  {
    id: 2,
    title: 'سلسلة مملكة البلاغة',
    price: 270000,
    image: '/sdgasdg.JPG',
  },
  {
    id: 3,
    title: 'سلسلة حطمني',
    price: 350000,
    image: '/adgfadfg.jpg',
  },
]

export default function TopBooks() {
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <section className="px-4 py-10 space-y-6 bg-[#F4EDE4]" dir="rtl">
      <h2 className="text-3xl font-bold text-[#C05370] text-center mb-6">📈 الأكثر مبيعًا هذا الشهر</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {topBooks.map((book) => (
          <div
            key={book.id}
            className="bg-[#EDE3D2] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
          >
            <div className="w-full h-72 bg-white flex items-center justify-center p-4">
              <img
                src={book.image}
                alt={book.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4 text-center space-y-2 flex-1">
              <h3 className="text-lg font-bold text-[#4C7A68]">{book.title}</h3>
              <p className="text-[#C05370] font-semibold">{book.price.toLocaleString()} ل.س</p>
            </div>
            <button
              onClick={() => addToCart(book)}
              className="bg-[#C05370] text-white py-2 hover:bg-[#a8405b] transition"
            >
              🛒 أضف إلى السلة
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
