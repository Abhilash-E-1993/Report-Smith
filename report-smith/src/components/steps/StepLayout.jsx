import { useEffect, useState } from "react"

const FOOTER_OPTIONS = [
  { value: "none", label: "No footer" },
  { value: "page-number", label: "Page number only" },
  {
    value: "dept-and-page-number",
    label: "Department + submission month/year + page number",
  },
]

const NUMBERING_OPTIONS = [
  {
    value: "roman-then-arabic",
    label: "Roman numbers for front-matter, Arabic for chapters",
  },
  {
    value: "all-arabic",
    label: "Arabic numbers for all pages",
  },
]

export default function StepLayout({ report, onSave }) {
  const [form, setForm] = useState({
    footerType: "dept-and-page-number",
    prelimNumberingStyle: "roman-then-arabic",
    includeAcknowledgement: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!report) return
    setForm({
      footerType: report.footerType || "dept-and-page-number",
      prelimNumberingStyle:
        report.prelimNumberingStyle || "roman-then-arabic",
      includeAcknowledgement:
        typeof report.includeAcknowledgement === "boolean"
          ? report.includeAcknowledgement
          : true,
    })
  }, [report])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleAck = () => {
    setForm((prev) => ({
      ...prev,
      includeAcknowledgement: !prev.includeAcknowledgement,
    }))
  }

  const handleSave = async () => {
    if (!report) return
    setSaving(true)
    setError("")
    try {
      await onSave(form)
    } catch (e) {
      console.error(e)
      setError("Failed to save layout settings.")
    } finally {
      setSaving(false)
    }
  }

  if (!report) {
    return (
      <p className="text-sm text-slate-300">
        Report not loaded.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-300">
        Choose how the report pages should look. These options affect the DOCX export (footers and page numbering).
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Footer style
          </label>
          <select
            name="footerType"
            value={form.footerType}
            onChange={handleChange}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            {FOOTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-slate-500">
            For UVCE, the recommended option is Department + submission month/year + page number.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Page numbering style
          </label>
          <select
            name="prelimNumberingStyle"
            value={form.prelimNumberingStyle}
            onChange={handleChange}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            {NUMBERING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-slate-500">
            Typical UVCE format uses Roman numerals for front-matter (i, ii, iii) and Arabic for chapters (1, 2, 3).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAck}
            className={[
              "inline-flex items-center rounded-full border px-3 py-1 text-[11px]",
              form.includeAcknowledgement
                ? "border-green-500 bg-green-500/10 text-green-300"
                : "border-slate-600 bg-slate-900 text-slate-300",
            ].join(" ")}
          >
            {form.includeAcknowledgement ? "Acknowledgement: ON" : "Acknowledgement: OFF"}
          </button>
          <span className="text-[10px] text-slate-500">
            Turn off if you plan to write your own acknowledgement manually later.
          </span>
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save layout"}
        </button>
      </div>
    </div>
  )
}
