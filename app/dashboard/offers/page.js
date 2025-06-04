'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ManageOffersPage() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, price, is_discounted, discount_price')
        .order('created_at', { ascending: false })

      if (!error) setBooks(data)
    }

    fetchBooks()
  }, [])

  const handleUpdate = async (book) => {
    const { error } = await supabase
      .from('books')
      .update({
        is_discounted: book.is_discounted,
        discount_price: book.discount_price
      })
      .eq('id', book.id)

    if (!error) alert('✅ تم التحديث بنجاح')
    else alert('❌ حدث خطأ أثناء التحديث')
  }

  const handleChange = (id, field, value) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, [field]: value } : book
      )
    )
  }

  return (
    <section className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-6">🎯 إدارة العروض</h1>

      {books.map(book => (
        <div key={book.id} className="bg-white rounded shadow p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="font-semibold text-[#4C7A68]">{book.title}</h2>
            <p className="text-sm text-gray-600">السعر الأصلي: {book.price?.toLocaleString()} ل.س</p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="text-sm flex items-center gap-1">
              <input
                type="checkbox"
                checked={book.is_discounted}
                onChange={(e) => handleChange(book.id, 'is_discounted', e.target.checked)}
              />
              خصم
            </label>

            <input
              type="number"
              className="border px-2 py-1 text-sm rounded w-24"
              placeholder="سعر العرض"
              value={book.discount_price || ''}
              onChange={(e) => handleChange(book.id, 'discount_price', parseInt(e.target.value) || 0)}
              disabled={!book.is_discounted}
            />

            <button
              onClick={() => handleUpdate(book)}
              className="bg-[#C05370] text-white px-3 py-1 text-sm rounded hover:bg-[#a8405b]"
            >
              تحديث
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}
