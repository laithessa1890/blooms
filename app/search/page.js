import { Suspense } from 'react'
import SearchPage from './SearchPage'

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center py-10">🔎 جارٍ البحث...</p>}>
      <SearchPage />
    </Suspense>
  )
}
