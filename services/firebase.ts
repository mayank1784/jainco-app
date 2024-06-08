// /src/services/firebase.ts
//@ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  initializeAuth,
} from "firebase/auth";
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
const emulatorHost = "10.0.2.2";
connectAuthEmulator(auth, `http://${emulatorHost}:9099`);
// if (location.hostname === "localhost") {
// Point to the Storage emulator running on localhost.
connectStorageEmulator(storage, emulatorHost, 9199);
// }

const db = getFirestore(app);
connectFirestoreEmulator(db, emulatorHost, 8080);

const functions = getFunctions(app);
connectFunctionsEmulator(functions, emulatorHost, 5001);

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
