'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function AllSeriesPage() {
  const [series, setSeries] = useState([])

  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setSeries(data)
    }

    fetchSeries()
  }, [])

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find((b) => b.id === item.id)
    if (!exists) {
      cart.push({ id: item.id, title: item.title, price: item.price })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تمت الإضافة إلى السلة')
    } else {
      alert('📦 هذه السلسلة موجودة مسبقًا في السلة')
    }
  }

  return (
    <section className="px-4 py-10 text-right" dir="rtl">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4C7A68] mb-6">📦 جميع السلاسل</h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {series.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
          >
            <Link href={`/series/${item.id}`} className="flex-1 block">
              <div className="relative w-full aspect-[2/3] bg-gray-100">
                <Image
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 text-center space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#4C7A68]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <p className="text-[#C05370] font-semibold">{item.price?.toLocaleString()} ل.س</p>
              </div>
            </Link>

            <button
              onClick={() => handleAddToCart(item)}
              className="bg-[#C05370] text-white py-2 hover:bg-[#a8405b] text-sm transition"
            >
              🛒 أضف إلى السلة
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
