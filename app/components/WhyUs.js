'use client'

import { FaTruck, FaShieldAlt, FaStar, FaUndo } from 'react-icons/fa'

export default function WhyUs() {
  const items = [
    {
      icon: <FaTruck size={32} />,
      title: 'توصيل سريع',
      desc: 'طلبك بيوصل خلال ٢-٣ أيام لباب بيتك.',
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: 'دفع آمن',
      desc: 'بتدفع بس يوصل الطلب لعندك.',
    },
    {
      icon: <FaStar size={32} />,
      title: 'أفضل جودة',
      desc: 'جودتنا من الأفضل في سوق الكتب.',
    },
    {
      icon: <FaUndo size={32} />,
      title: 'ضمان الإرجاع',
      desc: 'بتقدر ترجع الكتاب إذا فيه مشكلة.',
    },
  ]

  return (
    <section className="py-12 px-6 text-center bg-white" dir="rtl">
      <h2 className="text-3xl font-bold text-[#4C7A68] mb-8">لماذا تختارنا؟</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 text-sm text-gray-700">
            <div className="text-[#C05370] mb-2">{item.icon}</div>
            <h3 className="font-semibold text-base">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
