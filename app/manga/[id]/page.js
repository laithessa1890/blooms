'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MangaDetailsPage() {
  const { id } = useParams()
  const [manga, setManga] = useState(null)
  const [chapter, setChapter] = useState(1)
  const [language, setLanguage] = useState('ar')
  const [cover, setCover] = useState('paperback')

  useEffect(() => {
    const fetchManga = async () => {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) setManga(data)
    }

    fetchManga()
  }, [id])

  const getFinalPrice = () => {
    if (!manga) return 0
    return cover === 'hardcover' ? manga.price + 15000 : manga.price
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({
      id: `${manga.id}-${chapter}-${language}-${cover}`,
      title: `${manga.title} - فصل ${chapter} (${language === 'ar' ? 'عربي' : 'إنكليزي'}) - ${cover}`,
      price: getFinalPrice(),
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('✅ تمت الإضافة إلى السلة')
  }

  if (!manga) return <p className="text-center py-10">جاري تحميل التفاصيل...</p>

  return (
    <section className="px-6 py-10 text-right max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-4">{manga.title}</h1>
      <img src={manga.image} alt={manga.title} className="w-64 mx-auto mb-6" />

      <div className="space-y-4">
        <div>
          <label>📘 اختر رقم المجلد:</label>
          <select
            className="border p-2 rounded w-full mt-1"
            value={chapter}
            onChange={(e) => setChapter(Number(e.target.value))}
          >
            {Array.from({ length: manga.chapters }, (_, i) => (
              <option key={i + 1} value={i + 1}>مجلد {i + 1}</option>
            ))}
          </select>
        </div>

        <div>
          <label>🌐 اختر اللغة:</label>
          <select
            className="border p-2 rounded w-full mt-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ar">عربي</option>
            <option value="en">إنكليزي</option>
          </select>
        </div>

        <div>
          <label>📦 نوع الغلاف:</label>
          <select
            className="border p-2 rounded w-full mt-1"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          >
            <option value="paperback">Paperback</option>
            <option value="hardcover">Hardcover (+15,000 ل.س)</option>
          </select>
          {cover === 'hardcover' && (
            <p className="text-sm text-red-600 mt-1">
              💡 تم إضافة 15,000 ل.س بسبب اختيار غلاف Hardcover
            </p>
          )}
        </div>

        <p className="font-semibold text-lg text-[#4C7A68]">
          💰 السعر: {getFinalPrice().toLocaleString()} ل.س
        </p>

        <button
          onClick={handleAddToCart}
          className="bg-[#C05370] text-white py-2 px-4 rounded hover:bg-[#a8405b]"
        >
          🛒 أضف إلى السلة
        </button>
      </div>
    </section>
  )
}
