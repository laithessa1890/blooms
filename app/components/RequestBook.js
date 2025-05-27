'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RequestBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !phone) {
      alert('يرجى إدخال اسم الكتاب ورقم الهاتف')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('book_requests').insert([
      {
        title,
        author,
        phone,
        notes,
      },
    ])

    setLoading(false)

    if (error) {
      alert('❌ حدث خطأ أثناء إرسال الطلب')
      console.error(error)
    } else {
      alert('✅ تم إرسال الطلب بنجاح')
      setTitle('')
      setAuthor('')
      setPhone('')
      setNotes('')
    }
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-10 text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-6">📚 اطلب كتاب غير موجود</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="اسم الكتاب المطلوب"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="اسم الكاتب (اختياري)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="tel"
          className="w-full border px-3 py-2 rounded"
          placeholder="رقم الهاتف للتواصل"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="ملاحظات إضافية (اختياري)"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C05370] text-white px-6 py-2 rounded hover:bg-[#a8405b]"
        >
          {loading ? '...جاري الإرسال' : '📩 إرسال الطلب'}
        </button>
      </form>
    </section>
  )
}
