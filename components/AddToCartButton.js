import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useCart } from "@/context/CartContext";
import { Alert } from "react-native";

const AddToCartButton = ({ product, style, iconOnly = false }) => {
  const { cartItems, addToCart } = useCart();

  // Check if product is already in the cart
  const isInCart = cartItems.some((ci) => ci.id === product.id);

  const handlePress = () => {

    if (isInCart) {
      Alert.alert("Notice", `${product.title} is already in your cart.`);
    }
    addToCart(product)
    
    {
      Alert.alert("Added", `${product.title} has been added to your cart.`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isInCart && styles.addedButton, style]}
      onPress={handlePress}
    >
      <Ionicons
        name={isInCart ? "cart" : "cart-outline"}
        size={20}
        color={COLORS.white}
      />
      {!iconOnly && (
        <Text style={styles.text}>
          {isInCart ? "Added" : "Add to Cart"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AddToCartButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  addedButton: {
    backgroundColor: COLORS.primary, // ✅ change to your theme’s success color
  },
  text: {
    color: COLORS.white,
    fontWeight: "900",
    marginLeft: 4,
  },
});
