'use client'

import { FaTruck, FaShieldAlt, FaStar, FaUndo } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function WhyUs() {
  const items = [
    {
      icon: <FaTruck size={24} />,
      title: 'توصيل سريع',
      desc: 'طلبك بيوصل خلال ٢-٣ أيام لباب بيتك.',
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: 'دفع آمن',
      desc: 'بتدفع بس يوصل الطلب لعندك.',
    },
    {
      icon: <FaStar size={24} />,
      title: 'أفضل جودة',
      desc: 'جودتنا من الأفضل في سوق الكتب.',
    },
    {
      icon: <FaUndo size={24} />,
      title: 'ضمان الإرجاع',
      desc: 'بتقدر ترجع الكتاب إذا فيه مشكلة.',
    },
  ]

  return (
    <section className="py-10 px-4 text-center bg-white" dir="rtl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#4C7A68] mb-6">
        لماذا تختارنا؟
      </h2>

      <Swiper
        spaceBetween={12}
        slidesPerView={2.2}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="max-w-3xl mx-auto"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-[#F9F5F2] rounded-xl shadow-sm p-4 mx-1 flex flex-col items-center text-sm text-gray-700 h-full">
              <div className="text-[#C05370] bg-[#F4EDE4] p-2 rounded-full mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-base">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
