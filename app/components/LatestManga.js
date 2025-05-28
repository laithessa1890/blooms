'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function LatestManga() {
  const [manga, setManga] = useState([])

  useEffect(() => {
    const fetchManga = async () => {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setManga(data)
    }

    fetchManga()
  }, [])

  if (!manga.length) return null

  return (
    <section className="px-6 py-10 text-right" dir="rtl">
      <h2 className="text-3xl font-bold text-[#C05370] mb-6">📚 مانجا جديدة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {manga.map(item => (
          <Link
            href={`/manga/${item.id}`}
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
          >
            <div className="relative w-full h-56 bg-gray-100">
              <Image
                src={item.image || '/placeholder.jpg'}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#4C7A68] text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
            </div>
          </Link>
        ))}

        {/* زر عرض الكل */}
        <Link
          href="/manga"
          className="flex justify-center items-center border-2 border-dashed border-[#C05370] rounded-xl text-[#C05370] text-lg font-semibold hover:bg-[#F4EDE4] transition"
        >
          👀 عرض كل المانجا
        </Link>
      </div>
    </section>
  )
}
