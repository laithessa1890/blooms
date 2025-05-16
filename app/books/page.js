import { Suspense } from 'react'
import AllBooksPage from './AllBooksPage'

export default function BooksPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">جارٍ تحميل الكتب...</p>}>
      <AllBooksPage />
    </Suspense>
  )
}
