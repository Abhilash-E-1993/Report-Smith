import { useEffect, useState } from "react"

const STREAM_OPTIONS = [
  { value: "CSE", label: "B. Tech, Computer Science and Engineering" },
  { value: "AIML", label: "B. Tech, Artificial Intelligence and Machine Learning" },
  { value: "ISE", label: "B. Tech, Information Science and Engineering" },
]

export default function StepDetails({ report, onSave }) {
  const [form, setForm] = useState({
    title: "",
    stream: "CSE",
    semester: "",
    academicYear: "",
    submissionMonthYear: "",
    proctorName: "",
    students: [], // [{ name, usn }]
  })

  useEffect(() => {
    if (!report) return
    setForm({
      title: report.title || "",
      stream: report.stream || "CSE",
      semester: report.semester || "",
      academicYear: report.academicYear || "",
      submissionMonthYear: report.submissionMonthYear || "",
      proctorName: report.proctorName || "",
      students: Array.isArray(report.students) ? report.students : [],
    })
  }, [report])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleStudentChange = (index, field, value) => {
    setForm((prev) => {
      const copy = [...prev.students]
      copy[index] = {
        ...copy[index],
        [field]: value,
      }
      return { ...prev, students: copy }
    })
  }

  const handleAddStudent = () => {
    setForm((prev) => {
      if (prev.students.length >= 4) return prev
      return {
        ...prev,
        students: [...prev.students, { name: "", usn: "" }],
      }
    })
  }

  const handleRemoveStudent = (index) => {
    setForm((prev) => {
      const copy = [...prev.students]
      copy.splice(index, 1)
      return { ...prev, students: copy }
    })
  }

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Project title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="AI-Assisted Project Report Generator for UVCE CSE"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Stream
          </label>
          <select
            name="stream"
            value={form.stream}
            onChange={handleChange}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            {STREAM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Semester
          </label>
          <input
            name="semester"
            value={form.semester}
            onChange={handleChange}
            placeholder="VI Semester"
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
            placeholder="2025–26"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Submission month & year
          </label>
          <input
            name="submissionMonthYear"
            value={form.submissionMonthYear}
            onChange={handleChange}
            placeholder="November 2025"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Proctor and Guide name
          </label>
          <input
            name="proctorName"
            value={form.proctorName}
            onChange={handleChange}
            placeholder="Dr. XYZ"
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          />
          <p className="mt-1 text-[10px] text-slate-500">
            Proctor and Guide are the same person in this format.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-200">
            Students (1–4)
          </h3>
          <button
            type="button"
            onClick={handleAddStudent}
            disabled={form.students.length >= 4}
            className="text-[11px] px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
          >
            + Add student
          </button>
        </div>

        {form.students.length === 0 && (
          <p className="text-[11px] text-slate-400">
            Add at least one student (name and USN).
          </p>
        )}

        <div className="space-y-2">
          {form.students.map((student, index) => (
            <div
              key={index}
              className="grid gap-2 sm:grid-cols-[1fr_minmax(0,1fr)_auto] items-center"
            >
              <input
                placeholder="Student name"
                value={student.name || ""}
                onChange={(e) =>
                  handleStudentChange(index, "name", e.target.value)
                }
                className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <input
                placeholder="USN"
                value={student.usn || ""}
                onChange={(e) =>
                  handleStudentChange(index, "usn", e.target.value)
                }
                className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <button
                type="button"
                onClick={() => handleRemoveStudent(index)}
                className="text-[11px] px-2 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
          ))}
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
