'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function BooksDashboard() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      alert('فشل في تحميل الكتب 😢')
      console.error(error)
    } else {
      setBooks(data)
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكدة أنك تريدين حذف هذا الكتاب؟')) return

    const { error } = await supabase.from('books').delete().eq('id', id)

    if (error) {
      alert('حدث خطأ أثناء الحذف')
      console.error(error)
    } else {
      // حذف من الواجهة مباشرة
      setBooks(prev => prev.filter(book => book.id !== id))
    }
  }

  return (
    <section className="text-right px-6 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6">📚 جميع الكتب المضافة</h1>

      {loading ? (
        <p>...جارٍ التحميل</p>
      ) : books.length === 0 ? (
        <p className="text-gray-600">لا توجد كتب حتى الآن.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map(book => {
            const imageSrc =
              book.image?.startsWith('http') || book.image?.startsWith('/')
                ? book.image
                : '/placeholder.jpg'

            return (
              <div key={book.id} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                <div className="relative w-full h-60">
                  <Image
                    src={imageSrc}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-[#4C7A68]">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.category}</p>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    حذف 🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
