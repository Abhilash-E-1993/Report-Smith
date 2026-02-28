import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-sm mb-4">Page not found.</p>
      <Link
        to="/"
        className="text-sm text-blue-400 hover:underline"
      >
        Go home
      </Link>
    </div>
  )
}
