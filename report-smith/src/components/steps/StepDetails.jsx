import { useEffect, useState } from "react"

export default function StepDetails({ report, onSave }) {
  const [form, setForm] = useState({
    title: "",
    studentName: "",
    usn: "",
    guideName: "",
    proctorName: "",
    academicYear: "",
    department: "CSE",
  })

  useEffect(() => {
    if (!report) return
    setForm({
      title: report.title || "",
      studentName: report.studentName || "",
      usn: report.usn || "",
      guideName: report.guideName || "",
      proctorName: report.proctorName || "",
      academicYear: report.academicYear || "",
      department: report.department || "CSE",
    })
  }, [report])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Project title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="AI-Assisted UVCE CSE Project Report Generator"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Student name
          </label>
          <input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            USN
          </label>
          <input
            name="usn"
            value={form.usn}
            onChange={handleChange}
            placeholder="1UVXXCSXXX"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Guide name
          </label>
          <input
            name="guideName"
            value={form.guideName}
            onChange={handleChange}
            placeholder="Prof. XYZ"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Proctor name
          </label>
          <input
            name="proctorName"
            value={form.proctorName}
            onChange={handleChange}
            placeholder="Prof. ABC"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Academic year
          </label>
          <input
            name="academicYear"
            value={form.academicYear}
            onChange={handleChange}
            placeholder="2025–2026"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Department
          </label>
          <input
            name="department"
            value={form.department}
            disabled
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-400"
          />
          <p className="mt-1 text-[10px] text-slate-500">
            Fixed as CSE for Version 1.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          Save details
        </button>
      </div>
    </div>
  )
}
