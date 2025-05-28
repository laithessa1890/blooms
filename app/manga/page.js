'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function MangaPage() {
  const [mangaList, setMangaList] = useState([])

  useEffect(() => {
    const fetchManga = async () => {
      const { data, error } = await supabase.from('manga').select('*').order('created_at', { ascending: false })
      if (!error) setMangaList(data)
    }

    fetchManga()
  }, [])

  const addToCart = (manga) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, manga]))
    alert(`✅ تمت إضافة "${manga.title}" إلى السلة`)
  }

  return (
    <main className="bg-[#F4EDE4] min-h-screen px-4 py-8 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6 text-center">📚 كل المانجا</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mangaList.map((manga) => (
          <div key={manga.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <Link href={`/manga/${manga.id}`}>
              <div className="relative w-full h-64 bg-gray-100 cursor-pointer">
                <Image
                  src={manga.image}
                  alt={manga.title}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="p-4 space-y-1 flex-1">
              <h3 className="text-md font-bold text-[#C05370]">{manga.title}</h3>
              <p className="text-sm text-gray-600">📖 عدد الفصول: {manga.chapters}</p>
              <p className="text-sm text-gray-700">💰 {manga.price.toLocaleString()} ل.س</p>
            </div>
            
          </div>
        ))}
      </div>
    </main>
  )
}
