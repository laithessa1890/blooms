'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert('❌ فشل التسجيل: ' + error.message)
    } else {
      alert('✅ تم إنشاء الحساب بنجاح! تأكد من الإيميل لتفعيله.')
      router.push('/account') // أو صفحة تسجيل الدخول لاحقاً
    }
  }

  return (
    <section className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded" dir="rtl">
      <h1 className="text-2xl font-bold text-center text-[#C05370] mb-4">إنشاء حساب</h1>

      <input
        type="email"
        placeholder="📧 الإيميل"
        className="w-full mb-4 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="🔒 كلمة المرور"
        className="w-full mb-4 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="w-full bg-[#C05370] text-white p-2 rounded hover:bg-[#a8405b]"
      >
        تسجيل
      </button>
    </section>
  )
}
