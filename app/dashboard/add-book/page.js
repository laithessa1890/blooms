'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuid } from 'uuid'
import Image from 'next/image'
import { FiPlus, FiTrash2, FiSave, FiSearch, FiImage } from 'react-icons/fi'

export default function AddBookPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('english') // ✅ افتراضي
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [updatedPrices, setUpdatedPrices] = useState({})
  const [query, setQuery] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // preview
  const previewUrl = useMemo(() => {
    if (!imageFile) return ''
    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    fetchBooks()
    return () => {
      // تنظيف preview
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setBooks(data || [])
  }

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter((b) => {
      const t = (b?.title || '').toLowerCase()
      const c = (b?.category || '').toLowerCase()
      return t.includes(q) || c.includes(q)
    })
  }, [books, query])

  const resetForm = () => {
    setTitle('')
    setCategory('english')
    setDescription('')
    setPrice('')
    setImageFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let imageUrl = ''

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}_${uuid()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('book-images')
          .upload(`books/${fileName}`, imageFile)

        if (uploadError) {
          setLoading(false)
          setError('❌ فشل رفع الصورة')
          console.error(uploadError)
          return
        }

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/book-images/books/${fileName}`
      }

      const { error: insertError } = await supabase.from('books').insert([
        {
          title: title.trim(),
          category,
          description: description.trim(),
          price: Number(price),
          image: imageUrl || null,
        },
      ])

      setLoading(false)

      if (insertError) {
        setError('خطأ أثناء الإضافة: ' + insertError.message)
        return
      }

      setSuccess('📚 تم إضافة الكتاب بنجاح ✅')
      resetForm()
      fetchBooks()
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError('حدث خطأ غير متوقع ❌')
    }
  }

  const handleDelete = async (id) => {
    const ok = confirm('هل أنت متأكد من حذف هذا الكتاب؟')
    if (!ok) return

    const { error } = await supabase.from('books').delete().eq('id', id)
    if (!error) {
      setSuccess('✅ تم حذف الكتاب')
      fetchBooks()
    } else {
      setError('❌ فشل الحذف')
    }
  }

  const handleUpdatePrice = async (id) => {
    const newPrice = updatedPrices[id]
    if (!newPrice) return

    const { error } = await supabase.from('books').update({ price: Number(newPrice) }).eq('id', id)

    if (!error) {
      setSuccess('✅ تم تحديث السعر')
      fetchBooks()
    } else {
      setError('❌ فشل تحديث السعر')
    }
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-6 text-right">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
            📘 إضافة كتاب جديد
          </h1>
          <p className="text-sm text-gray-600 mt-1">أضف كتاب مع صورة وسعر وتصنيف</p>
        </div>

        {/* رسائل */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">عنوان الكتاب</label>
              <input
                type="text"
                placeholder="مثال: Atomic Habits"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">التصنيف</label>
              <select
                className="w-full border px-4 py-2.5 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {/* ✅ حذف العربية + الأمهات */}
                <option value="english">كتب إنجليزية</option>
                <option value="kids">كتب أطفال</option>
                <option value="original">كتب أصلية</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">السعر</label>
              <input
                type="number"
                placeholder="مثال: 250000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">الوصف (اختياري)</label>
              <textarea
                placeholder="لمحة قصيرة عن الكتاب..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-4 py-3 rounded-2xl min-h-[110px]"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block mb-1 text-sm font-medium">صورة الغلاف</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full border px-4 py-2 rounded-2xl bg-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  يفضّل صورة واضحة (JPG/PNG)
                </p>
              </div>

              {/* Preview */}
              <div className="rounded-2xl border bg-gray-50 overflow-hidden">
                <div className="relative w-full aspect-[3/2]">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm gap-2">
                      <FiImage /> معاينة الصورة
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-[#C05370] text-white px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
              >
                <FiPlus />
                {loading ? '...يتم الإرسال' : 'إضافة الكتاب'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 border px-6 py-3 rounded-full bg-white hover:bg-gray-50 transition"
              >
                مسح الحقول
              </button>
            </div>
          </form>
        </div>

        {/* Books List */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-extrabold text-[#2E2A28]">📚 الكتب الحالية</h2>

            <div className="relative w-full md:w-80">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالعنوان أو التصنيف..."
                className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white"
              />
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <p className="text-gray-600">لا توجد كتب لعرضها.</p>
          ) : (
            <ul className="space-y-3">
              {filteredBooks.map((book) => (
                <li key={book.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-extrabold text-[#4C7A68] truncate">{book.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        التصنيف: <span className="font-semibold">{book.category}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(book.id)}
                      className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                    >
                      <FiTrash2 /> حذف
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                      type="number"
                      className="border px-4 py-2 rounded-full w-full sm:w-44"
                      value={updatedPrices[book.id] ?? book.price ?? ''}
                      onChange={(e) =>
                        setUpdatedPrices((prev) => ({ ...prev, [book.id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => handleUpdatePrice(book.id)}
                      className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
                    >
                      <FiSave /> تحديث السعر
                    </button>

                    <div className="sm:mr-auto text-sm text-[#C05370] font-bold">
                      {Number(book.price || 0).toLocaleString()} ل.س
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
