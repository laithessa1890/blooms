'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookRequestsPage() {
  const [requests, setRequests] = useState([])
  const [printRequests, setPrintRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
    fetchPrintRequests()
  }, [])

  const fetchRequests = async () => {
    const { data, error } = await supabase.from('book_requests').select('*').order('created_at', { ascending: false })
    if (!error) setRequests(data)
    setLoading(false)
  }

  const fetchPrintRequests = async () => {
    const { data, error } = await supabase.from('print_requests').select('*').order('created_at', { ascending: false })
    if (!error) setPrintRequests(data)
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    const { error } = await supabase.from('book_requests').delete().eq('id', id)
    if (!error) {
      alert('✅ تم حذف الطلب')
      fetchRequests()
    }
  }

  return (
    <section className="px-6 py-10 text-right max-w-5xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold text-[#C05370] mb-6">📥 طلبات الكتب الغير موجودة</h1>

      {loading ? (
        <p>...جارٍ تحميل الطلبات</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">لا يوجد طلبات حالياً.</p>
      ) : (
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-[#F4EDE4] text-[#4C7A68]">
                <th className="p-2 border">📖 اسم الكتاب</th>
                <th className="p-2 border">👤 اسم الطالب</th>
                <th className="p-2 border">📱 رقم الهاتف</th>
                <th className="p-2 border">📝 ملاحظات</th>
                <th className="p-2 border">🕒 تاريخ الطلب</th>
                <th className="p-2 border">🗑️ حذف</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="text-right border-b hover:bg-[#F9F4EF]">
                  <td className="p-2 border">{req.title}</td>
                  <td className="p-2 border">{req.name}</td>
                  <td className="p-2 border">{req.phone}</td>
                  <td className="p-2 border">{req.notes}</td>
                  <td className="p-2 border">{new Date(req.created_at).toLocaleString('ar-SY')}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                    >
                      حذف 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#4C7A68] mb-6">🖨️ طلبات طباعة الكتب</h2>
      {printRequests.length === 0 ? (
        <p className="text-gray-600">لا يوجد طلبات طباعة حالياً.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-[#F4EDE4] text-[#4C7A68]">
                <th className="p-2 border">📖 اسم الكتاب</th>
                <th className="p-2 border">📄 عدد الصفحات</th>
                <th className="p-2 border">👤 الاسم</th>
                <th className="p-2 border">📱 رقم الهاتف</th>
                <th className="p-2 border">🕒 التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {printRequests.map((req) => (
                <tr key={req.id} className="text-right border-b hover:bg-[#F9F4EF]">
                  <td className="p-2 border">{req.book_title}</td>
                  <td className="p-2 border">{req.pages}</td>
                  <td className="p-2 border">{req.full_name}</td>
                  <td className="p-2 border">{req.phone}</td>
                  <td className="p-2 border">{new Date(req.created_at).toLocaleString('ar-SY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
