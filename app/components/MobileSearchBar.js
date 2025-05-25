'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function MobileSearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) return setResults([])

      const { data, error } = await supabase
        .from('books')
        .select('id, title, image')
        .ilike('title', `%${query}%`)

      if (!error) setResults(data)
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <div className="block md:hidden px-4 pt-4" dir="rtl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 ابحث عن كتاب..."
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C05370]"
      />

      {query && (
        <div className="bg-white border mt-2 rounded shadow max-h-80 overflow-y-auto space-y-2 py-2 px-2">
          {results.length > 0 ? results.map(book => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="flex items-center gap-3 hover:bg-[#F4EDE4] px-2 py-2 rounded transition"
              onClick={() => setQuery('')}
            >
              <div className="relative w-12 h-16 flex-shrink-0 border bg-gray-100 rounded">
                <Image
                  src={book.image || '/placeholder.jpg'}
                  alt={book.title}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <p className="text-sm text-[#4C7A68] font-medium">{book.title}</p>
            </Link>
          )) : (
            <p className="px-2 py-1 text-sm text-gray-500">لا توجد نتائج</p>
          )}
        </div>
      )}
    </div>
  )
}
