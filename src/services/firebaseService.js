import { db } from '../config/firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc
} from 'firebase/firestore';
import { mockInspectors } from '../data/mockData';

const INSPECTORS_COLLECTION = 'inspectors';
const SUBMISSIONS_COLLECTION = 'submissions';

// --- Seeding ---
export const seedInspectorsToFirebase = async () => {
    try {
        console.log("Starting Seed...");
        const snapshot = await getDocs(collection(db, INSPECTORS_COLLECTION));
        if (!snapshot.empty) {
            console.log("Database already has data. Skipping seed.");
            return;
        }

        const promises = mockInspectors.map(inspector => {
            // Use inspector.id as the document ID for easier lookup
            return setDoc(doc(db, INSPECTORS_COLLECTION, inspector.id), inspector);
        });

        await Promise.all(promises);
        console.log("Seeding complete! Uploaded", mockInspectors.length, "inspectors.");
    } catch (error) {
        console.error("Error seeding data:", error);
    }
};

// --- Inspectors ---
export const getInspectors = async () => {
    const snapshot = await getDocs(collection(db, INSPECTORS_COLLECTION));
    return snapshot.docs.map(doc => doc.data());
};

export const updateInspector = async (id, data) => {
    // We use setDoc with merge: true or updateDoc. 
    // Since our inspector object is nested, be careful with updateDoc regarding dot notation if partial.
    // Here we'll just overwrite the doc or merge updates.
    const ref = doc(db, INSPECTORS_COLLECTION, id);
    await setDoc(ref, data, { merge: true });
};

// --- Submissions ---
export const getPendingSubmissions = async () => {
    const snapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const submitTraining = async (submission) => {
    // Add new doc, let Firebase generate ID or use pre-generated one
    // Ideally we let firebase generate, but frontend might need it immediately.
    // If submission already has ID, use setDoc.
    const newDoc = await addDoc(collection(db, SUBMISSIONS_COLLECTION), submission);
    return { ...submission, id: newDoc.id }; // Return with Firestore ID
};

export const deleteSubmission = async (id) => {
    await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, id));
};

export const bulkAddInspectors = async (inspectors) => {
    const batchPromises = inspectors.map(inspector => {
        const docRef = doc(db, INSPECTORS_COLLECTION, inspector.id);
        return setDoc(docRef, inspector, { merge: true });
    });
    await Promise.all(batchPromises);
};

export const deleteAllInspectors = async () => {
    const snapshot = await getDocs(collection(db, INSPECTORS_COLLECTION));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};
