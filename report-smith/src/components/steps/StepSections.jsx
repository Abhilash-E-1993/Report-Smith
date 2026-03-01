import { useEffect, useState } from "react"
import { nanoid } from "nanoid"

export default function StepSections({ report, onSave }) {
  const [sections, setSections] = useState([])

  useEffect(() => {
    if (!report) return
    setSections(Array.isArray(report.sections) ? report.sections : [])
  }, [report])

  const handleSectionTitleChange = (index, value) => {
    setSections((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], title: value }
      return copy
    })
  }

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: nanoid(),
        title: "",
        subsections: [],
      },
    ])
  }

  const handleRemoveSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddSubsection = (sectionIndex) => {
    setSections((prev) => {
      const copy = [...prev]
      const section = copy[sectionIndex]
      const updatedSubsections = [
        ...(section.subsections || []),
        {
          id: nanoid(),
          heading: "",
          content: "",
          images: [],
        },
      ]
      copy[sectionIndex] = {
        ...section,
        subsections: updatedSubsections,
      }
      return copy
    })
  }

  const handleRemoveSubsection = (sectionIndex, subIndex) => {
    setSections((prev) => {
      const copy = [...prev]
      const section = copy[sectionIndex]
      const updatedSubsections = (section.subsections || []).filter(
        (_, i) => i !== subIndex
      )
      copy[sectionIndex] = {
        ...section,
        subsections: updatedSubsections,
      }
      return copy
    })
  }

  const handleSubHeadingChange = (sectionIndex, subIndex, value) => {
    setSections((prev) => {
      const copy = [...prev]
      const section = copy[sectionIndex]
      const subs = [...(section.subsections || [])]
      subs[subIndex] = {
        ...subs[subIndex],
        heading: value,
      }
      copy[sectionIndex] = { ...section, subsections: subs }
      return copy
    })
  }

  const handleSubContentChange = (sectionIndex, subIndex, value) => {
    setSections((prev) => {
      const copy = [...prev]
      const section = copy[sectionIndex]
      const subs = [...(section.subsections || [])]
      subs[subIndex] = {
        ...subs[subIndex],
        content: value,
      }
      copy[sectionIndex] = { ...section, subsections: subs }
      return copy
    })
  }

  const handleSave = () => {
    onSave({ sections })
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-300">
        Define the main sections and subsections of your report body.
        The first section becomes Chapter 1, the second becomes Chapter 2, etc.
      </p>

      <div className="space-y-4">
        {sections.map((section, sIndex) => (
          <div
            key={section.id}
            className="rounded border border-slate-700 bg-slate-900/60 p-3 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Section {sIndex + 1} title (e.g., Introduction, System Design)
                </label>
                <input
                  value={section.title || ""}
                  onChange={(e) =>
                    handleSectionTitleChange(sIndex, e.target.value)
                  }
                  className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  placeholder="Introduction"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSection(sIndex)}
                className="text-[11px] px-2 py-1 mt-5 rounded border border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>

            <div className="space-y-2">
              {(section.subsections || []).map((sub, subIndex) => (
                <div
                  key={sub.id}
                  className="rounded border border-slate-700 bg-slate-950/60 p-2 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      value={sub.heading || ""}
                      onChange={(e) =>
                        handleSubHeadingChange(
                          sIndex,
                          subIndex,
                          e.target.value
                        )
                      }
                      className="flex-1 rounded border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                      placeholder="Subheading (e.g., Problem Statement)"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSubsection(sIndex, subIndex)
                      }
                      className="text-[10px] px-2 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={sub.content || ""}
                    onChange={(e) =>
                      handleSubContentChange(
                        sIndex,
                        subIndex,
                        e.target.value
                      )
                    }
                    className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-[11px] text-slate-100"
                    rows={3}
                    placeholder="Optional draft content. Leave blank to let AI generate this subsection."
                  />
                  <p className="text-[10px] text-slate-500">
                    Images for this subsection will be attached in the Images step.
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAddSubsection(sIndex)}
              className="text-[11px] px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
            >
              + Add subsection
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddSection}
          className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          + Add section
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="text-xs px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
        >
          Save structure
        </button>
      </div>
    </div>
  )
}
