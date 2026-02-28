import { useParams } from "react-router-dom"

export default function ReportWizard() {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <p className="text-sm">
        Report wizard for <span className="font-mono">{id}</span> (we&apos;ll build steps next).
      </p>
    </div>
  )
}
