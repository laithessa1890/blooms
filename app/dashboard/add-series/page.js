'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddSeriesPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [seriesList, setSeriesList] = useState([])
  const [updatedPrices, setUpdatedPrices] = useState({})

  useEffect(() => {
    fetchSeries()
  }, [])

  const fetchSeries = async () => {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setSeriesList(data)
  }

  const handleUpload = async () => {
    if (!image) return null

    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `series/${fileName}`

    const { error } = await supabase.storage
      .from('book-images')
      .upload(filePath, image)

    if (error) throw error

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/book-images/${filePath}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imageUrl = await handleUpload()

      const { error } = await supabase.from('series').insert([{
        title,
        description,
        image: imageUrl,
        price: Number(price),
      }])

      if (error) throw error

      alert('✅ تم إضافة السلسلة')
      setTitle('')
      setDescription('')
      setImage(null)
      setPrice('')
      fetchSeries()
    } catch (error) {
      alert('❌ فشل الإضافة')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    const { error } = await supabase.from('series').delete().eq('id', id)
    if (!error) fetchSeries()
  }

  const handleUpdatePrice = async (id) => {
    const newPrice = updatedPrices[id]
    if (!newPrice || isNaN(newPrice)) {
      alert('⚠️ أدخل سعر صالح أولًا')
      return
    }

    const { error } = await supabase.from('series').update({ price: Number(newPrice) }).eq('id', id)
    if (!error) {
      alert('✅ تم تحديث السعر')
      fetchSeries()
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-6">📦 إضافة سلسلة جديدة</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input type="text" placeholder="عنوان السلسلة" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <textarea placeholder="الوصف" value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full" required />
        <input type="number" placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <button type="submit" disabled={loading} className="bg-[#C05370] text-white px-6 py-2 rounded">{loading ? '...جاري الإضافة' : '➕ إضافة السلسلة'}</button>
      </form>

      <h2 className="text-xl font-bold text-[#4C7A68] mb-4">📚 السلاسل الحالية</h2>
      <ul className="space-y-4">
        {seriesList.map(item => (
          <li key={item.id} className="bg-white border p-4 rounded shadow space-y-2">
            <p className="font-bold text-[#C05370]">{item.title}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border px-2 py-1 rounded w-32"
                value={
                  updatedPrices[item.id] !== undefined
                    ? updatedPrices[item.id]
                    : item.price ?? ''
                }
                onChange={(e) =>
                  setUpdatedPrices((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
              />
              <button onClick={() => handleUpdatePrice(item.id)} className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                تحديث 💾
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50">
                حذف 🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
