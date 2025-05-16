'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()
    if (
      email === 'laessessd@gmail.com' &&
      password === 'lliioopp10987654321@#$'
    ) {
      localStorage.setItem('isAdmin', 'true')
      router.push('/dashboard')
    } else {
      alert('❌ الإيميل أو كلمة المرور غير صحيحة')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f3eb]" dir="rtl">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-[#C05370] text-center">دخول لوحة التحكم</h2>

        <div>
          <label className="block text-sm mb-1">الإيميل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4C7A68] text-white py-2 rounded hover:bg-[#3a5e52]"
        >
          دخول
        </button>
      </form>
    </div>
  )
}
