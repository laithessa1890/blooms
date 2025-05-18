'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function SeriesDetailsPage() {
  const { id } = useParams()
  const [series, setSeries] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('id', id)
        .single()
      if (!error) setSeries(data)
      setLoading(false)
    }

    if (id) fetchSeries()
  }, [id])

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find(item => item.id === series.id)
    if (!exists) {
      cart.push({
        id: series.id,
        title: series.title,
        price: series.price
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ تمت إضافة السلسلة إلى السلة')
    } else {
      alert('📦 هذه السلسلة موجودة مسبقاً في السلة')
    }
  }

  if (loading) return <p className="text-center py-10">...جارٍ تحميل التفاصيل</p>
  if (!series) return <p className="text-center py-10">❌ لم يتم العثور على السلسلة</p>

  return (
    <section className="px-6 py-10 max-w-6xl mx-auto text-right" dir="rtl">
      <Link href="/series" className="text-sm text-[#C05370] hover:underline block mb-6">
        ← العودة إلى قائمة السلاسل
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* صورة السلسلة */}
        <div className="w-full bg-white rounded-xl shadow overflow-hidden">
          <Image
            src={series.image || '/placeholder.jpg'}
            alt={series.title}
            width={600}
            height={800}
            className="object-contain w-full h-auto rounded-xl"
          />
        </div>

        {/* معلومات السلسلة */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-[#4C7A68]">{series.title}</h1>
          <p className="text-sm text-gray-600">📂 التصنيف: سلسلة</p>
          <p className="text-lg text-[#C05370] font-semibold">💰 السعر: {series.price.toLocaleString()} ل.س</p>

          {series.description && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2 text-[#4C7A68]">📖 لمحة عن السلسلة</h2>
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">{series.description}</p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-[#C05370] text-white px-6 py-3 rounded hover:bg-[#a8405b]"
          >
            اطلب الآن 🛒
          </button>
        </div>
      </div>
    </section>
  )
}
