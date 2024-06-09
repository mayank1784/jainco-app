import Constants from "expo-constants";

// Assert the type of Constants.expoConfig and its properties
const expoConfig = Constants.expoConfig as { extra?: Record<string, any> };
const extra = expoConfig.extra || {};

// Extract configuration values with default fallbacks
const firebaseConfig = {
  // apiKey: "AIzaSyDNcPc3XU7OzFTToUxSXO8ys-MzXWNVpSs",
  // authDomain: "jainco.firebaseapp.com",
  // projectId: "jainco",
  // storageBucket: "jainco.appspot.com",
  // messagingSenderId: "1089768051203",
  // appId: "1:1089768051203:web:d14b82df071a384b217436",
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
// console.log("config", firebaseConfig);
export default firebaseConfig;
