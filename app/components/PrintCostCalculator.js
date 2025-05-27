'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PrintCostCalculator() {
  const [pages, setPages] = useState('')
  const [total, setTotal] = useState(null)
  const [bookTitle, setBookTitle] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const calculate = () => {
    if (!pages || isNaN(pages) || pages <= 0) {
      alert('يرجى إدخال عدد صفحات صالح')
      return
    }
    const result = Number(pages) * 200 + 20000
    setTotal(result)
    setStep(2)
  }

  const reset = () => {
    setPages('')
    setTotal(null)
    setBookTitle('')
    setFullName('')
    setPhone('')
    setStep(1)
  }

  const handleSubmit = async () => {
    if (!bookTitle || !fullName || !phone || !pages) {
      alert('يرجى تعبئة جميع الحقول')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('print_requests').insert([
      {
        book_title: bookTitle,
        full_name: fullName,
        phone,
        pages: Number(pages),
        total_price: total,
      },
    ])
    setLoading(false)
    if (error) {
      console.error(error)
      alert('❌ حدث خطأ أثناء إرسال الطلب')
    } else {
      alert('✅ تم إرسال الطلب بنجاح')
      reset()
    }
  }

  return (
    <section className="px-6 py-10 text-right bg-white max-w-xl mx-auto rounded shadow mt-10" dir="rtl">
      <h2 className="text-2xl font-bold text-[#C05370] mb-6">🖨️ حساب تكلفة طباعة كتاب</h2>

      {step === 1 && (
        <>
          <label className="block mb-2">عدد الصفحات</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded mb-4"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
          <button
            onClick={calculate}
            className="bg-[#4C7A68] text-white px-6 py-2 rounded hover:bg-[#3a5e52]"
          >
            احسب التكلفة
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-lg font-semibold mb-4">📄 التكلفة: {total?.toLocaleString()} ل.س</p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="📖 اسم الكتاب"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="👤 اسمك الثلاثي"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="tel"
              placeholder="📱 رقمك (واتساب)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={reset}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
              >
                🔁 إعادة الحساب
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#C05370] text-white px-6 py-2 rounded hover:bg-[#a8405b]"
              >
                {loading ? '...يتم الإرسال' : '📤 اطلب الآن'}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
