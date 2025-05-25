'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuid } from 'uuid'

export default function AddBookPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('arabic')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [updatedPrices, setUpdatedPrices] = useState({})

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false })
    if (!error) setBooks(data)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''

    if (imageFile) {
      const fileName = `${Date.now()}_${uuid()}`
      const { error: uploadError } = await supabase
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

    const { error } = await supabase.from('books').insert([
      { title, category, description, price: Number(price), image: imageUrl }
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
      fetchBooks()
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (!error) fetchBooks()
  }

  const handleUpdatePrice = async (id) => {
    const newPrice = updatedPrices[id]
    if (!newPrice) return
    const { error } = await supabase.from('books').update({ price: Number(newPrice) }).eq('id', id)
    if (!error) {
      alert('✅ تم التحديث')
      fetchBooks()
    }
  }

  return (
    <section className="text-right px-6 py-8 max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-[#4C7A68] mb-6">📘 إضافة كتاب جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input type="text" placeholder="عنوان الكتاب" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <select className="w-full border px-3 py-2 rounded" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="arabic">كتب عربية</option>
          <option value="english">كتب إنجليزية</option>
          <option value="kids">كتب أطفال</option>
          <option value="moms">كتب للأمهات</option>
          <option value="original">كتب أصلية</option>
        </select>
        <textarea placeholder="الوصف" value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" rows="4" />
        <input type="number" placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0])} required />
        <button type="submit" disabled={loading} className="bg-[#C05370] text-white px-6 py-2 rounded hover:bg-[#a8405b]">
          {loading ? '...يتم الإرسال' : '➕ إضافة'}
        </button>
      </form>

      <h2 className="text-xl font-bold text-[#C05370] mb-4">📚 الكتب الحالية</h2>
      <ul className="space-y-4">
        {books.map(book => (
          <li key={book.id} className="bg-white border p-4 rounded shadow space-y-2">
            <p className="font-bold text-[#4C7A68]">{book.title}</p>
            <p className="text-sm text-gray-600">{book.category}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border px-2 py-1 rounded w-32"
                value={updatedPrices[book.id] ?? book.price ?? ''}
                onChange={(e) =>
                  setUpdatedPrices(prev => ({ ...prev, [book.id]: e.target.value }))
                }
              />
              <button onClick={() => handleUpdatePrice(book.id)} className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50">تحديث 💾</button>
              <button onClick={() => handleDelete(book.id)} className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50">حذف 🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
