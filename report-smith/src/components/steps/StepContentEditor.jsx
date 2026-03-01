// src/components/steps/StepContentEditor.jsx
import { useEffect, useState } from "react"

export default function StepContentEditor({ report, onSave }) {
  const [localSections, setLocalSections] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Merge report.sections (structure) with aiContent.sections (content)
  useEffect(() => {
    if (!report || !Array.isArray(report.sections)) {
      setLocalSections([])
      return
    }

    const aiSections = Array.isArray(report.aiContent?.sections)
      ? report.aiContent.sections
      : []

    const merged = report.sections.map((sec, sIndex) => {
      const baseSubsections = Array.isArray(sec.subsections) ? sec.subsections : []
      const aiSec = aiSections[sIndex] || {}
      const aiSubs = Array.isArray(aiSec.subsections) ? aiSec.subsections : []

      const mergedSubs = baseSubsections.map((sub, subIndex) => {
        const aiSub = aiSubs[subIndex] || {}
        return {
          ...sub,
          heading: sub.heading || aiSub.heading || "",
          content:
            aiSub.content ||
            sub.content ||
            "Generated content will appear here after you run AI. You can edit it freely.",
        }
      })

      return {
        ...sec,
        title: sec.title || aiSec.title || "",
        subsections: mergedSubs,
      }
    })

    setLocalSections(merged)
  }, [report])

  const handleSubTextChange = (sectionIndex, subIndex, value) => {
    setLocalSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              subsections: sec.subsections.map((sub, j) =>
                j === subIndex ? { ...sub, content: value } : sub
              ),
            }
          : sec
      )
    )
  }

  const handleSaveAll = async () => {
    if (!report) return
    setSaving(true)
    setError("")
    try {
      // Save edited content back into aiContent.sections as the same array structure
      const aiSections = localSections.map((sec) => ({
        title: sec.title,
        subsections: (sec.subsections || []).map((sub) => ({
          heading: sub.heading,
          content: sub.content || "",
        })),
      }))

      await onSave({
        aiContent: {
          ...(report.aiContent || {}),
          sections: aiSections,
        },
      })
    } catch (e) {
      console.error(e)
      setError("Failed to save content.")
    } finally {
      setSaving(false)
    }
  }

  if (!report) {
    return <p className="text-sm text-slate-300">Report not loaded.</p>
  }

  if (!localSections.length) {
    return (
      <p className="text-sm text-slate-300">
        No sections defined yet. Please define sections in the Sections step first.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-300">
        Review and edit the content for each subsection. Chapter and section numbers are derived
        from the order of sections.
      </p>

      {localSections.map((section, sIndex) => {
        const chapterNumber = sIndex + 1
        return (
          <div key={section.id || sIndex} className="space-y-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-100 border-b border-slate-700 pb-1">
              CHAPTER {chapterNumber}: {section.title || "Untitled Section"}
            </h2>

            {(section.subsections || []).map((sub, subIndex) => {
              const secNumber = `${chapterNumber}.${subIndex + 1}`
              const value = sub.content || ""
              return (
                <div
                  key={sub.id || subIndex}
                  className="mb-3 rounded border border-slate-700 bg-slate-900/60 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {secNumber} {sub.heading || "Untitled Subsection"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Edit the final text that will appear in the report for this subsection.
                      </p>
                    </div>
                  </div>
                  <textarea
                    value={value}
                    onChange={(e) =>
                      handleSubTextChange(sIndex, subIndex, e.target.value)
                    }
                    rows={10} // more height for long content
                    className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                    placeholder="Generated content will appear here after you run AI. You can edit it freely."
                  />
                </div>
              )
            })}
          </div>
        )
      })}

      {error && <p className="text-[11px] text-red-400">{error}</p>}

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save all content"}
        </button>
      </div>
    </div>
  )
}
