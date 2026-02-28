import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { createEmptyReport, getUserReports } from "../services/reportService"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [loadError, setLoadError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      setLoadError("")
      try {
        const data = await getUserReports(user.uid)
        setReports(data)
      } catch (err) {
        console.error("Failed to load reports", err)
        setLoadError(err?.message || "Failed to load reports. Check console for index or permission errors.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleCreate = async () => {
    if (!user) return
    setCreating(true)
    setCreateError("")
    try {
      const id = await createEmptyReport(user.uid)
      navigate(`/reports/${id}`)
    } catch (err) {
      const message = err?.message || String(err)
      console.error("Failed to create report", err)
      setCreateError(message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h1 className="font-semibold text-lg">Report‑Smith</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        {createError && (
          <p className="mb-4 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded">
            {createError}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Your reports
          </h2>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="text-sm px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "New report"}
          </button>
        </div>

        {loadError && (
          <p className="mb-4 text-sm text-amber-400 bg-amber-900/30 px-3 py-2 rounded">
            {loadError}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-slate-300">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-slate-300">
            No reports yet. Click &quot;New report&quot; to start.
          </p>
        ) : (
          <ul className="space-y-2">
            {reports.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded border border-slate-700 px-4 py-3 text-sm hover:bg-slate-800 cursor-pointer"
                onClick={() => navigate(`/reports/${r.id}`)}
              >
                <div>
                  <p className="font-medium">
                    {r.title || "Untitled report"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {r.studentName || "No student name yet"}
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {r.academicYear || ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
