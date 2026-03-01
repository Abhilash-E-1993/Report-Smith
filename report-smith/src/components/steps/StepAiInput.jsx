// src/components/steps/StepAiInput.jsx
import { useEffect, useState } from "react"
import { generateBody } from "../../services/aiClient"

export default function StepAiInput({ report, onSave }) {
  const [form, setForm] = useState({
    projectDescription: "",
    technologies: "",
    features: "",
    ieeePapers: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!report) return
    setForm({
      projectDescription: report.projectDescription || "",
      technologies: (report.technologies || []).join(", "),
      features: (report.features || []).join(", "),
      ieeePapers: (report.ieeePapers || []).join("\n"),
    })
  }, [report])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveMeta = async () => {
    const technologies = form.technologies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const features = form.features
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const ieeePapers = form.ieeePapers
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    await onSave({
      projectDescription: form.projectDescription,
      technologies,
      features,
      ieeePapers,
    })
  }

  const handleGenerate = async () => {
    if (!report || !Array.isArray(report.sections) || report.sections.length === 0) {
      setError("Define sections first in the Sections step before generating content.")
      return
    }
    if (loading) return

    setError("")
    setLoading(true)
    try {
      await handleSaveMeta()

      const technologies = form.technologies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const features = form.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const ieeePapers = form.ieeePapers
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      const { abstract, sections, bibliography } = await generateBody({
        projectTitle: report.title || "",
        projectDescription: form.projectDescription,
        technologies,
        features,
        ieeePapers,
        sections: report.sections || [],
      })

      await onSave({
        aiContent: {
          abstract,
          sections,
          bibliography,
        },
      })
    } catch (err) {
      console.error(err)
      setError(err?.message || "Failed to generate content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-300">
        Provide extra details so AI can write accurate content without guessing your stack or features.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Project description (your own words)
          </label>
          <textarea
            name="projectDescription"
            value={form.projectDescription}
            onChange={handleChange}
            rows={4}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="Briefly describe what your project does, the problem it solves, and how it works."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Technologies used (comma separated)
          </label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="React, Node.js, Express, Firebase, MySQL"
          />
          <p className="mt-1 text-[10px] text-slate-500">
            AI will be restricted to only these technologies when describing your stack.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Key features (comma separated)
          </label>
          <input
            name="features"
            value={form.features}
            onChange={handleChange}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder="User authentication, real-time chat, admin dashboard, PDF export"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            IEEE / reference papers (one per line)
          </label>
          <textarea
            name="ieeePapers"
            value={form.ieeePapers}
            onChange={handleChange}
            rows={3}
            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            placeholder={"Title of IEEE paper 1\nTitle of IEEE paper 2"}
          />
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleSaveMeta}
          disabled={loading}
          className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
        >
          Save AI inputs
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="text-xs px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate content"}
        </button>
      </div>
    </div>
  )
}
