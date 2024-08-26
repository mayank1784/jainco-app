// /src/services/firebase.ts
//@ts-ignore
// import { getReactNativePersistence } from "firebase/auth/react-native";

import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import firebaseConfig from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const app = initializeApp(firebaseConfig);
console.log("firebase initialised");

const storage = getStorage();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

auth.useDeviceLanguage();
// const emulatorHost = "10.0.2.2";
// const emulatorHost = "192.168.1.6";
// connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
// if (location.hostname === "localhost") {
// Point to the Storage emulator running on localhost.
// connectStorageEmulator(storage, emulatorHost, 9199);
// }

const db = getFirestore(app);
// connectFirestoreEmulator(db, emulatorHost, 8080);

const functions = getFunctions(app);
// connectFunctionsEmulator(functions, emulatorHost, 5001);

export {
  app,
  auth,
  db,
  functions,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  storage,
};

// // /src/services/firebase.ts
// import { FirebaseApp, initializeApp, getApps } from "firebase/app";
// import {
//   Auth,
//   connectAuthEmulator,
//   signInWithEmailAndPassword,
//   signOut,
//   createUserWithEmailAndPassword,
//   initializeAuth,
//   getReactNativePersistence
// } from "firebase/auth";
// import { Firestore, getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { Functions, getFunctions, connectFunctionsEmulator } from "firebase/functions";
// import { FirebaseStorage, getStorage, connectStorageEmulator } from "firebase/storage";
// import firebaseConfig from "./firebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Initialize Firebase app and services with explicit types

// let auth: Auth;
// let db: Firestore;
// let functions: Functions;
// let storage: FirebaseStorage;

// export const initializeFirebase = async () => {
//   if (!getApps().length) {
//     const app = initializeApp(firebaseConfig);

//     // Initialize Firebase Auth with AsyncStorage persistence
//     initializeAuth(app, {
//       persistence: getReactNativePersistence(AsyncStorage),
//     });

//     // Initialize Firestore and Storage
//     getFirestore(app);
//     getStorage(app);
//   }
// };
//     // Optional: Connect to emulators if needed
//     // const emulatorHost = "192.168.1.6"; // Update with your local IP address
//     // if (__DEV__) {
//     //   connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
//     //   connectFirestoreEmulator(db, emulatorHost, 8080);
//     //   connectFunctionsEmulator(functions, emulatorHost, 5001);
//     //   connectStorageEmulator(storage, emulatorHost, 9199);
//     // }

// // };

// // Export the Firebase services for use in your app
// export {
//   auth,
//   db,
//   functions,
//   storage,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
// };
