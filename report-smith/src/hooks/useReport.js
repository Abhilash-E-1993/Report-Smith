import { useEffect, useState, useCallback } from "react"
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../../firebase"

export function useReport(reportId) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!reportId) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const ref = doc(db, "reports", reportId)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setError("Report not found")
          setReport(null)
        } else {
          setReport({ id: snap.id, ...snap.data() })
        }
      } catch (err) {
        console.error("Failed to load report", err)
        setError("Failed to load report")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reportId])

  const savePartial = useCallback(
    async (partial) => {
      if (!reportId) return
      setSaving(true)
      setError(null)
      try {
        const ref = doc(db, "reports", reportId)
        const dataToSave = {
          ...partial,
          updatedAt: serverTimestamp(),
        }
        await updateDoc(ref, dataToSave)
        setReport((prev) => (prev ? { ...prev, ...partial } : prev))
      } catch (err) {
        console.error("Failed to save report", err)
        setError("Failed to save")
      } finally {
        setSaving(false)
      }
    },
    [reportId]
  )

  return { report, loading, saving, error, savePartial }
}
