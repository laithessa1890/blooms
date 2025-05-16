'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim() === '') {
        setResults([])
        return
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .ilike('title', `%${query}%`)

      if (!error) setResults(data)
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-xl rounded-lg shadow p-6 relative">
        <button onClick={onClose} className="absolute top-3 left-3 text-gray-500 hover:text-black">✖️</button>
        <input
          type="text"
          placeholder="ابحث عن كتاب..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />
        {results.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map(book => (
              <Link key={book.id} href={`/books/${book.id}`} onClick={onClose}>
                <div className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="w-16 h-20 relative bg-gray-50 flex-shrink-0">
                    <Image src={book.image || '/placeholder.jpg'} alt={book.title} fill className="object-contain rounded" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-[#C05370]">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.category}</p>
                    <p className="text-sm text-[#4C7A68]">{book.price} ل.س</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <p className="text-sm text-gray-500 text-center">لا توجد نتائج</p>
        ) : null}
      </div>
    </div>
  )
}
