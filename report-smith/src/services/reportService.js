import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../../firebase"

// collection refs
const reportsCol = collection(db, "reports")
export async function createEmptyReport(ownerUid) {
  const now = serverTimestamp()
  const docRef = await addDoc(reportsCol, {
    ownerUid,

    title: "",
    stream: "CSE",
    semester: "",
    academicYear: "",
    submissionMonthYear: "",
    proctorName: "",
    students: [],

    footerType: "dept-and-page-number",
    prelimNumberingStyle: "roman-then-arabic",
    includeAcknowledgement: true,

    // NEW
    sections: [],        // user will define later
    aiContent: {
      abstract: "",
      sections: {},
      bibliography: [],
    },

    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}


export async function getUserReports(ownerUid) {
  try {
    const q = query(
      reportsCol,
      where("ownerUid", "==", ownerUid),
      orderBy("createdAt", "desc")
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    const msg = err?.message || String(err)
    const needsIndex = msg.includes("index") || err?.code === "failed-precondition"

    // Clear the "requires an index" error by falling back to an un-ordered query
    // and sorting client-side. If you later create the index, the ordered query
    // above will work and be more efficient.
    if (needsIndex) {
      const fallbackQ = query(reportsCol, where("ownerUid", "==", ownerUid))
      const snap = await getDocs(fallbackQ)
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      items.sort((a, b) => {
        const aSec = a?.createdAt?.seconds ?? 0
        const bSec = b?.createdAt?.seconds ?? 0
        return bSec - aSec
      })
      return items
    }

    throw err
  }
}

export async function getReportById(id) {
  const ref = doc(db, "reports", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}
