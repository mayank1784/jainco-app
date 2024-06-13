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
  db,
} from "@/services/firebase";
import { User, sendEmailVerification } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import { Alert } from "react-native";

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
      if (user?.emailVerified) {
        setCurrentUser(user);
        // } else {
        //   setCurrentUser(null);
      }
      if (currentUser != null) {
        const profileDoc = await getDoc(doc(db, "users", currentUser.uid));
        console.log("profile fetched");
        if (profileDoc.exists()) {
          setProfileData(profileDoc.data());
        }
      } else {
        setProfileData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Sign Up Function
  const signUp = async (form: UserForm) => {
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const profile = credentials.user;
      // Send verification email
      await sendEmailVerification(profile);
      await setDoc(doc(db, "users", profile.uid), {
        name: form.name,
        email: form.email,
        gstin: form.gstin,
        pincode: form.pincode,
        districtName: form.districtName,
        stateName: form.stateName,
        role: "customer",
      });
      // setProfileData({
      //   name: form.name,
      //   email: form.email,
      //   gstin: form.gstin,
      //   pincode: form.pincode,
      //   districtName: form.districtName,
      //   stateName: form.stateName,
      //   role:"customer"
      // });
      // router.replace("/");
      // await signOut();
      Alert.alert(
        "Verification email sent. Please verify your email before logging in."
      );
      router.replace("/sign-in");
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  };

  // Sign In Function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (!user?.emailVerified) {
        await signOut();
        throw new Error("Please verify your email before signing in.");
      }
      setLoading(false);
      // if (user!=null) {
      //   const profileDoc = await getDoc(doc(db, "users", user.uid));
      //   if (profileDoc.exists()) {
      //     setProfileData(profileDoc.data());
      //   }
      // }
    } catch (error: any) {
      throw new Error(error);
      setLoading(false);
    }
  };

  // Sign Out Function
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setProfileData(null);
      setLoading(false);
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
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
