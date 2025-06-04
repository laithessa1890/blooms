'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/account')
    }
  }

  return (
    <section className="max-w-md mx-auto py-10 px-4 text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-6">🔐 تسجيل الدخول</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">📧 البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">🔒 كلمة المرور</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">❌ {error}</p>}

        <button
          type="submit"
          className="w-full bg-[#C05370] text-white py-2 rounded hover:bg-[#a8405b]"
        >
          تسجيل الدخول
        </button>
      </form>
    </section>
  )
}
