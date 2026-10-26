import { NotFoundPage } from '@/components/site/NotFoundPage'

// A notFound() call inside the en pages (unknown product, page hidden by the publish guard).
export default function NotFound() {
  return <NotFoundPage locale="en" />
}
