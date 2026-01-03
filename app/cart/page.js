'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FiTrash2, FiShoppingCart, FiCheckCircle, FiInfo } from 'react-icons/fi'

export default function CartPage() {
  const [cart, setCart] = useState([])

  // form
  const [locationType, setLocationType] = useState('damascus') // damascus | outside
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [area, setArea] = useState('')
  const [province, setProvince] = useState('')
  const [branch, setBranch] = useState('')
  const [note, setNote] = useState('')

  // ui
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ✅ تحميل السلة
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(storedCart)
  }, [])

  // ✅ جلب بروفايل المستخدم (مع معالجة اختلاف قيم location_type)
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) return

      // ✅ حسب صفحة التسجيل عندك: full_name
      setName(profile.full_name || profile.name || '')
      setPhone(profile.phone || '')

      // ✅ Mapping لقيم المكان (عربي/انجليزي)
      // ممكن يكون: "damascus" أو "دمشق" أو "outside" أو "محافظة أخرى"
      const ltRaw = (profile.location_type || '').toString().trim()

      const normalized =
        ltRaw === 'damascus' || ltRaw === 'دمشق'
          ? 'damascus'
          : ltRaw === 'outside' || ltRaw === 'محافظة أخرى'
          ? 'outside'
          : 'damascus'

      setLocationType(normalized)

      const details = (profile.location_details || '').toString()

      if (normalized === 'damascus') {
        setArea(details)
      } else {
        // يدعم الصيغة اللي كنت تكتبها: "المحافظة - فرع القدموس: كذا"
        const parts = details.split(' - فرع القدموس: ')
        setProvince(parts[0] || '')
        setBranch(parts[1] || '')
      }
    }

    fetchProfile()
  }, [])

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price || 0), 0)
  }, [cart])

  const removeFromCart = (index) => {
    const updatedCart = [...cart]
    updatedCart.splice(index, 1)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const validate = () => {
    if (!name.trim() || !phone.trim()) return 'يرجى إدخال الاسم ورقم الهاتف'
    if (cart.length === 0) return 'السلة فارغة 😢'

    if (locationType === 'damascus' && !area.trim()) return 'يرجى إدخال اسم المنطقة داخل دمشق'
    if (locationType === 'outside' && !province.trim()) return 'يرجى إدخال اسم المحافظة'
    if (locationType === 'outside' && !branch.trim()) return 'يرجى إدخال اسم فرع القدموس'

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('orders').insert([
      {
        user_id: user?.id || null,
        name: name.trim(),
        phone: phone.trim(),
        note: note.trim(),
        items: cart,

        // نخزن القيم consistent (damascus/outside)
        location_type: locationType,
        area: locationType === 'damascus' ? area.trim() : null,
        province: locationType === 'outside' ? province.trim() : null,
        kadmous_branch: locationType === 'outside' ? branch.trim() : null,
      },
    ])

    setLoading(false)

    if (insertError) {
      console.error('🛑 Supabase Error:', insertError.message, insertError.details)
      setError('حدث خطأ أثناء إرسال الطلب ❌')
      return
    }

    setSuccess('✅ تم إرسال الطلب بنجاح!')

    // تفريغ السلة
    localStorage.removeItem('cart')
    setCart([])

    // تفريغ الملاحظات فقط (خلي الاسم/الهاتف عادة مفيدين)
    setNote('')
  }

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28] inline-flex items-center gap-2">
              <FiShoppingCart /> سلة الطلبات
            </h1>
            <p className="text-sm text-gray-600 mt-1">راجع منتجاتك وأكمل بيانات التوصيل</p>
          </div>

          <Link href="/books" className="text-sm text-[#C05370] hover:underline">
            متابعة التسوّق
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 text-center">
            <p className="text-gray-700 font-semibold">السلة فارغة حالياً.</p>
            <Link
              href="/books"
              className="inline-flex mt-4 px-5 py-2.5 rounded-full bg-[#C05370] text-white hover:opacity-90 transition"
            >
              تصفّح الكتب
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* يسار: قائمة العناصر */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5">
                <h2 className="font-extrabold text-[#4C7A68] mb-4">📦 المنتجات</h2>

                <ul className="space-y-3">
                  {cart.map((item, idx) => (
                    <li
                      key={idx}
                      className="rounded-2xl border bg-white p-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[#2E2A28] truncate">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          السعر: <span className="font-semibold text-[#C05370]">{Number(item.price || 0).toLocaleString()} ل.س</span>
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(idx)}
                        className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                        aria-label="حذف"
                      >
                        <FiTrash2 /> حذف
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* نموذج الطلب */}
              <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5">
                <h2 className="font-extrabold text-[#4C7A68] mb-4">🚚 بيانات التوصيل</h2>

                {error && (
                  <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    ❌ {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 inline-flex items-center gap-2">
                    <FiCheckCircle /> {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium">الاسم الكامل</label>
                      <input
                        type="text"
                        className="w-full border px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">رقم الهاتف</label>
                      <input
                        type="tel"
                        className="w-full border px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">أين مكان التوصيل؟</label>
                    <select
                      className="w-full border px-4 py-2.5 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                    >
                      <option value="damascus">داخل دمشق</option>
                      <option value="outside">خارج دمشق</option>
                    </select>
                  </div>

                  {locationType === 'damascus' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium">اسم المنطقة داخل دمشق</label>
                      <input
                        type="text"
                        className="w-full border px-4 py-2.5 rounded-full"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {locationType === 'outside' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 text-sm font-medium">اسم المحافظة</label>
                        <input
                          type="text"
                          className="w-full border px-4 py-2.5 rounded-full"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium">اسم فرع القدموس</label>
                        <input
                          type="text"
                          className="w-full border px-4 py-2.5 rounded-full"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 text-sm font-medium">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      className="w-full border px-4 py-3 rounded-2xl min-h-[90px]"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#C05370] text-white px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? '...يتم الإرسال' : 'إتمام الطلب ✅'}
                  </button>
                </form>
              </div>
            </div>

            {/* يمين: الملخص */}
            <div className="space-y-4">
              <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5">
                <h2 className="font-extrabold text-[#4C7A68] mb-3">🧾 ملخص الطلب</h2>

                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>عدد العناصر</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                  <span>المجموع</span>
                  <span className="font-extrabold text-[#C05370]">
                    {total.toLocaleString()} ل.س
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#F4EDE4] px-4 py-3 text-xs text-gray-700 inline-flex gap-2">
                  <FiInfo className="mt-0.5" />
                  <span>بعد إرسال الطلب سيتم التواصل معك لتأكيد التفاصيل.</span>
                </div>
              </div>

              <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-5">
                <h3 className="font-extrabold text-[#2E2A28] mb-2">✨ ملاحظة</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  إذا كنت خارج دمشق، يرجى اختيار فرع القدموس الأقرب لاستلام الطلب.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
