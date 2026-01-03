'use client'

import { FaTruck, FaShieldAlt, FaStar, FaUndo } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function WhyUs() {
  const items = [
    {
      icon: <FaTruck size={22} />,
      title: 'توصيل سريع',
      desc: 'طلبك بيوصل خلال ٢-٣ أيام لباب بيتك.',
    },
    {
      icon: <FaShieldAlt size={22} />,
      title: 'دفع عند الاستلام',
      desc: 'بتدفع بس يوصل الطلب لعندك.',
    },
    {
      icon: <FaStar size={22} />,
      title: 'جودة عالية',
      desc: 'اختياراتنا بعناية وجودتنا ممتازة.',
    },
    {
      icon: <FaUndo size={22} />,
      title: 'ضمان الإرجاع',
      desc: 'بتقدر ترجع المنتج إذا فيه مشكلة.',
    },
  ]

  const Card = ({ item }) => (
    <div className="group rounded-3xl border bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition p-5 h-full">
      <div className="w-12 h-12 rounded-2xl border bg-[#F4EDE4] text-[#C05370] flex items-center justify-center mb-4 mx-auto">
        {item.icon}
      </div>
      <h3 className="font-extrabold text-[#2E2A28] text-base">{item.title}</h3>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.desc}</p>
    </div>
  )

  return (
    <section dir="rtl" className="py-10 px-4">
      <div className="rounded-3xl bg-gradient-to-b from-[#F9F2F4] via-white to-[#F4F7F5] border p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A28]">
            لماذا تختار <span className="text-[#4C7A68]">Blooms</span>؟
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            تجربة شراء مريحة — سرعة بالتوصيل، جودة، وثقة
          </p>
        </div>

        {/* ✅ Grid للشاشات الكبيرة */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <Card key={idx} item={item} />
          ))}
        </div>

        {/* ✅ Slider للموبايل فقط */}
        <div className="sm:hidden">
          <Swiper
            spaceBetween={12}
            slidesPerView={1.15}
            loop
            autoplay={{ delay: 2400, disableOnInteraction: false }}
            modules={[Autoplay]}
            className="max-w-3xl mx-auto pb-2"
          >
            {items.map((item, idx) => (
              <SwiperSlide key={idx}>
                <Card item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
