// ✅ SignUp Page - تعديل شامل لتخزين كل معلومات المستخدم في جدول profiles
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('damascus')
  const [area, setArea] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [kadmousBranch, setKadmousBranch] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return alert('❌ خطأ بالتسجيل')

    const userId = data.user?.id
    if (userId) {
      const location_type = city === 'damascus' ? 'دمشق' : 'محافظة أخرى'
      const location_details = city === 'damascus' ? area : `${governorate} - فرع القدموس: ${kadmousBranch}`

      await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        phone,
        location_type,
        location_details,
      })
    }

    alert('✅ تم إنشاء الحساب')
    router.push('/account')
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-10 text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-6">📝 إنشاء حساب جديد</h1>
      <div className="space-y-4">
        <input type="text" placeholder="الاسم الكامل" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="email" placeholder="الإيميل" value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="text" placeholder="رقم الهاتف (واتساب)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded" />

        <label className="block font-semibold">📍 مكان السكن:</label>
        <select value={city} onChange={e => setCity(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="damascus">دمشق</option>
          <option value="other">محافظة أخرى</option>
        </select>

        {city === 'damascus' ? (
          <input type="text" placeholder="اسم المنطقة بدمشق" value={area} onChange={e => setArea(e.target.value)} className="w-full border px-3 py-2 rounded" />
        ) : (
          <>
            <input type="text" placeholder="اسم المحافظة" value={governorate} onChange={e => setGovernorate(e.target.value)} className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="اسم فرع القدموس" value={kadmousBranch} onChange={e => setKadmousBranch(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </>
        )}

        <button onClick={handleSignup} className="bg-[#C05370] text-white px-4 py-2 rounded w-full">✅ إنشاء الحساب</button>
      </div>
    </section>
  )
}
