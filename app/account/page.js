'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AccountPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)

        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setOrders(orderData || [])
      }
    }

    fetchData()
  }, [])

  if (!user || !profile) return <p className="text-center mt-10">جاري تحميل معلومات الحساب...</p>

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-[#C05370] mb-6">👤 حسابي</h1>

      <div className="bg-white p-4 rounded shadow mb-10">
        <h2 className="text-lg font-semibold text-[#4C7A68] mb-2">📝 معلومات الحساب</h2>
        <p className="mb-1">📧 <strong>الإيميل:</strong> {user.email}</p>
        <p className="mb-1">👤 <strong>الاسم:</strong> {profile.full_name || 'غير متوفر'}</p>
        <p className="mb-1">📞 <strong>رقم الهاتف:</strong> {profile.phone || 'غير متوفر'}</p>
        <p className="mb-1">📍 <strong>نوع الموقع:</strong> {profile.location_type || 'غير محدد'}</p>
        <p className="mb-1">📦 <strong>تفاصيل الموقع:</strong> {profile.location_details || '---'}</p>
      </div>

      <h2 className="text-xl font-bold text-[#C05370] mb-4">📦 طلباتي</h2>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-white p-4 rounded shadow border">
            <p className="mb-1">📅 <strong>التاريخ:</strong> {new Date(order.created_at).toLocaleDateString('ar-SY')}</p>
            <p className="mb-1">📍 <strong>العنوان:</strong> {order.location_type === 'damascus' ? order.area : `${order.province} - فرع القدموس: ${order.kadmous_branch}`}</p>
            <p className="mb-1">📝 <strong>الملاحظات:</strong> {order.note || 'لا يوجد'}</p>
            <p className="mb-1">🔄 <strong>الحالة:</strong> {order.status || 'قيد المعالجة'}</p>
            <p className="mb-2">📚 <strong>عدد الكتب:</strong> {order.items?.length || 0}</p>

            <ul className="text-sm list-disc pr-4 text-gray-600">
              {order.items?.map((item, i) => (
                <li key={i}>📕 {item.title} - 💰 {item.price.toLocaleString()} ل.س</li>
              ))}
            </ul>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-gray-600">لا يوجد طلبات بعد.</p>
        )}
      </div>
    </section>
  )
}
