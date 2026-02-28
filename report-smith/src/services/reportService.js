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
  try {
    const now = serverTimestamp()
    const docRef = await addDoc(reportsCol, {
      ownerUid,
      title: "",
      studentName: "",
      usn: "",
      guideName: "",
      proctorName: "",
      academicYear: "",
      department: "CSE",

      footerType: "dept-and-page-number",
      prelimNumberingStyle: "roman-then-arabic",
      includeAcknowledgement: true,

      aiContent: {},
      // manualContent: {}, // later if needed

      createdAt: now,
      updatedAt: now,
    })
    return docRef.id
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.includes("permission") || err?.code === "permission-denied") {
      throw new Error(
        "Cannot create report: Firestore rules denied. Allow create on 'reports' for authenticated users."
      )
    }
    throw err
  }
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
