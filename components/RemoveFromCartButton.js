import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useCart } from "@/context/CartContext";

const RemoveFromCartButton = ({ productId, style, iconOnly = false }) => {
  const { removeFromCart } = useCart();

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => removeFromCart(productId)}
    >
      <Ionicons name="trash-outline" size={20} color={COLORS.white} />
      {!iconOnly && <Text style={styles.text}> Remove</Text>}
    </TouchableOpacity>
  );
};

export default RemoveFromCartButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary || "brown", // fallback red if no COLORS.danger
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  text: { color: COLORS.white, fontWeight: "700", marginLeft: 6 },
});
