'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/account')
    }
  }

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-6 md:p-8">
          {/* العنوان */}
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🔐</div>
            <h1 className="text-2xl font-extrabold text-[#2E2A28]">
              تسجيل الدخول إلى <span className="text-[#C05370]">Blooms</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              أهلاً بعودتك 👋 سجّل الدخول لمتابعة التسوّق
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* البريد */}
            <div>
              <label className="block mb-1 text-sm font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block mb-1 text-sm font-medium">كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* خطأ */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                ❌ {error}
              </div>
            )}

            {/* زر */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C05370] text-white py-2.5 hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? 'جارٍ تسجيل الدخول...' : (
                <>
                  <FiLogIn /> تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* روابط */}
          <div className="mt-6 text-sm text-center space-y-2">
            <Link href="/account/forgot-password" className="text-[#4C7A68] hover:underline">
              نسيت كلمة المرور؟
            </Link>

            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/account/register" className="text-[#C05370] font-semibold hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        {/* ملاحظة */}
        <p className="text-center text-xs text-gray-500 mt-4">
          باستخدامك للموقع أنت توافق على شروط الاستخدام وسياسة الخصوصية.
        </p>
      </div>
    </section>
  )
}
