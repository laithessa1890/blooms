'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuid } from 'uuid'

export default function AddMangaPage() {
  const [title, setTitle] = useState('')
  const [chapters, setChapters] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''
    if (imageFile) {
      const fileName = `${Date.now()}_${uuid()}`
      const { error: uploadError } = await supabase.storage
        .from('book-images')
        .upload(`manga/${fileName}`, imageFile)

      if (uploadError) {
        alert('❌ فشل رفع الصورة')
        console.error(uploadError)
        setLoading(false)
        return
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/book-images/manga/${fileName}`
    }

    const { error } = await supabase.from('manga').insert([
      {
        title,
        chapters: Number(chapters),
        price: Number(price),
        image: imageUrl
      }
    ])

    setLoading(false)

    if (error) {
      alert('❌ خطأ أثناء الإضافة')
      console.error(error)
    } else {
      alert('✅ تم إضافة المانجا بنجاح')
      setTitle('')
      setChapters('')
      setPrice('')
      setImageFile(null)
    }
  }

  return (
    <section className="text-right px-6 py-8 max-w-xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-[#4C7A68] mb-6">➕ إضافة مانجا جديدة</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">اسم المانجا</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">عدد الفصول</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={chapters}
            onChange={(e) => setChapters(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">السعر (ل.س)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">صورة الغلاف</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#C05370] text-white px-6 py-2 rounded hover:bg-[#a8405b]"
        >
          {loading ? '...جاري الإرسال' : 'إضافة'}
        </button>
      </form>
    </section>
  )
}
