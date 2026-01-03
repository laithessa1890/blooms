'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiArrowRight, FiTag } from 'react-icons/fi'

export default function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ فشل جلب تفاصيل الكتاب:', error.message || error)
        setBook(null)
      } else {
        setBook(data)
      }

      setLoading(false)
    }

    if (id) fetchBook()
  }, [id])

  const imageSrc = useMemo(() => {
    const img = book?.image
    if (!img) return '/placeholder.jpg'
    if (img.startsWith('http') || img.startsWith('/')) return img
    return '/placeholder.jpg'
  }, [book])

  const handleAddToCart = (b) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const alreadyInCart = existingCart.find((item) => item.id === b.id)

    if (!alreadyInCart) {
      existingCart.push({
        id: b.id,
        title: b.title,
        price: b.price,
        image: b.image,
      })
      localStorage.setItem('cart', JSON.stringify(existingCart))
      alert('✅ تم إضافة الكتاب للسلة!')
    } else {
      alert('📚 هذا الكتاب موجود مسبقًا في السلة.')
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 animate-pulse">
            <div className="h-6 w-40 bg-gray-100 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[420px] bg-gray-100 rounded-2xl" />
              <div className="space-y-3">
                <div className="h-8 bg-gray-100 rounded w-2/3" />
                <div className="h-5 bg-gray-100 rounded w-1/3" />
                <div className="h-6 bg-gray-100 rounded w-1/2" />
                <div className="h-28 bg-gray-100 rounded" />
                <div className="h-11 bg-gray-100 rounded-full w-52" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="rounded-3xl border bg-white/70 backdrop-blur p-8">
            <p className="text-lg font-bold text-gray-800">❌ لم يتم العثور على هذا الكتاب</p>
            <Link href="/books" className="inline-block mt-4 text-[#C05370] hover:underline">
              العودة لقائمة الكتب
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <span>/</span>
          <Link href="/books" className="hover:underline">الكتب</Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold line-clamp-1">{book.title}</span>
        </div>

        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-5 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* صورة الغلاف */}
            <div className="rounded-3xl bg-white border shadow-sm overflow-hidden">
              <div className="relative w-full aspect-[3/4] bg-gray-50">
                <Image
                  src={imageSrc}
                  alt={book.title}
                  fill
                  className="object-contain p-5 transition-transform duration-300 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* شريط تحت الصورة */}
              <div className="p-4 flex items-center justify-between text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <FiTag /> {book.category || 'بدون تصنيف'}
                </span>
                <Link href="/books" className="text-[#C05370] hover:underline inline-flex items-center gap-2">
                  <FiArrowRight /> رجوع
                </Link>
              </div>
            </div>

            {/* معلومات الكتاب */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
                {book.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {book.category && (
                  <span className="px-3 py-1 rounded-full text-xs border bg-white">
                    📂 {book.category}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs border bg-white">
                  ✅ متوفر
                </span>
              </div>

              <div className="rounded-2xl border bg-white p-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">السعر</div>
                <div className="text-lg md:text-xl font-extrabold text-[#C05370]">
                  {book.price ? Number(book.price).toLocaleString() : 'غير متوفر'} ل.س
                </div>
              </div>

              {book.description && (
                <div className="rounded-2xl border bg-white p-4">
                  <h2 className="text-base font-bold text-[#4C7A68] mb-2">📖 لمحة عن الكتاب</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-[15px]">
                    {book.description}
                  </p>
                </div>
              )}

              {/* أزرار */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(book)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C05370] text-white hover:opacity-90 transition"
                >
                  <FiShoppingCart /> أضف إلى السلة
                </button>

                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border bg-white hover:bg-gray-50 transition"
                >
                  عرض السلة
                </Link>
              </div>

              {/* ملاحظة صغيرة */}
              <p className="text-xs text-gray-500">
                * قد تختلف الألوان قليلًا حسب شاشة الجهاز.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
