import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutButton from "../components/LogoutButton";
import tw from "twrnc";
import Header from "../components/Header";
import { onAuthStateChanged } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";
import { auth } from "../firebase";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Fetch stored name and mobile number on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("fullName");
        const storedMobile = await AsyncStorage.getItem("mobileNumber");

        if (storedName) setFullName(storedName);
        if (storedMobile) setMobileNumber(storedMobile);
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  // Handle saving/updating details
  const handleSaveDetails = async () => {
    if (!fullName || !mobileNumber) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      await AsyncStorage.setItem("fullName", fullName);
      await AsyncStorage.setItem("mobileNumber", mobileNumber);
      Alert.alert("Success", "Details updated successfully.");
    } catch (error) {
      console.error("Error saving to AsyncStorage:", error);
      Alert.alert("Error", "Failed to save details. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView>
      {user ? (
        <View style={tw`relative h-full`}>
          <Header />
          <View>
            <Text style={tw`text-2xl p-2 font-bold text-green-700`}>
              Welcome, {user.email}
            </Text>
          </View>

          <View style={tw`p-4`}>
            <Text style={tw`text-lg font-bold mb-2`}>Full Name</Text>
            <TextInput
              style={tw`bg-gray-200 p-2 rounded-lg mb-4`}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={tw`text-lg font-bold mb-2`}>Mobile Number</Text>
            <TextInput
              style={tw`bg-gray-200 p-2 rounded-lg mb-4`}
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />

            <Button title="Save Details" onPress={handleSaveDetails} />
          </View>

          <View style={tw`absolute bottom-0 left-2`}>
            <LogoutButton />
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
