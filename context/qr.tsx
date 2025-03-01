import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult,
} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { Audio } from "expo-av";
interface ProcessingResult {
  success: boolean;
  message: string;
}

export default function QR() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [torchMode, setTorchMode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState("");
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingResult, setProcessingResult] =
    useState<ProcessingResult | null>(null);

  const scanLineAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission && permission.granted) {
      startScanLineAnimation();
    }
    return () => {
      scanLineAnimation.stopAnimation();
    };
  }, [permission]);

  const playSuccessSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("@/assets/audio/success.mp3"));
      await soundObject.playAsync();
      // Don't forget to unload the sound when finished playing
      setTimeout(() => soundObject.unloadAsync(), 2000);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  const playFailureSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("@/assets/audio/failure.mp3"));
      await soundObject.playAsync();
      // Don't forget to unload the sound when finished playing
      setTimeout(() => soundObject.unloadAsync(), 2000);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  const startScanLineAnimation = () => {
    Animated.loop(
      Animated.timing(scanLineAnimation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const retrieveScan = async (scannedResult: BarcodeScanningResult) => {
    if (scanning) return; // Prevent multiple scans while processing
    setScanning(true);
    setScannedData(scannedResult.data);

    try {
      const response = await processScannedText(scannedResult.data);
      setProcessingResult(response);
      if (response.success) {
        playSuccessSound();
        setTimeout(() => {
          setScanning(false);
          setScannedData("");
          setProcessingResult(null);
        }, 2000);
      } else {
        playFailureSound();
        setTimeout(() => {
          setScanning(false);
          setScannedData("");
          setProcessingResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      playFailureSound();
      setTimeout(() => {
        setScanning(false);
        setScannedData("");
        setProcessingResult(null);
      }, 2000);
    }
  };

  const scanLineInterpolation = scanLineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // value for translateY
  });

  return (
    <SafeAreaView className="h-full bg-zinc-150 w-full">
      <View className="flex-1 justify-center items-center p-4">
        <View className="relative overflow-hidden rounded-xl w-[70vw] h-[35vh] border-2 border-green-500">
          <CameraView
            facing={facing}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            enableTorch={torchMode}
            onBarcodeScanned={retrieveScan}
            className="w-full h-full rounded-xl"
          >
            {scanning && (
              <View style={styles.processingOverlay}>
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}
            {processingResult && (
              <View
                className={`absolute top-0 bottom-0 left-0 right-0 justify-center items-center ${
                  processingResult.success ? "bg-green-300" : "bg-red-500"
                }`}
              >
                <Text
                  className={`text-center ${
                    processingResult.success ? "text-secondary" : "text-black"
                  }`}
                >
                  {processingResult.message}
                </Text>
              </View>
            )}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 150],
                      }),
                    },
                  ],
                },
              ]}
              className="absolute w-full h-1 bg-red-500"
            />
            <TouchableOpacity
              className="absolute bottom-2 left-2 rounded-full bg-black p-1"
              onPress={() => setTorchMode(!torchMode)}
            >
              <Image
                source={torchMode ? icons.flashon : icons.flashoff}
                className="w-8 h-8 rounded-full bg-black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="absolute bottom-2 right-2 rounded-full bg-black p-1"
              onPress={toggleCameraFacing}
            >
              <Image source={icons.cameraIcon} className="w-8 h-8" />
            </TouchableOpacity>
          </CameraView>
        </View>
        <View className="mt-4 p-4 bg-white rounded-md w-full">
          <Text className="text-center text-black">{scannedData}</Text>
          {/* {processingResult && (
            <Text
              className={`text-center ${
                processingResult.success ? "text-secondary" : "text-red-600"
              }`}
            >
              {processingResult.message}
            </Text>
          )} */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  scanLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "red",
    zIndex: 20,
  },

  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  processingText: {
    color: "white",
    fontSize: 18,
  },
});

// Replace this with your actual function to process the scanned text
const processScannedText = async (text: String) => {
  // ... your processing logic here ...

  return {
    success: false, // Replace with actual result
    message: "Scanned text processed successfully!", // Replace with actual message
  };
};
