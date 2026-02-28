import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/app")
    } catch (err) {
      console.error(err)
      setError("Failed to log in. Check email/password.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate("/app")
    } catch (err) {
      console.error(err)
      setError("Google login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-white mb-4">Login</h1>

        {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-white text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-white text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded text-sm font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-3 w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2 rounded text-sm font-medium"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-xs text-slate-300 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
