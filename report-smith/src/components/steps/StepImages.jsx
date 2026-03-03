import { useEffect, useState } from "react"
import {
  listReportImages,
  uploadReportImage,
  updateReportImageMeta,
  deleteReportImage,
} from "../../services/reportImagesService"
import { auth } from "../../../firebase"

export default function StepImages({ report }) {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const ownerUid = auth.currentUser?.uid
  const reportId = report?.id

  useEffect(() => {
    const load = async () => {
      if (!reportId || !ownerUid) {
        setLoading(false)
        return
      }
      try {
        const list = await listReportImages(reportId, ownerUid)
        setImages(list)
      } catch (e) {
        console.error(e)
        setError("Failed to load images.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reportId, ownerUid])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !reportId || !ownerUid) return
    setError("")
    setUploading(true)
    try {
      const created = await uploadReportImage({ reportId, ownerUid, file })
      setImages((prev) => [...prev, { ...created }])
    } catch (e) {
      console.error(e)
      setError("Failed to upload image.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleMetaChange = (id, field, value) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    )
  }

  const handleSaveMeta = async (id) => {
    const img = images.find((i) => i.id === id)
    if (!img) return
    try {
      await updateReportImageMeta(id, {
        imageId: img.imageId || "",
        caption: img.caption || "",
      })
    } catch (e) {
      console.error(e)
      setError("Failed to save image metadata.")
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteReportImage(id)
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (e) {
      console.error(e)
      setError("Failed to delete image.")
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
        Upload screenshots or diagrams and give them IDs like ER_DIAGRAM, SYSTEM_ARCHITECTURE, SCREENSHOT_LOGIN.
        These IDs will be used in the content and DOCX export.
      </p>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Upload image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-xs text-slate-200 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-slate-100 hover:file:bg-slate-600"
        />
        {uploading && (
          <p className="mt-1 text-[11px] text-slate-400">
            Uploading...
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-slate-300">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="text-xs text-slate-400">No images uploaded yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="rounded border border-slate-700 bg-slate-900/60 p-2 space-y-2"
            >
              <div className="aspect-video overflow-hidden rounded bg-slate-800">
                <img
                  src={img.url}
                  alt={img.imageId || "report image"}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-300 mb-1">
                  Image ID (used in content, e.g. ER_DIAGRAM, SCREENSHOT_LOGIN)
                </label>
                <input
                  value={img.imageId || ""}
                  onChange={(e) =>
                    handleMetaChange(img.id, "imageId", e.target.value)
                  }
                  className="w-full rounded border border-slate-600 bg-slate-900 px-2 py-1.5 text-[11px] text-slate-100"
                  placeholder="SCREENSHOT_1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-300 mb-1">
                  Caption (optional)
                </label>
                <input
                  value={img.caption || ""}
                  onChange={(e) =>
                    handleMetaChange(img.id, "caption", e.target.value)
                  }
                  className="w-full rounded border border-slate-600 bg-slate-900 px-2 py-1.5 text-[11px] text-slate-100"
                  placeholder="Login page screenshot"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSaveMeta(img.id)}
                  className="text-[11px] px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="text-[11px] px-2 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
