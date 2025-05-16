'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function AddBookPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('arabic')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''

    if (imageFile) {
      const fileName = `${Date.now()}_${uuid()}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('book-images')
        .upload(`books/${fileName}`, imageFile)

      if (uploadError) {
        alert('❌ فشل رفع الصورة')
        console.error(uploadError)
        setLoading(false)
        return
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/book-images/books/${fileName}`
    }

    const { data, error } = await supabase.from('books').insert([
      { title, category, description, price, image: imageUrl }
    ])

    setLoading(false)

    if (error) {
      alert('خطأ أثناء الإضافة: ' + error.message)
    } else {
      alert('📚 تم إضافة الكتاب بنجاح ✅')
      setTitle('')
      setCategory('arabic')
      setDescription('')
      setPrice('')
      setImageFile(null)
    }
  }

  return (
    <section className="text-right px-6 py-8 max-w-2xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-[#4C7A68] mb-6">إضافة كتاب جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">عنوان الكتاب</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">التصنيف</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="arabic">كتب عربية</option>
            <option value="english">كتب إنجليزية</option>
            <option value="kids">كتب أطفال</option>
            <option value="moms">كتب للأمهات</option>
            <option value="original">كتب أصلية</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">الوصف</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">السعر (جنيه)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">اختيار صورة من الجهاز</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#C05370] text-white px-6 py-2 rounded hover:bg-[#a8405b]"
        >
          {loading ? '...يتم الإرسال' : 'إضافة'}
        </button>
      </form>
    </section>
  )
}
