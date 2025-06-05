'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function LatestSeries() {
  const [series, setSeries] = useState([])

  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setSeries(data)
    }

    fetchSeries()
  }, [])

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, {
      id: `series-${item.id}`,
      title: item.title,
      price: item.price,
      image: item.image
    }]))
    alert(`✅ تمت إضافة "${item.title}" إلى السلة`)
  }

  if (!series.length) return null

  const SeriesCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col h-full">
      <Link href={`/series/${item.id}`} className="relative w-full h-56 bg-gray-100 block">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain"
        />
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-[#4C7A68] text-md mb-1">{item.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{item.price?.toLocaleString()} ل.س</p>
        <button
          onClick={() => addToCart(item)}
          className="bg-[#C05370] text-white py-2 px-4 rounded text-sm hover:bg-[#a8405b] mt-auto"
        >
          🛒 أضف إلى السلة
        </button>
      </div>
    </div>
  )

  return (
    <section className="px-6 py-10 text-right" dir="rtl">
      <h2 className="text-3xl font-bold text-[#C05370] mb-6">📦 سلاسل جديدة</h2>

      {/* ✅ Grid للديسكتوب */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {series.map(item => (
          <SeriesCard key={item.id} item={item} />
        ))}
      </div>

      {/* ✅ سلايدر للموبايل */}
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
          {series.map(item => (
            <SwiperSlide key={item.id}>
              <SeriesCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✅ زر عرض الكل (مشترك) */}
      <div className="mt-6 text-center">
        <Link
          href="/series"
          className="inline-block border-2 border-dashed border-[#C05370] text-[#C05370] font-semibold text-lg px-6 py-2 rounded-xl hover:bg-[#F4EDE4] transition"
        >
          👀 عرض كل السلاسل
        </Link>
      </div>
    </section>
  )
}
