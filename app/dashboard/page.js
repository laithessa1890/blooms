'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/admin-login')
  }

  return (
    <main className="min-h-screen bg-[#F4EDE4] text-right px-6 py-10" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-8">لوحة التحكم 📊</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* الكتب */}
        <Link
          href="/dashboard/books"
          className="bg-white border border-[#C05370] text-[#C05370] hover:bg-[#C05370] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          📚 إدارة الكتب
        </Link>

        {/* إضافة كتاب */}
        <Link
          href="/dashboard/add-book"
          className="bg-white border border-[#4C7A68] text-[#4C7A68] hover:bg-[#4C7A68] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          ➕ إضافة كتاب جديد
        </Link>

        {/* الطلبات */}
        <Link
          href="/dashboard/orders"
          className="bg-white border border-[#D9A441] text-[#D9A441] hover:bg-[#D9A441] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          🧾 عرض الطلبات
        </Link>

        {/* التقارير */}
        <Link
          href="/dashboard/reports"
          className="bg-white border border-[#7851A9] text-[#7851A9] hover:bg-[#7851A9] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          📈 التقارير والإحصائيات
        </Link>

        {/* الإعدادات */}
        <Link
          href="/dashboard/settings"
          className="bg-white border border-[#999] text-[#555] hover:bg-[#999] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          ⚙️ الإعدادات العامة
        </Link>

        {/* المجموعات */}
        <Link
          href="/dashboard/add-series"
          className="bg-white border border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          📦 إدارة المجموعات (سلاسل)
        </Link>

        {/* العروض */}
        <Link
          href="/dashboard/offers"
          className="bg-white border border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          🎁 إدارة العروض المميزة
        </Link>

        {/* تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-6 py-8 rounded-xl shadow text-center font-semibold"
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </main>
  )
}
