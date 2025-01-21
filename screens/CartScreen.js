import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Header from "../components/Header";

const CartScreen = ({ cartItems }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [storedAddress, setStoredAddress] = useState("");

  useEffect(() => {
    // Load stored address from AsyncStorage
    const loadAddress = async () => {
      const savedAddress = await AsyncStorage.getItem("userAddress");
      if (savedAddress) {
        setStoredAddress(savedAddress);
      }
    };
    loadAddress();
  }, []);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert("Error", "Please add or select an address before ordering.");
      return;
    }

    // Save the new address to AsyncStorage
    await AsyncStorage.setItem("userAddress", address);
    setStoredAddress(address);
    setModalVisible(false);

    // Simulate order confirmation
    Alert.alert(
      "Order Placed",
      "Your order has been placed successfully. Cash on delivery."
    );
  };

  const openModal = () => {
    setAddress(storedAddress || "");
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={tw`h-full`}>
      <Header />

      <View style={tw`flex-1 p-4 bg-gray-100`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Your Cart</Text>

        <ScrollView style={tw`flex-1 mb-24`}>
          {cartItems.length === 0 ? (
            <Text style={tw`text-lg text-gray-600`}>Your cart is empty.</Text>
          ) : (
            cartItems.map((item, index) => (
              <View
                key={`${item._id}_${index}`}
                style={tw`bg-white rounded-lg shadow-sm p-4 mb-4 flex-row items-center`}
              >
                <Image
                  source={{ uri: item.imgLink }}
                  style={tw`w-24 h-24 rounded-lg`}
                  resizeMode="cover"
                />
                <View style={tw`ml-4 flex-1`}>
                  <Text style={tw`text-lg font-bold`}>{item.title}</Text>
                  <Text style={tw`text-green-600 font-semibold`}>
                    ₹{item.price} x {item.quantity}
                  </Text>
                  <Text style={tw`text-gray-600 mt-1`}>
                    Total: ₹{item.price * item.quantity}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Footer Section */}
        {cartItems.length > 0 && (
          <View style={tw`p-4 bg-white`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-xl font-bold`}>
                Total: ₹{calculateTotal().toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={tw`bg-green-600 p-4 rounded-lg`}
              onPress={openModal}
            >
              <Text style={tw`text-xl font-bold text-center text-white`}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Address Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-lg w-4/5`}>
            <Text style={tw`text-xl font-bold mb-4`}>
              Add or Select Address
            </Text>

            <TextInput
              style={tw`border p-3 rounded-lg mb-4`}
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
            />

            {storedAddress && storedAddress !== address && (
              <TouchableOpacity
                style={tw`mb-4`}
                onPress={() => setAddress(storedAddress)}
              >
                <Text style={tw`text-blue-500`}>
                  Use Saved Address: {storedAddress}
                </Text>
              </TouchableOpacity>
            )}

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-green-600 p-3 rounded-lg`}
                onPress={handlePlaceOrder}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  Confirm Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-600 p-3 rounded-lg`}
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-white text-center font-bold`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;
