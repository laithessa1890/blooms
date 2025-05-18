'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function LatestSeries() {
  const [series, setSeries] = useState([])

  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      if (!error) setSeries(data)
    }

    fetchSeries()
  }, [])

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find(b => b.id === item.id)
    if (!exists) {
      cart.push({ id: item.id, title: item.title, price: item.price })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert(`✅ تمت إضافة "${item.title}" إلى السلة`)
    } else {
      alert('📚 هذه السلسلة موجودة مسبقًا في السلة')
    }
  }

  if (!series.length) return null

  return (
    <section className="px-6 py-10 text-right" dir="rtl">
      <h2 className="text-3xl font-bold text-[#C05370] mb-6">📦 سلاسل مميزة</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {series.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
          >
            <Link href={`/series/${item.id}`}>
              <div className="relative w-full h-72 bg-white flex items-center justify-center p-4">
                <Image
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="p-4 text-center space-y-2 flex-1">
              <h3 className="text-lg font-bold text-[#4C7A68]">{item.title}</h3>
              <p className="text-[#C05370] font-semibold">
                {item.price?.toLocaleString()} ل.س
              </p>
            </div>

            <button
              onClick={() => addToCart(item)}
              className="bg-[#C05370] text-white py-2 hover:bg-[#a8405b] transition"
            >
              🛒 أضف إلى السلة
            </button>
          </div>
        ))}

        {/* كارد زر عرض الكل */}
        <Link
          href="/series"
          className="flex justify-center items-center border-2 border-dashed border-[#C05370] rounded-xl text-[#C05370] text-lg font-semibold hover:bg-[#F4EDE4] transition"
        >
          👀 عرض كل السلاسل
        </Link>
      </div>
    </section>
  )
}
