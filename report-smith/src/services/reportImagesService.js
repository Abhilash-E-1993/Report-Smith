import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    serverTimestamp,
  } from "firebase/firestore"
  import { db } from "../../firebase"
  
  const imagesCol = collection(db, "reportImages")
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  
  export async function listReportImages(reportId, ownerUid) {
    const q = query(
      imagesCol,
      where("reportId", "==", reportId),
      where("ownerUid", "==", ownerUid)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  
  async function uploadToCloudinary(file) {
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary env vars not configured")
    }
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    })
  
    if (!res.ok) {
      const errText = await res.text()
      throw new Error("Cloudinary upload failed: " + errText)
    }
  
    const data = await res.json()
    return data.secure_url
  }
  
  export async function uploadReportImage({ reportId, ownerUid, file }) {
    const fileUrl = await uploadToCloudinary(file)
  
    const now = serverTimestamp()
  
    const docRef = await addDoc(imagesCol, {
      reportId,
      ownerUid,
      imageId: "",
      url: fileUrl,
      caption: "",
      createdAt: now,
      updatedAt: now,
    })
  
    return { id: docRef.id, url: fileUrl, imageId: "", caption: "" }
  }
  
  export async function updateReportImageMeta(imageDocId, { imageId, caption }) {
    const refDoc = doc(db, "reportImages", imageDocId)
    await updateDoc(refDoc, {
      imageId,
      caption,
      updatedAt: serverTimestamp(),
    })
  }
  
  export async function deleteReportImage(imageDocId) {
    const refDoc = doc(db, "reportImages", imageDocId)
    await deleteDoc(refDoc)
  }
  