import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";

const ItemCart = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice } = useCart();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />

            <View style={styles.cardContent}>
              <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPrice}>${item.price}</Text>

              {/* Quantity controls */}
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  onPress={() => decreaseQuantity(item.id)}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="remove" size={18} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => increaseQuantity(item.id)}
                  style={styles.qtyBtn}
                >
                  <Ionicons name="add" size={18} color={COLORS.white} />
                </TouchableOpacity>
              </View>
               <TouchableOpacity onPress={() => removeFromCart(item.id)} style={{ marginTop: 8 }}>
              <Text style={{ color: "red" }}>Remove</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyDesc}>Add items to get started</Text>
          </View>
        }
      />

      {/* Total + Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
          <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => {{
            router.push("/payment")
          }
        }}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ItemCart;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.border },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 4 },
  cardPrice: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    padding: 4,
  },
  qtyText: { fontSize: 14, fontWeight: "700", marginHorizontal: 10, color: COLORS.text },
  emptyState: { alignItems: "center", paddingVertical: 64 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text, marginTop: 16 },
  emptyDesc: { fontSize: 14, color: COLORS.textLight, marginTop: 4, textAlign: "center" },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginTop: 10,
    borderRadius: 16,
  },
  totalText: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 12 },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
});
