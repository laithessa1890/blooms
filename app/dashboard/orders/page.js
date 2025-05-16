'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('فشل في جلب الطلبات:', error)
    } else {
      setOrders(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'تم التوصيل' ? 'قيد المعالجة' : 'تم التوصيل'
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (!error) {
      fetchOrders()
    }
  }

  const deleteOrder = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (!error) {
      fetchOrders()
    }
  }

  const exportToExcel = () => {
    const headers = ['الاسم', 'الهاتف', 'الموقع', 'الملاحظات', 'المجموع', 'الحالة']
    const rows = orders.map(order => {
      const items = order.items || []
      const total = items.reduce((sum, item) => sum + Number(item.price), 0)
      return [
        order.name,
        order.phone,
        order.location_type === 'damascus'
          ? `دمشق - ${order.area}`
          : `${order.province} - ${order.kadmous_branch}`,
        order.note || 'لا يوجد',
        total,
        order.status || 'قيد المعالجة'
      ]
    })

    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n')

    const bom = '\uFEFF' // ✅ يضيف دعم UTF-8 للغة العربية
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'الطلبات.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="px-6 py-10 max-w-6xl mx-auto text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6">📦 لوحة إدارة الطلبات</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-[#4C7A68] text-white rounded hover:bg-[#3a5e52]"
        >
          🔄 تحديث الطلبات
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          📥 تصدير إلى Excel
        </button>
      </div>

      {loading ? (
        <p>...جارٍ تحميل الطلبات</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">لا توجد طلبات حتى الآن.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const items = order.items || []
            const total = items.reduce((sum, item) => sum + Number(item.price), 0)
            const status = order.status || 'قيد المعالجة'

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded shadow space-y-2 border border-gray-200"
              >
                <div className="font-bold text-[#4C7A68] text-lg">{order.name} - {order.phone}</div>
                <div className="text-sm text-gray-600">🕒 {new Date(order.created_at).toLocaleString('ar-EG')}</div>
                <div className="text-sm">📍 {order.location_type === 'damascus' ? `منطقة: ${order.area}` : `محافظة: ${order.province}، فرع القدموس: ${order.kadmous_branch}`}</div>
                <div className="text-sm">💬 ملاحظات: {order.note || 'لا يوجد'}</div>
                <div className="text-sm">📚 الكتب:</div>
                <ul className="list-disc pr-5 text-sm text-gray-800">
                  {items.map((item, idx) => (
                    <li key={idx}>{item.title} - {item.price} ل.س</li>
                  ))}
                </ul>
                <div className="font-semibold text-[#C05370]">💰 المجموع: {total} ل.س</div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm">🔖 الحالة: {status}</span>
                  <button
                    onClick={() => toggleStatus(order.id, status)}
                    className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    تغيير الحالة
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    حذف الطلب
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
