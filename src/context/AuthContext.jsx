import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Config is already initialized in src/config/firebase.js, but we need auth instance
// We can import app from there or just let getAuth() find the default app
import { db, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'admin' or 'inspector'
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, fetch Role from Firestore
                // We assume there is a 'users' collection or we store role in 'inspectors'
                // For this implementation, let's assume admins are in a special list 
                // OR we check if the email matches a pattern.
                // BETTER: Check 'inspectors' collection for this email.

                // Temporary Hardcoded Admin Check for Development
                if (user.email === 'admin@aviation.com') { // Replace with real admin logic later
                    setUserRole('admin');
                    setCurrentUser({ ...user, role: 'admin' });
                } else {
                    // Try to find inspector profile
                    // This part would ideally query firestore to find the inspector with this email
                    // For now, default to 'inspector' role
                    setUserRole('inspector');
                    setCurrentUser({ ...user, role: 'inspector' });
                }
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        login,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
