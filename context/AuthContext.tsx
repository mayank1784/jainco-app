import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  db
} from "@/services/firebase";
import { User } from "firebase/auth";
import {collection, doc, setDoc, getDoc} from "firebase/firestore"
import { router } from "expo-router";

interface AuthContextType {
  currentUser: User | null;
  profileData: any | null;
  signUp: (form: UserForm) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}
interface UserForm {
  name: string;
  email: string;
  password: string;
  gstin: string;
  pincode: string;
  districtName: string;
  stateName: string;
}
// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          setProfileData(profileDoc.data());
        }
      } else {
        setProfileData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign Up Function
  const signUp = async (form:UserForm) => {
    try {
      const credentials = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const profile = credentials.user
      await setDoc(doc(db, "users", profile.uid), {
        name: form.name,
        email: form.email,
        gstin: form.gstin,
        pincode: form.pincode,
        districtName: form.districtName,
        stateName: form.stateName,
        role:"customer"
      });
      setProfileData({
        name: form.name,
        email: form.email,
        gstin: form.gstin,
        pincode: form.pincode,
        districtName: form.districtName,
        stateName: form.stateName,
        role:"customer"
      });
      // router.replace("/");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // Sign In Function
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          setProfileData(profileDoc.data());
        }
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  // Sign Out Function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setProfileData(null);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const value: AuthContextType = {
    currentUser,
    profileData,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
