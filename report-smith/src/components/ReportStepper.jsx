import { REPORT_STEPS } from "../config/reportSteps"

export default function ReportStepper({ currentStep }) {
  return (
    <ol className="flex items-center gap-3 overflow-x-auto text-xs sm:text-sm">
      {REPORT_STEPS.map((step) => {
        const isActive = step.id === currentStep
        const isDone = step.id < currentStep

        return (
          <li
            key={step.id}
            className="flex items-center gap-2"
          >
            <div
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs",
                isActive
                  ? "border-blue-500 bg-blue-500 text-white"
                  : isDone
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-slate-600 bg-slate-800 text-slate-300",
              ].join(" ")}
            >
              {step.id}
            </div>
            <span
              className={
                isActive
                  ? "text-blue-400"
                  : isDone
                  ? "text-slate-200"
                  : "text-slate-400"
              }
            >
              {step.label}
            </span>
            {step.id !== REPORT_STEPS.length && (
              <span className="mx-1 text-slate-600">—</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
