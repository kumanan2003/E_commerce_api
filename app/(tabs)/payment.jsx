import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";

const PaymentPage = () => {
  const { cartItems, removeFromCart, completePurchase } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("UPI");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (!cartItems.length) {
      Alert.alert("Empty Cart", "Please add items to cart before checkout.");
      return;
    }

    // ✅ Save purchase to history + clear cart
    completePurchase(selectedMethod);

    Alert.alert(
      "Payment Successful 🎉",
      `Paid $${total.toFixed(2)} via ${selectedMethod}`,
      [
        {
          text: "OK",
          onPress: () => {
            router.replace("/user"); // ✅ Navigate to user page
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.bannerWrapper}>
        <Text style={styles.bannerText}>Checkout</Text>
      </View>

      {/* Cart Items with Images */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              contentFit="contain"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        }
      />

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        {["UPI", "Credit Card", "Cash on Delivery"].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.methodButton,
              selectedMethod === method && styles.methodSelected,
            ]}
            onPress={() => setSelectedMethod(method)}
          >
            <Ionicons
              name={
                selectedMethod === method
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.methodText}>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total + Pay */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  bannerWrapper: { alignItems: "center", marginBottom: 20 },
  bannerText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: COLORS.border },
  itemTitle: { fontSize: 14, color: COLORS.text, marginBottom: 4 },
  itemPrice: { fontSize: 14, fontWeight: "bold", color: COLORS.primary },
  emptyCart: { textAlign: "center", marginTop: 40, color: COLORS.textLight },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: COLORS.text },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  methodSelected: { borderWidth: 2, borderColor: COLORS.primary },
  methodText: { fontSize: 14, color: COLORS.text },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  payText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});

