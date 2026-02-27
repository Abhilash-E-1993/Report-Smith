import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"

function App() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("firebase user =>", user?.email || "no user")
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <h1 className="text-3xl font-bold text-white">Report‑Smith</h1>
    </div>
  )
}

export default App
