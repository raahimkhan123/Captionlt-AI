import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    setDoc,
    getDoc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './firebase';
import { CaptionResult } from '../types';

// User Profile Management
export const createUserProfile = async (user: FirebaseUser) => {
    if (!db) return; // DB not configured
    const userRef = doc(db, 'users', user.uid);
    const userProfile = {
        name: user.displayName,
        email: user.email,
        createdAt: serverTimestamp(),
        connectedAccounts: [],
    };
    await setDoc(userRef, userProfile);
};

export const getUserProfile = async (userId: string) => {
    if (!db) return null; // DB not configured
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const updateUserIntegrations = async (userId: string, accounts: string[]) => {
    if (!db) return; // DB not configured
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { connectedAccounts: accounts }, { merge: true });
};

// Caption History Management
export const saveCaptionToHistory = async (userId: string, captionData: CaptionResult): Promise<CaptionResult> => {
    if (!db) { // DB not configured
      // Return the original data without a historyId to allow local state updates
      // Add a temporary, client-side-only ID to differentiate it for keys
      return { ...captionData, historyId: `temp-${Date.now()}` };
    }
    const historyCollectionRef = collection(db, 'users', userId, 'history');
    const docData = {
        ...captionData,
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(historyCollectionRef, docData);
    return { ...captionData, historyId: docRef.id };
};

export const getUserHistory = async (userId: string): Promise<CaptionResult[]> => {
    if (!db) return []; // DB not configured
    const historyCollectionRef = collection(db, 'users', userId, 'history');
    const q = query(historyCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        ...doc.data() as CaptionResult,
        historyId: doc.id,
    }));
};

export const deleteHistoryItem = async (userId: string, historyId: string) => {
    if (!db) return; // DB not configured
    // Don't try to delete temp IDs
    if (historyId.startsWith('temp-')) return;
    const historyItemRef = doc(db, 'users', userId, 'history', historyId);
    await deleteDoc(historyItemRef);
};