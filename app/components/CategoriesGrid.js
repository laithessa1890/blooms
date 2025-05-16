'use client'

import Image from 'next/image'
import Link from 'next/link'

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
    <section className="px-6 py-10 text-right" dir="rtl">
      <h2 className="text-3xl font-bold text-[#C05370] mb-6">تصنيفات الكتب</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat, idx) => (
          <Link key={idx} href={cat.link}>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative w-full h-48">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 font-semibold text-lg text-gray-800">{cat.title} →</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
