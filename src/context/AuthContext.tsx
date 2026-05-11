import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: firebaseUser.email === 'munnimunni8952@gmail.com',
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newUser);
          setIsAdmin(newUser.isAdmin);
        } else {
          const userData = userSnap.data();
          // If the user's email is the admin email but they aren't marked as admin yet, update them
          if (firebaseUser.email === 'munnimunni8952@gmail.com' && !userData?.isAdmin) {
            await setDoc(userRef, { ...userData, isAdmin: true }, { merge: true });
            setIsAdmin(true);
          } else {
            setIsAdmin(userData?.isAdmin || false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    await loginWithGoogle();
  };

  const signOutUser = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
