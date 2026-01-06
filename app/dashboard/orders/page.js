'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  FiRefreshCw,
  FiDownload,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiChevronDown,
  FiSearch,
} from 'react-icons/fi'

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | processing | delivered
  const [openId, setOpenId] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('فشل في جلب الطلبات:', error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const normalizeStatus = (s) => (s || 'قيد المعالجة').trim()

  const statusKey = (s) => {
    const st = normalizeStatus(s)
    if (st === 'تم التوصيل') return 'delivered'
    return 'processing'
  }

  const statusBadge = (s) => {
    const st = normalizeStatus(s)
    if (st === 'تم التوصيل') {
      return (
        <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
          <FiCheckCircle /> تم التوصيل
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-yellow-50 text-yellow-800 border-yellow-200">
        <FiClock /> قيد المعالجة
      </span>
    )
  }

  const toggleStatus = async (id, currentStatus) => {
    const st = normalizeStatus(currentStatus)
    const newStatus = st === 'تم التوصيل' ? 'قيد المعالجة' : 'تم التوصيل'
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (!error) fetchOrders()
  }

  const deleteOrder = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (!error) fetchOrders()
  }

  // ✅ تصدير CSV بطريقة آمنة (تدعم الفواصل والعربي)
  const exportToExcel = () => {
    const headers = ['الاسم', 'الهاتف', 'الموقع', 'الملاحظات', 'المجموع', 'الحالة', 'التاريخ', 'العناصر']

    const escapeCsv = (value) => {
      const v = (value ?? '').toString().replace(/"/g, '""')
      return `"${v}"`
    }

    const rows = orders.map((order) => {
      const items = order.items || []
      const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0)

      const location =
        order.location_type === 'damascus'
          ? `دمشق - ${order.area || ''}`
          : `${order.province || ''} - ${order.kadmous_branch || ''}`

      const itemsText = items
        .map((it) => `${it.title || ''} (${Number(it.price || 0).toLocaleString()} ل.س)`)
        .join(' | ')

      return [
        escapeCsv(order.name),
        escapeCsv(order.phone),
        escapeCsv(location),
        escapeCsv(order.note || 'لا يوجد'),
        escapeCsv(total),
        escapeCsv(normalizeStatus(order.status)),
        escapeCsv(new Date(order.created_at).toLocaleString('ar-EG')),
        escapeCsv(itemsText),
      ].join(',')
    })

    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\n')
    const bom = '\uFEFF'
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `الطلبات_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return (orders || []).filter((o) => {
      const matchQuery =
        !q ||
        (o.name || '').toLowerCase().includes(q) ||
        (o.phone || '').toLowerCase().includes(q)

      const st = statusKey(o.status)
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'processing' && st === 'processing') ||
        (statusFilter === 'delivered' && st === 'delivered')

      return matchQuery && matchStatus
    })
  }, [orders, query, statusFilter])

  return (
    <section dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 text-right">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2E2A28]">
              📦 لوحة إدارة الطلبات
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              إدارة الطلبات بسرعة (بحث، فلترة، تصدير، تغيير حالة)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#4C7A68] text-white hover:opacity-90 transition"
            >
              <FiRefreshCw /> تحديث
            </button>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#D9A441] text-white hover:opacity-90 transition"
            >
              <FiDownload /> تصدير CSV
            </button>
          </div>
        </div>

        {/* أدوات: بحث + فلتر */}
        <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm p-4 md:p-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-2 relative">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                className="w-full pr-11 pl-4 py-2.5 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-[#C05370]/30 focus:border-[#C05370]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border bg-white focus:outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="processing">قيد المعالجة</option>
              <option value="delivered">تم التوصيل</option>
            </select>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            عدد الطلبات المعروضة: <span className="font-bold">{filtered.length}</span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">...جارٍ تحميل الطلبات</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600">لا توجد طلبات مطابقة.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const items = order.items || []
              const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0)
              const status = normalizeStatus(order.status)

              const locationText =
                order.location_type === 'damascus'
                  ? `دمشق - منطقة: ${order.area || 'غير محدد'}`
                  : `محافظة: ${order.province || 'غير محدد'}، فرع القدموس: ${order.kadmous_branch || 'غير محدد'}`

              const isOpen = openId === order.id

              return (
                <div key={order.id} className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm overflow-hidden">
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : order.id)}
                    className="w-full p-4 md:p-5 text-right flex items-center justify-between gap-3 hover:bg-white transition"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-extrabold text-[#2E2A28] truncate">
                          {order.name} <span className="text-gray-400">—</span> {order.phone}
                        </div>
                        {statusBadge(status)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        🕒 {new Date(order.created_at).toLocaleString('ar-EG')} · 📍 {locationText}
                      </div>
                    </div>

                    <FiChevronDown className={`shrink-0 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Body */}
                  {isOpen && (
                    <div className="p-4 md:p-5 border-t bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border bg-gray-50 p-4">
                          <div className="font-bold text-gray-800 mb-2">💬 ملاحظات</div>
                          <div className="text-gray-700">{order.note || 'لا يوجد'}</div>
                        </div>

                        <div className="rounded-2xl border bg-gray-50 p-4">
                          <div className="font-bold text-gray-800 mb-2">💰 المجموع</div>
                          <div className="text-[#C05370] font-extrabold text-lg">
                            {total.toLocaleString()} ل.س
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="font-bold text-gray-800 mb-2">📚 العناصر</div>
                        {items.length === 0 ? (
                          <p className="text-gray-600 text-sm">لا توجد عناصر ضمن هذا الطلب.</p>
                        ) : (
                          <ul className="space-y-2">
                            {items.map((item, idx) => (
                              <li key={idx} className="rounded-2xl border p-3 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="font-semibold text-gray-800 truncate">{item.title}</div>
                                </div>
                                <div className="text-sm font-bold text-[#4C7A68]">
                                  {Number(item.price || 0).toLocaleString()} ل.س
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => toggleStatus(order.id, status)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white hover:opacity-90 transition"
                        >
                          تغيير الحالة
                        </button>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          <FiTrash2 /> حذف الطلب
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
