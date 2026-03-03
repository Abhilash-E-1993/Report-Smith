// src/pages/ReportWizard.jsx
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useReport } from "../hooks/useReport"
import ReportStepper from "../components/ReportStepper"
import StepDetails from "../components/steps/StepDetails"
import StepLayout from "../components/steps/StepLayout"
import StepSections from "../components/steps/StepSections"
import StepAiInput from "../components/steps/StepAiInput"
import StepContentEditor from "../components/steps/StepContentEditor"
import StepImages from "../components/steps/StepImages" // make sure this file exists

export default function ReportWizard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { report, loading, saving, error, savePartial } = useReport(id)
  const [step, setStep] = useState(1)

  if (!user) {
    // ProtectedRoute should already handle this, but just in case
    return null
  }

  const handleBackToDashboard = () => {
    navigate("/app")
  }

  const goNext = () => {
    setStep((prev) => Math.min(prev + 1, 7)) // 1–7 steps total
  }

  const goPrev = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        Loading report...
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <p className="mb-3 text-sm">
          {error || "Report not found."}
        </p>
        <button
          onClick={handleBackToDashboard}
          className="text-xs px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
        >
          Back to dashboard
        </button>
      </div>
    )
  }

  if (report.ownerUid !== user.uid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <p className="mb-3 text-sm">
          You do not have access to this report.
        </p>
        <button
          onClick={handleBackToDashboard}
          className="text-xs px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
        >
          Back to dashboard
        </button>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepDetails
            report={report}
            onSave={(data) => savePartial(data)}
          />
        )
      case 2:
        return (
          <StepLayout
            report={report}
            onSave={(data) => savePartial(data)}
          />
        )
      case 3:
        return (
          <StepSections
            report={report}
            onSave={(data) => savePartial(data)}
          />
        )
      case 4:
        return (
          <StepAiInput
            report={report}
            onSave={(data) => savePartial(data)}
          />
        )
      case 5:
        return (
          <StepContentEditor
            report={report}
            onSave={(data) => savePartial(data)}
          />
        )
      case 6:
        return (
          <StepImages
            report={report}
            onSave={(data) => savePartial(data)}
          />
        )
      default:
        // Step 7: preview / export (to be implemented)
        return (
          <div className="text-sm text-slate-200">
            <p>Step {step} content goes here.</p>
            <p className="mt-2 text-xs text-slate-400">
              Report ID: {report.id}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <button
          onClick={handleBackToDashboard}
          className="text-xs text-slate-300 hover:text-white"
        >
          ← Back
        </button>
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold">
            {report.title || "Untitled report"}
          </span>
          <span className="text-[10px] text-slate-400">
            {saving ? "Saving..." : "Saved"}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <ReportStepper currentStep={step} />

        <div className="mt-6 rounded border border-slate-700 bg-slate-800/60 p-4">
          {renderStepContent()}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={step === 1}
            className="text-xs px-3 py-2 rounded border border-slate-600 text-slate-200 disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={step === 7}
            className="text-xs px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
