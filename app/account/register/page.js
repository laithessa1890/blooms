'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('damascus') // damascus | other
  const [area, setArea] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [kadmousBranch, setKadmousBranch] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const buildLocation = () => {
    const location_type = city === 'damascus' ? 'دمشق' : 'محافظة أخرى'

    let location_details = ''
    if (city === 'damascus') {
      location_details = area?.trim() || ''
    } else {
      const gov = governorate?.trim()
      const branch = kadmousBranch?.trim()
      location_details = [gov, branch ? `فرع القدموس: ${branch}` : ''].filter(Boolean).join(' - ')
    }

    return { location_type, location_details }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // تحقق بسيط
    if (!fullName.trim()) {
      setLoading(false)
      return setError('الرجاء إدخال الاسم الكامل.')
    }
    if (!phone.trim()) {
      setLoading(false)
      return setError('الرجاء إدخال رقم الهاتف (واتساب).')
    }
    if (city === 'damascus' && !area.trim()) {
      setLoading(false)
      return setError('الرجاء إدخال اسم المنطقة بدمشق.')
    }
    if (city === 'other' && !governorate.trim()) {
      setLoading(false)
      return setError('الرجاء إدخال اسم المحافظة.')
    }

    const { location_type, location_details } = buildLocation()

    // ✅ ننصح بإرسال بيانات إضافية في signUp (metadata) كمان
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          location_type,
          location_details,
        },
      },
    })

    if (signUpError) {
      setLoading(false)
      return setError(signUpError.message)
    }

    // ملاحظة: إذا عندك تفعيل "تأكيد الإيميل" ممكن user تكون null هون
    const userId = data.user?.id

    if (userId) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: userId,
          full_name: fullName,
          phone,
          location_type,
          location_details,
        },
        { onConflict: 'id' }
      )

      if (profileError) {
        setLoading(false)
        return setError('تم إنشاء الحساب لكن حدث خطأ بحفظ الملف الشخصي.')
      }

      setSuccess('✅ تم إنشاء الحساب بنجاح!')
      router.push('/account')
      return
    }

    // إذا ما رجع userId (غالباً تأكيد ايميل)
    setLoading(false)
    setSuccess('✅ تم إنشاء الحساب. الرجاء تفقد بريدك لتأكيد الحساب ثم تسجيل الدخول.')
  }

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">📝</div>
            <h1 className="text-2xl font-extrabold text-[#2E2A28]">
              إنشاء حساب جديد في <span className="text-[#C05370]">Blooms</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">املأ البيانات لتأكيد الطلبات والتوصيل بسهولة</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* الاسم */}
            <div>
              <label className="block mb-1 text-sm font-medium">الاسم الكامل</label>
              <div className="relative">
                <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="مثال: محمد أحمد"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                  required
                />
              </div>
            </div>

            {/* الإيميل */}
            <div>
              <label className="block mb-1 text-sm font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">يفضل 6 أحرف أو أكثر.</p>
            </div>

            {/* الهاتف */}
            <div>
              <label className="block mb-1 text-sm font-medium">رقم الهاتف (واتساب)</label>
              <div className="relative">
                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="مثال: 09xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
                  required
                />
              </div>
            </div>

            {/* مكان السكن */}
            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
                <FiMapPin /> مكان السكن
              </div>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-full px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
              >
                <option value="damascus">دمشق</option>
                <option value="other">محافظة أخرى</option>
              </select>

              <div className="mt-3 space-y-3">
                {city === 'damascus' ? (
                  <input
                    type="text"
                    placeholder="اسم المنطقة بدمشق"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full border rounded-full px-4 py-2.5"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="اسم المحافظة"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full border rounded-full px-4 py-2.5"
                    />
                    <input
                      type="text"
                      placeholder="اسم فرع القدموس (اختياري)"
                      value={kadmousBranch}
                      onChange={(e) => setKadmousBranch(e.target.value)}
                      className="w-full border rounded-full px-4 py-2.5"
                    />
                  </>
                )}
              </div>
            </div>

            {/* رسائل */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                ❌ {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* زر */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C05370] text-white py-2.5 hover:opacity-90 transition disabled:opacity-60"
            >
              <FiCheck />
              {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            لديك حساب؟{' '}
            <Link href="/account/login" className="text-[#4C7A68] font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          باستخدامك للموقع أنت توافق على شروط الاستخدام وسياسة الخصوصية.
        </p>
      </div>
    </section>
  )
}
