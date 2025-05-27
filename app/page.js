"use client"
import Image from "next/image"
import Link from "next/link" // ✅ ضروري
import Slider from "./components/Slider"
import CategoriesGrid from "./components/CategoriesGrid"
import NewBooks from "./components/NewBooks"
import LatestSeries from "./components/LatestSeries"

import { useState } from "react"
import MobileSearchBar from "./components/MobileSearchBar"
import WhyUs from "./components/WhyUs"
import BannerOffer from "./components/BannerOffer"
import RequestBook from "./components/RequestBook"
import PrintCostCalculator from "./components/PrintCostCalculator"

export default function Home() {
  const [books] = useState([
    {
      id: 1,
      title: "ONYX STORM",
      author: "rebecca yarros ",
      price: 450000,
      image: '/$_57.jpeg',
    },
    {
      id: 2,
      title: "STORY OF MY LIFE",
      author: "LUCY SCORE",
      price: 280000,
      image: '/9781728297057.jpeg',
    },
    {
      id: 3,
      title: 'WATCH ME',
      author: 'TAHEREH MAFI',
      price: 440000,
      image: '/9780063425187_1_01_1.jpg',
    },
  ])

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    localStorage.setItem('cart', JSON.stringify([...cart, book]))
    alert(`✅ تمت إضافة "${book.title}" إلى السلة`)
  }

  return (
    <main className="bg-[#F4EDE4] min-h-screen px-4 py-8 text-right" dir="rtl">
            <BannerOffer />

      <MobileSearchBar />
      <Slider />
      <NewBooks />
      <CategoriesGrid />
      <LatestSeries />
      <WhyUs/>
      

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#C05370]">مكتبة Blooms</h1>
        <p className="text-gray-700 mt-2 text-lg">مكتبتك للكتب المميزة 🌸</p>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl text-[#C05370] font-semibold mb-4">✨ إصدارات خاصة (Special Editions)</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {books.map(book => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-64 bg-gray-100">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 space-y-1 flex-1">
                <h3 className="text-md font-bold text-[#C05370]">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-sm text-gray-600">💰 {book.price.toLocaleString()} ل.س</p>
              </div>
              <button
                onClick={() => addToCart(book)}
                className="bg-[#C05370] text-white py-2 hover:bg-[#a8405b] transition text-sm font-medium"
              >
                🛒 أضف إلى السلة
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ تعديل هاد الجزء */}
      <div className="mt-10 text-center">
        <Link
          href="/books"
          className="inline-block bg-[#C05370] text-white px-6 py-3 rounded-full hover:bg-[#a8405b] transition"
        >
          عرض جميع الكتب
        </Link>
      </div>
            
            <RequestBook/>
            <PrintCostCalculator />
            

    </main>
  )
}
