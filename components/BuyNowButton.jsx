import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  Pressable,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { COLORS } from "../constants/colors";

const BuyNowButton = ({ product }) => {
  const { setCheckoutItem, completePurchase } = useCart();
  const [visible, setVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Animation for Buy Now button
  const scale = useRef(new Animated.Value(1)).current;

  // Payment methods
  const paymentMethods = ["UPI", "Credit Card", "Cash on Delivery"];

  // Create animation values for each method
  const optionAnimations = paymentMethods.map(() => ({
    translateX: useRef(new Animated.Value(100)).current, // start off-screen right
    opacity: useRef(new Animated.Value(0)).current, // start invisible
  }));

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleBuyNow = () => {
    setCheckoutItem(product);
    setQuantity(1);
    setVisible(true);
  };

  const handlePayNow = () => {
    if (!selectedMethod) return alert("Please select a payment method!");

    const itemWithQty = { ...product, quantity };
    completePurchase(selectedMethod, [itemWithQty]);

    alert(`Paid $${(product.price * quantity).toFixed(2)} via ${selectedMethod}`);
    setVisible(false);
  };

  // Animate payment methods when modal opens
  useEffect(() => {
    if (visible) {
      optionAnimations.forEach((anim, index) => {
        Animated.parallel([
          Animated.timing(anim.translateX, {
            toValue: 0,
            duration: 900,
            delay: index * 700,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 900,
            delay: index * 700,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // reset when modal closes
      optionAnimations.forEach((anim) => {
        anim.translateX.setValue(100);
        anim.opacity.setValue(0);
      });
    }
  }, [visible]);

  return (
    <>
      {/* Animated Buy Now button */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBuyNow}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.text}>Buy Now</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Summary</Text>

            {/* Product details */}
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>{product.title}</Text>

              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.productInfo}>Price: ${product.price}</Text>
              <Text style={styles.productTotal}>
                Total: ${(product.price * quantity).toFixed(2)}
              </Text>
            </View>

            <Text style={styles.modalTitle}>Choose Payment Method</Text>

            {paymentMethods.map((method, index) => (
              <Animated.View
                key={method}
                style={{
                  transform: [{ translateX: optionAnimations[index].translateX }],
                  opacity: optionAnimations[index].opacity,
                  width: "100%",
                }}
              >
                <Pressable
                  style={[
                    styles.option,
                    selectedMethod === method && styles.optionSelected,
                  ]}
                  onPress={() => setSelectedMethod(method)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedMethod === method && styles.optionTextSelected,
                    ]}
                  >
                    {method}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}

            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  text: { color: COLORS.white, fontWeight: "700", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  productDetails: { marginBottom: 20, alignItems: "center" },
  productTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  quantityRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  qtyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },
  productInfo: { fontSize: 14, color: COLORS.text, marginTop: 4 },
  productTotal: { fontSize: 16, fontWeight: "700", color: COLORS.primary, marginTop: 4 },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  optionSelected: { backgroundColor: COLORS.primary },
  optionText: { color: COLORS.primary, fontWeight: "600" },
  optionTextSelected: { color: COLORS.white },

  payButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  payButtonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
  cancelText: { marginTop: 10, color: COLORS.textLight },
});

export default BuyNowButton;

