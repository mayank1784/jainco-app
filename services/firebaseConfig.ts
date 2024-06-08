import Constants from "expo-constants";

// Assert the type of Constants.expoConfig and its properties
const expoConfig = Constants.expoConfig as { extra?: Record<string, any> };
const extra = expoConfig.extra || {};

// Extract configuration values with default fallbacks
const firebaseConfig = {
  apiKey: "AIzaSyDNcPc3XU7OzFTToUxSXO8ys-MzXWNVpSs",
  authDomain: "jainco.firebaseapp.com",
  projectId: "jainco",
  storageBucket: "jainco.appspot.com",
  messagingSenderId: "1089768051203",
  appId: "1:1089768051203:web:d14b82df071a384b217436",
};
console.log("config", firebaseConfig);
export default firebaseConfig;
