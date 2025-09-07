import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useCart } from "@/context/CartContext";
import { Alert } from "react-native";
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig.extra.API_KEY;


export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { addToCart, removeFromCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_KEY}/${id}`);
      const data = await res.json();
      setProduct({
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image || "https://via.placeholder.com/300x300.png?text=No+Image",
      });
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text>Loading product...</Text>
    </View>
  );

  if (!product) return (
    <View style={styles.center}>
      <Text style={{ color: COLORS.text }}>Product not found</Text>
    </View>
  );

  const isInCart = cartItems.some(ci => ci.id === product.id);

  const handleToggleCart = () => {
    if (isInCart) { removeFromCart(product.id);
    Alert.alert("Removed", `${product.title} has been removed from your cart.`);
  } else {addToCart(product);
    Alert.alert("Added", `${product.title} has been added to your cart.`);
  }  
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={[
            styles.toggleCartBtn,
            { backgroundColor: isInCart ? COLORS.primary : COLORS.primary }
          ]}
          onPress={handleToggleCart}
        >
          <Ionicons
            name={isInCart ? "cart" : "cart-outline"}
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.toggleCartText}>
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 300, backgroundColor: COLORS.border },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 8 },
  price: { fontSize: 18, fontWeight: "700", color: COLORS.primary, marginBottom: 12 },
  description: { fontSize: 14, color: COLORS.textLight, lineHeight: 20, marginBottom: 24 },
  toggleCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  toggleCartText: {
    color: COLORS.white,
    fontWeight: "700",
    marginLeft: 8,
  },
});


