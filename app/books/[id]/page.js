'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ فشل جلب تفاصيل الكتاب:', error.message || error)
      } else {
        setBook(data)
      }

      setLoading(false)
    }

    if (id) fetchBook()
  }, [id])

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

  if (loading) return <p className="text-center py-10">...جارٍ تحميل تفاصيل الكتاب</p>
  if (!book) return <p className="text-center py-10">❌ لم يتم العثور على هذا الكتاب</p>

  const imageSrc =
    book.image?.startsWith('http') || book.image?.startsWith('/')
      ? book.image
      : '/placeholder.jpg'

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto text-right" dir="rtl">
      <Link href="/books" className="text-[#C05370] hover:underline block mb-6 text-sm">
        ← العودة إلى قائمة الكتب
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* صورة الغلاف */}
        <div className="w-full bg-white rounded-xl shadow overflow-hidden">
          <Image
            src={imageSrc}
            alt={book.title}
            layout="responsive"
            width={500}
            height={700}
            className="object-contain rounded-xl"
          />
        </div>

        {/* معلومات الكتاب */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-[#4C7A68]">{book.title}</h1>
          <p className="text-sm text-gray-600">📂 التصنيف: {book.category}</p>
          <p className="text-lg text-[#C05370] font-semibold">💰 السعر: {book.price} ل.س</p>

          {book.description && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2 text-[#4C7A68]">📖 لمحة عن الكتاب</h2>
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">{book.description}</p>
            </div>
          )}

          <button
            onClick={() => handleAddToCart(book)}
            className="mt-6 bg-[#C05370] text-white px-6 py-3 rounded hover:bg-[#a8405b]"
          >
            اطلب الآن 🛒
          </button>
        </div>
      </div>
    </section>
  )
}
