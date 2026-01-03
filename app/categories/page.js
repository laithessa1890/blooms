'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

const categories = [
  {
    title: 'جميع الكتب',
    image: '/494819675_1794324948163973_3416483601012165536_n.jpg',
    link: '/books',
  },
  {
    title: 'كتب عربية',
    image: '/sdgasdg.JPG',
    link: '/books?filter=arabic',
  },
  {
    title: 'كتب إنجليزية',
    image: '/sdafaf.JPG',
    link: '/books?filter=english',
  },
  {
    title: 'كتب أصلية (أورجنال)',
    image: '/Untitleddesign.png',
    link: '/books?filter=original',
  },
  {
    title: 'كتب مخصصة للأمهات',
    image: '/afsasf.JPG',
    link: '/books?filter=moms',
  },
  {
    title: 'كتب للأطفال',
    image: '/700.jpeg',
    link: '/books?filter=kids',
  },
]

export default function CategoriesGrid() {
  return (
    <section className="text-right" dir="rtl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A28]">
            تصنيفات <span className="text-[#C05370]">الكتب</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">اختار التصنيف وبلّش تصفّح بسرعة</p>
        </div>

        <Link href="/books" className="text-sm text-[#4C7A68] hover:underline">
          عرض الكل
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            className="group rounded-3xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
          >
            {/* صورة + Overlay */}
            <div className="relative w-full h-40 sm:h-48 md:h-52 bg-gray-100">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />

              {/* تدرج لقراءة النص */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              {/* شارة صغيرة */}
              <div className="absolute top-3 right-3">
                <span className="text-[11px] px-3 py-1 rounded-full bg-white/85 backdrop-blur border border-white/60 text-gray-800">
                  🧩 تصنيف
                </span>
              </div>

              {/* عنوان فوق الصورة */}
              <div className="absolute bottom-3 right-3 left-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-white font-extrabold text-sm sm:text-base line-clamp-2">
                    {cat.title}
                  </h3>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[#4C7A68] border border-white/60 transition group-hover:translate-x-[-2px]">
                    <FiArrowLeft />
                  </span>
                </div>
              </div>
            </div>

            {/* سطر بسيط تحت (اختياري) */}
            <div className="p-3 text-xs sm:text-sm text-gray-600 flex items-center justify-between">
              <span>اضغط لعرض الكتب</span>
              <span className="text-[#C05370] font-semibold">استكشاف</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
