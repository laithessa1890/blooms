'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const [cart, setCart] = useState([])
  const [locationType, setLocationType] = useState('damascus')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [area, setArea] = useState('')
  const [province, setProvince] = useState('')
  const [branch, setBranch] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(storedCart)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setName(profile.name || '')
        setPhone(profile.phone || '')
        setLocationType(profile.location_type || 'damascus')
        setArea(profile.location_type === 'damascus' ? profile.location_details : '')
        if (profile.location_type === 'outside') {
          const [prov, br] = profile.location_details.split(' - فرع القدموس: ')
          setProvince(prov || '')
          setBranch(br || '')
        }
      }
    }

    fetchProfile()
  }, [])

  const removeFromCart = (index) => {
    const updatedCart = [...cart]
    updatedCart.splice(index, 1)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !phone) {
      alert('يرجى إدخال الاسم ورقم الهاتف')
      return
    }

    if (cart.length === 0) {
      alert('السلة فارغة 😢')
      return
    }

    if (locationType === 'damascus' && !area) {
      alert('يرجى إدخال اسم المنطقة داخل دمشق')
      return
    }

    if (locationType === 'outside' && (!province || !branch)) {
      alert('يرجى إدخال اسم المحافظة واسم فرع القدموس')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('orders').insert([
      {
        user_id: user?.id || null,
        name,
        phone,
        note,
        items: cart,
        location_type: locationType,
        area: locationType === 'damascus' ? area : null,
        province: locationType === 'outside' ? province : null,
        kadmous_branch: locationType === 'outside' ? branch : null,
      },
    ])

    setLoading(false)

    if (error) {
      console.error('🛑 Supabase Error:', error.message, error.details)
      alert('حدث خطأ أثناء إرسال الطلب ❌')
    } else {
      alert('✅ تم إرسال الطلب بنجاح!')
      localStorage.removeItem('cart')
      setCart([])
      setName('')
      setPhone('')
      setArea('')
      setProvince('')
      setBranch('')
      setNote('')
    }
  }

  return (
    <section className="px-6 py-10 text-right max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6">🛒 سلة الطلبات</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">السلة فارغة حالياً.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cart.map((item, idx) => (
              <li key={idx} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#4C7A68]">{item.title}</h3>
                  <p className="text-sm text-gray-500">السعر: {item.price} ليرة سورية</p>
                </div>
                <button
                  onClick={() => removeFromCart(idx)}
                  className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                >
                  حذف 🗑️
                </button>
              </li>
            ))}
          </ul>

          <div className="text-lg font-semibold text-[#4C7A68] mb-8">
            💰 المجموع: {total} ليرة سورية
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
              <label className="block mb-1">الاسم الكامل</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">رقم الهاتف</label>
              <input
                type="tel"
                className="w-full border px-3 py-2 rounded"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">أين مكان التوصيل؟</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={locationType}
                onChange={e => setLocationType(e.target.value)}
              >
                <option value="damascus">داخل دمشق</option>
                <option value="outside">خارج دمشق</option>
              </select>
            </div>

            {locationType === 'damascus' && (
              <div>
                <label className="block mb-1">اسم المنطقة</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  required
                />
              </div>
            )}

            {locationType === 'outside' && (
              <>
                <div>
                  <label className="block mb-1">اسم المحافظة</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">اسم فرع القدموس</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-1">ملاحظات إضافية (اختياري)</label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#C05370] text-white px-6 py-3 rounded hover:bg-[#a8405b]"
            >
              {loading ? '...يتم الإرسال' : 'إتمام الطلب ✅'}
            </button>
          </form>
        </>
      )}
    </section>
  )
}
