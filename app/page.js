'use client'

import Image from 'next/image'
import Link from 'next/link'
import Slider from './components/Slider'
import CategoriesGrid from './components/CategoriesGrid'
import NewBooks from './components/NewBooks'

import { useState } from 'react'
import MobileSearchBar from './components/MobileSearchBar'
import WhyUs from './components/WhyUs'
import BannerOffer from './components/BannerOffer'
import RequestBook from './components/RequestBook'
import PrintCostCalculator from './components/PrintCostCalculator'
import { motion } from 'framer-motion'
import LatestManga from './components/LatestManga'
import LatestSeries from './components/LatestSeries'
import HomeDiscountedBooks from './components/HomeDiscountedBooks'

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
}

export default function Home() {
  const [books] = useState([
    {
      id: 1,
      title: 'ONYX STORM',
      author: 'rebecca yarros ',
      price: 450000,
      image: '/$_57.jpeg',
    },
    {
      id: 2,
      title: 'STORY OF MY LIFE',
      author: 'LUCY SCORE',
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
    <motion.main
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
      className="bg-[#F4EDE4] min-h-screen px-4 py-8 text-right"
      dir="rtl"
    >
      <motion.div variants={sectionVariant}><BannerOffer /></motion.div>
      <motion.div variants={sectionVariant}><MobileSearchBar /></motion.div>
      <motion.div variants={sectionVariant}><Slider /></motion.div>
      <motion.div variants={sectionVariant}><NewBooks /></motion.div>
            <motion.div variants={sectionVariant}><LatestSeries /></motion.div>

      <motion.div variants={sectionVariant}><CategoriesGrid /></motion.div>
      <motion.div variants={sectionVariant}><LatestManga /></motion.div>
      <motion.div variants={sectionVariant}><WhyUs /></motion.div>
      <motion.div variants={sectionVariant}><RequestBook /></motion.div>
    </motion.main>
  )
}
